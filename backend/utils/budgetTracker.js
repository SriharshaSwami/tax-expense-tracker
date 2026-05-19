import Transaction from '../models/Transaction.js'
import Budget from '../models/Budget.js'
import Notification from '../models/Notification.js'

/**
 * Recalculates category budget spentAmount for a specific user, month, and year.
 * Generates warning alerts or exceeded alerts if budget limits are breached.
 * 
 * @param {string} userId - ID of the User
 * @param {string} category - Category to query (e.g., Food, Travel)
 * @param {number} month - Calendar Month (1-12)
 * @param {number} year - Calendar Year
 */
export const recalculateBudget = async (userId, category, month, year) => {
  try {
    // 1. Calculate boundaries of the UTC month
    const startDate = new Date(Date.UTC(year, month - 1, 1))
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))

    // 2. Aggregate all expense transactions in the month/category
    const transactions = await Transaction.find({
      user: userId,
      type: 'expense',
      category,
      date: { $gte: startDate, $lte: endDate },
    })

    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0)

    // 3. Find if the user has a configured budget for this category/month/year
    const budget = await Budget.findOne({ user: userId, category, month, year })
    if (!budget) return

    // Update spentAmount
    budget.spentAmount = totalSpent
    await budget.save()

    // 4. Run Alert Engine Threshold Checks
    const percentUsed = (budget.spentAmount / budget.monthlyLimit) * 100

    if (budget.spentAmount >= budget.monthlyLimit) {
      // Create Exceeded Alert if not already notified
      const alreadyExceeded = await Notification.findOne({
        user: userId,
        type: 'budget_warning',
        'meta.budgetId': budget._id.toString(),
        'meta.type': 'exceeded',
      })

      if (!alreadyExceeded) {
        await Notification.create({
          user: userId,
          type: 'budget_warning',
          title: `Budget Exceeded: ${category}`,
          message: `Your monthly expense for "${category}" has reached ₹${budget.spentAmount.toLocaleString('en-IN')}, exceeding your threshold of ₹${budget.monthlyLimit.toLocaleString('en-IN')}!`,
          meta: {
            budgetId: budget._id.toString(),
            type: 'exceeded',
            percentUsed,
          },
        })
      }
    } else if (percentUsed >= budget.alertThreshold) {
      // Create Warning Alert if not already notified
      const alreadyWarned = await Notification.findOne({
        user: userId,
        type: 'budget_warning',
        'meta.budgetId': budget._id.toString(),
        'meta.type': 'warning',
      })

      if (!alreadyWarned) {
        await Notification.create({
          user: userId,
          type: 'budget_warning',
          title: `Budget Warning: ${category} (${percentUsed.toFixed(0)}%)`,
          message: `Your monthly expense for "${category}" is currently at ₹${budget.spentAmount.toLocaleString('en-IN')}, which is ${percentUsed.toFixed(0)}% of your ₹${budget.monthlyLimit.toLocaleString('en-IN')} limit.`,
          meta: {
            budgetId: budget._id.toString(),
            type: 'warning',
            percentUsed,
          },
        })
      }
    }
  } catch (err) {
    console.error('[Recalculate Budget Error]:', err)
  }
}

/**
 * Audits a newly logged transaction to detect if it exceeds 2.5x of the user's historical average.
 * Automatically dispatches a spending alert warning if triggered.
 * 
 * @param {string} userId - ID of the User
 * @param {number} amount - Amount of the new transaction
 * @param {string} transactionTitle - Title of the transaction
 * @param {string} category - Category of the transaction
 */
export const checkSpendingSpike = async (userId, amount, transactionTitle, category) => {
  try {
    // 1. Fetch user's previous expense transactions to compute historical average (excluding the new one if not saved yet)
    const expenses = await Transaction.find({
      user: userId,
      type: 'expense',
    }).select('amount')

    if (expenses.length < 3) return // Ignore if user has less than 3 expenses to calculate a solid average

    const sum = expenses.reduce((s, tx) => s + tx.amount, 0)
    const avg = sum / expenses.length

    // 2. Trigger warning if amount is greater than 2.5x average
    if (amount > 2.5 * avg) {
      const times = (amount / avg).toFixed(1)
      await Notification.create({
        user: userId,
        type: 'spending_alert',
        title: `Unusual Spending Spike Detected`,
        message: `An expense transaction of ₹${amount.toLocaleString('en-IN')} for "${transactionTitle}" in "${category}" was detected. This is ${times}x larger than your average expense size of ₹${avg.toFixed(0)}.`,
        meta: {
          amount,
          avg,
          times,
          title: transactionTitle,
        },
      })
    }
  } catch (err) {
    console.error('[Check Spending Spike Error]:', err)
  }
}
