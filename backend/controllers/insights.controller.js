import Transaction from '../models/Transaction.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'

/**
 * @desc    Get Financial Health Score
 * @route   GET /api/insights/financial-health
 * @access  Private
 */
export const getFinancialHealth = asyncHandler(async (req, res) => {
  const userId = req.user._id

  // Fetch all transactions for this user
  const transactions = await Transaction.find({ user: userId })

  if (transactions.length === 0) {
    return res.status(200).json({
      success: true,
      score: 75,
      status: 'Pristine',
      metrics: {
        totalIncome: 0,
        totalExpenses: 0,
        savingsRatio: 0,
        consistentBudgeting: true,
      },
      suggestions: [
        'Welcome! Add some income and expense transactions to unlock your personalized AI Financial Health Score.',
        'Review the Indian Income Tax comparative calculator in the left panel to optimize your baseline deductions.',
      ],
    })
  }

  // Calculate overall aggregates
  let totalIncome = 0
  let totalExpenses = 0
  
  // Group by month to check consistent budgeting
  const monthlyTotals = {}

  transactions.forEach((t) => {
    const amount = t.amount
    const monthKey = new Date(t.date).toISOString().substring(0, 7) // YYYY-MM
    
    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = { income: 0, expenses: 0 }
    }

    if (t.type === 'income') {
      totalIncome += amount
      monthlyTotals[monthKey].income += amount
    } else {
      totalExpenses += amount
      monthlyTotals[monthKey].expenses += amount
    }
  })

  // Calculate Savings Ratio
  const savings = totalIncome - totalExpenses
  const savingsRatio = totalIncome > 0 ? (savings / totalIncome) * 100 : 0

  // 1. Scoring Logic Core
  let score = 60 // Base baseline score

  // Contribution from Savings Ratio
  if (savingsRatio >= 40) {
    score += 25
  } else if (savingsRatio >= 20) {
    score += 15
  } else if (savingsRatio >= 10) {
    score += 5
  } else if (savingsRatio < 0) {
    score -= 15 // Net deficit penalty
  }

  // Contribution from Month-on-Month Deficits (MoM Overspending check)
  let deficitMonths = 0
  let trackedMonths = 0
  Object.keys(monthlyTotals).forEach((key) => {
    trackedMonths++
    if (monthlyTotals[key].expenses > monthlyTotals[key].income && monthlyTotals[key].income > 0) {
      deficitMonths++
    }
  })

  if (deficitMonths === 0 && trackedMonths > 0) {
    score += 15 // Healthy budgeting bonus
  } else {
    score -= deficitMonths * 8 // Penalty per overspent month
  }

  // Penalty for excessive discretionary spending
  let discretionarySpend = 0
  transactions.forEach((t) => {
    if (t.type === 'expense' && ['Shopping', 'Entertainment', 'Other'].includes(t.category)) {
      discretionarySpend += t.amount
    }
  })
  const discretionaryRatio = totalExpenses > 0 ? (discretionarySpend / totalExpenses) * 100 : 0
  if (discretionaryRatio > 40) {
    score -= 10
  }

  // Clamp Health Score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)))

  // Determine health status rank
  let status = 'Need Attention'
  if (score >= 85) status = 'Excellent'
  else if (score >= 70) status = 'Good'
  else if (score >= 50) status = 'Average'

  // Generate customized suggestions
  const suggestions = []
  if (savingsRatio < 15) {
    suggestions.push('Your savings ratio is currently below the recommended 20% mark. Discretionary expenses can be audited under Shopping or Food to free up capital.')
  } else {
    suggestions.push('Excellent saving habits! Ensure this surplus is actively channeled into long-term wealth generators like Mutual Funds or ELSS.')
  }

  if (deficitMonths > 0) {
    suggestions.push(`We identified monthly deficits in ${deficitMonths} month(s). Track recurring subscriptions and limit impulse shopping during weekends.`)
  }

  if (discretionaryRatio > 35) {
    suggestions.push(`Discretionary categories (Shopping & Entertainment) comprise ${Math.round(discretionaryRatio)}% of your expenses. Creating a custom budget limit here can boost your health score.`)
  }

  res.status(200).json({
    success: true,
    score,
    status,
    metrics: {
      totalIncome,
      totalExpenses,
      savingsRatio: Math.round(savingsRatio * 100) / 100,
      discretionaryRatio: Math.round(discretionaryRatio * 100) / 100,
      deficitMonths,
      trackedMonths,
    },
    suggestions,
  })
})

/**
 * @desc    Get Spending Patterns
 * @route   GET /api/insights/spending-patterns
 * @access  Private
 */
export const getSpendingPatterns = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const transactions = await Transaction.find({ user: userId })

  if (transactions.length === 0) {
    return res.status(200).json({
      success: true,
      patterns: {
        highestCategory: 'N/A',
        highestAmount: 0,
        weekendOverspending: false,
        weekendAvg: 0,
        weekdayAvg: 0,
        spendingSpikes: [],
        recurringExpenses: [],
        unnecessarySpendRatio: 0,
      },
    })
  }

  // 1. Highest spending category aggregation
  const categoryTotals = {}
  let totalExpenseAmount = 0
  let totalDiscretionaryAmount = 0

  transactions.forEach((t) => {
    if (t.type === 'expense') {
      totalExpenseAmount += t.amount
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      
      if (['Shopping', 'Entertainment', 'Other'].includes(t.category)) {
        totalDiscretionaryAmount += t.amount
      }
    }
  })

  let highestCategory = 'None'
  let highestAmount = 0
  Object.keys(categoryTotals).forEach((cat) => {
    if (categoryTotals[cat] > highestAmount) {
      highestAmount = categoryTotals[cat]
      highestCategory = cat
    }
  })

  // 2. Weekend vs Weekday overspending
  let weekdaySum = 0
  let weekdayCount = 0
  let weekendSum = 0
  let weekendCount = 0

  transactions.forEach((t) => {
    if (t.type === 'expense') {
      const day = new Date(t.date).getDay() // 0 = Sunday, 6 = Saturday
      if (day === 0 || day === 6) {
        weekendSum += t.amount
        weekendCount++
      } else {
        weekdaySum += t.amount
        weekdayCount++
      }
    }
  })

  const weekdayAvg = weekdayCount > 0 ? weekdaySum / weekdayCount : 0
  const weekendAvg = weekendCount > 0 ? weekendSum / weekendCount : 0
  const weekendOverspending = weekendAvg > weekdayAvg * 1.4 && weekendAvg > 200

  // 3. Spending Spikes Detection (transactions > 3x average expense size)
  const expensesOnly = transactions.filter(t => t.type === 'expense')
  const avgExpenseSize = expensesOnly.length > 0 
    ? expensesOnly.reduce((sum, e) => sum + e.amount, 0) / expensesOnly.length
    : 0

  const spendingSpikes = []
  expensesOnly.forEach((e) => {
    if (e.amount > avgExpenseSize * 2.5 && e.amount > 1000) {
      spendingSpikes.push({
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: e.date,
        multiple: Math.round((e.amount / avgExpenseSize) * 10) / 10,
      })
    }
  })

  // 4. Recurring Expenses detection (same title & category in different months)
  const titleGroups = {}
  expensesOnly.forEach((e) => {
    const cleanTitle = e.title.trim().toLowerCase()
    if (!titleGroups[cleanTitle]) {
      titleGroups[cleanTitle] = []
    }
    titleGroups[cleanTitle].push(e)
  })

  const recurringExpenses = []
  Object.keys(titleGroups).forEach((title) => {
    const list = titleGroups[title]
    if (list.length >= 2) {
      // Check if they happen in distinct months
      const months = new Set(list.map(e => new Date(e.date).getMonth()))
      if (months.size >= 2) {
        // Average amount
        const avgAmt = list.reduce((s, e) => s + e.amount, 0) / list.length
        recurringExpenses.push({
          title: list[0].title,
          category: list[0].category,
          avgAmount: Math.round(avgAmt),
          occurrences: list.length,
        })
      }
    }
  })

  res.status(200).json({
    success: true,
    patterns: {
      highestCategory,
      highestAmount,
      weekendOverspending,
      weekendAvg: Math.round(weekendAvg),
      weekdayAvg: Math.round(weekdayAvg),
      spendingSpikes: spendingSpikes.slice(0, 3), // Return top 3 spikes
      recurringExpenses: recurringExpenses.slice(0, 4), // Return top 4 recurring
      unnecessarySpendRatio: totalExpenseAmount > 0 ? Math.round((totalDiscretionaryAmount / totalExpenseAmount) * 100) : 0,
    },
  })
})

/**
 * @desc    Get Smart Recommendations
 * @route   GET /api/insights/recommendations
 * @access  Private
 */
export const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const transactions = await Transaction.find({ user: userId })

  // Initialize recommendations array
  const recommendations = []

  // 1. Core savings baseline audit
  let totalIncome = 0
  let totalExpenses = 0
  let foodExpenses = 0
  let shoppingExpenses = 0
  let entertainmentExpenses = 0

  transactions.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += t.amount
    } else {
      totalExpenses += t.amount
      if (t.category === 'Food') foodExpenses += t.amount
      if (t.category === 'Shopping') shoppingExpenses += t.amount
      if (t.category === 'Entertainment') entertainmentExpenses += t.amount
    }
  })

  const savingsRatio = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  if (savingsRatio < 20) {
    recommendations.push({
      id: 'rec_savings_booster',
      title: 'Discretionary Budget Cut',
      description: 'Your savings ratio is currently below the target 20% mark. Aim to reduce restaurant orders (Food) or clothing checkouts (Shopping) by 15% this month to establish a stable emergency fund.',
      category: 'Savings',
      impact: 'High',
      action: 'Set expense limit',
    })
  }

  // 2. Food / restaurant spending spike
  const foodRatio = totalExpenses > 0 ? (foodExpenses / totalExpenses) * 100 : 0
  if (foodRatio > 25) {
    recommendations.push({
      id: 'rec_food_optimize',
      title: 'Optimize Dining Outlets',
      description: `Dining and food deliveries comprise ${Math.round(foodRatio)}% of your expense profile. Cooking meals at home or optimizing Zomato/Swiggy subscription plans can yield immediate monthly savings.`,
      category: 'Food',
      impact: 'Medium',
      action: 'Audit food bills',
    })
  }

  // 3. Entertainment subscriptions audit
  const entRatio = totalExpenses > 0 ? (entertainmentExpenses / totalExpenses) * 100 : 0
  if (entRatio > 10 || entertainmentExpenses > 2000) {
    recommendations.push({
      id: 'rec_sub_audit',
      title: 'Cancel Inactive Subscriptions',
      description: 'Entertainment items and auto-renewals represent a noticeable expense buffer. Perform an audit of your active streaming, music, or cloud subscriptions and cancel inactive duplicates.',
      category: 'Entertainment',
      impact: 'Medium',
      action: 'Review subscriptions',
    })
  }

  // 4. Tax comparative synergy (Integrates with Indian Tax Calculator!)
  const userSalary = req.user.salary || 0
  if (userSalary > 700000) {
    recommendations.push({
      id: 'rec_tax_saving',
      title: 'Maximize Indian Section 80C Deductions',
      description: `With an annual salary of ₹${userSalary.toLocaleString('en-IN')}, you are in a tax bracket where leveraging 80C (PPF, ELSS, NPS) can dramatically reduce your tax liability by up to ₹1,50,000. Try our Comparative Tax Calculator!`,
      category: 'Tax Optimizer',
      impact: 'Critical',
      action: 'Open Tax Calculator',
    })
  }

  // 5. Emergency reserves baseline
  const emergencyTarget = totalExpenses * 3
  if (totalExpenses > 0) {
    recommendations.push({
      id: 'rec_emergency_reserve',
      title: 'Emergency Fund Target',
      description: `Establish an emergency liquidity buffer of ₹${Math.round(emergencyTarget).toLocaleString('en-IN')} (representing 3 months of average expenses) locked in high-interest recurring deposits (FD/RD) or liquid funds.`,
      category: 'Savings',
      impact: 'High',
      action: 'Create reserve',
    })
  }

  res.status(200).json({
    success: true,
    recommendations,
  })
})
