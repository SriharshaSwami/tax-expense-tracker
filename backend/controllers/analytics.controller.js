import Transaction from '../models/Transaction.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

// @desc    Get monthly income, expense and balance totals for the last 6 months
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthlyAnalytics = asyncHandler(async (req, res) => {
  const today = new Date()
  // Boundary starts 5 calendar months ago (total 6 months: current month + past 5 months)
  const startOfRange = new Date(today.getFullYear(), today.getMonth() - 5, 1)
  startOfRange.setHours(0, 0, 0, 0)

  const results = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: startOfRange },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        income: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
        },
        expense: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
        },
      },
    },
  ])

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const finalData = []

  // Ensure all 6 months are fully backfilled in chronological order
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const year = targetDate.getFullYear()
    const monthNum = targetDate.getMonth() + 1 // 1-indexed

    const matchedMonth = results.find(
      (r) => r._id.year === year && r._id.month === monthNum
    )

    const income = matchedMonth ? matchedMonth.income : 0
    const expense = matchedMonth ? matchedMonth.expense : 0

    finalData.push({
      month: monthNames[monthNum - 1],
      income,
      expense,
      balance: income - expense,
      year,
      monthNum,
    })
  }

  res.status(200).json({
    success: true,
    data: finalData,
  })
})

// @desc    Get total spending per category and percentage distribution for expenses only
// @route   GET /api/analytics/category-breakdown
// @access  Private
export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  // Aggregate total expenses sum first
  const totalExpenseAggregate = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ])

  const totalExpense = totalExpenseAggregate.length > 0 ? totalExpenseAggregate[0].total : 0

  // Aggregate by category
  const breakdown = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
      },
    },
    {
      $group: {
        _id: '$category',
        amount: { $sum: '$amount' },
      },
    },
    {
      $sort: { amount: -1 },
    },
  ])

  const finalBreakdown = breakdown.map((item) => {
    const percentage = totalExpense > 0 
      ? parseFloat(((item.amount / totalExpense) * 100).toFixed(1))
      : 0
    return {
      category: item._id,
      amount: item.amount,
      percentage,
    }
  })

  res.status(200).json({
    success: true,
    data: finalBreakdown,
  })
})

// @desc    Generate smart insights and recent trends
// @route   GET /api/analytics/recent-trends
// @access  Private
export const getRecentTrends = asyncHandler(async (req, res) => {
  const today = new Date()

  // 1. Current Month boundaries
  const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  startOfCurrentMonth.setHours(0, 0, 0, 0)
  const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

  // 2. Last Month boundaries
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  startOfLastMonth.setHours(0, 0, 0, 0)
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999)

  // Fetch all transactions to process stats
  const allUserTransactions = await Transaction.find({ user: req.user._id })
  const totalTransactions = allUserTransactions.length

  let currentMonthIncome = 0
  let currentMonthExpense = 0
  let lastMonthExpense = 0

  allUserTransactions.forEach((t) => {
    const tDate = new Date(t.date)
    if (tDate >= startOfCurrentMonth && tDate <= endOfCurrentMonth) {
      if (t.type === 'income') {
        currentMonthIncome += t.amount
      } else if (t.type === 'expense') {
        currentMonthExpense += t.amount
      }
    } else if (tDate >= startOfLastMonth && tDate <= endOfLastMonth) {
      if (t.type === 'expense') {
        lastMonthExpense += t.amount
      }
    }
  })

  // Calculate current month's savings rate
  const currentMonthSavings = currentMonthIncome - currentMonthExpense
  const savingsRate = currentMonthIncome > 0
    ? parseFloat(((currentMonthSavings / currentMonthIncome) * 100).toFixed(1))
    : 0

  // Calculate current vs last month expense delta shift
  let spendingChangePercentage = 0
  if (lastMonthExpense > 0) {
    spendingChangePercentage = parseFloat(
      (((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100).toFixed(1)
    )
  } else if (currentMonthExpense > 0) {
    spendingChangePercentage = 100
  }

  // Highest spending category overall
  const categorySpend = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
    {
      $sort: { total: -1 },
    },
    {
      $limit: 1,
    },
  ])

  const highestSpendingCategory = categorySpend.length > 0
    ? { category: categorySpend[0]._id, amount: categorySpend[0].total }
    : { category: 'None', amount: 0 }

  // Highest expense month in the last 6 months
  const startOf6Months = new Date(today.getFullYear(), today.getMonth() - 5, 1)
  const monthlySpend = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        date: { $gte: startOf6Months },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        total: { $sum: '$amount' },
      },
    },
    {
      $sort: { total: -1 },
    },
    {
      $limit: 1,
    },
  ])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const highestExpenseMonth = monthlySpend.length > 0
    ? {
        month: `${monthNames[monthlySpend[0]._id.month - 1]} ${monthlySpend[0]._id.year}`,
        amount: monthlySpend[0].total,
      }
    : { month: 'None', amount: 0 }

  // Smart assessment for financial health
  let financialHealth = 'Fair'
  if (savingsRate >= 30) {
    financialHealth = 'Excellent'
  } else if (savingsRate >= 15) {
    financialHealth = 'Healthy'
  } else if (savingsRate >= 0) {
    financialHealth = 'Fair'
  } else {
    financialHealth = 'Caution'
  }

  res.status(200).json({
    success: true,
    insights: {
      highestSpendingCategory,
      highestExpenseMonth,
      spendingChangePercentage,
      savingsRate,
      totalTransactions,
      financialHealth,
      currentMonthIncome,
      currentMonthExpense,
      lastMonthExpense,
    },
  })
})
