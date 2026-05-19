import api from '../utils/api'

/**
 * Fetch monthly trend analysis for last 6 months
 * Returns income, expense, and balance totals per month
 */
export const fetchMonthlyAnalytics = async () => {
  const { data } = await api.get('/analytics/monthly')
  return data
}

/**
 * Fetch percentage expense distribution per category
 */
export const fetchCategoryBreakdown = async () => {
  const { data } = await api.get('/analytics/category-breakdown')
  return data
}

/**
 * Fetch smart insights (highest spend category, monthly trends, savings rates)
 */
export const fetchRecentTrends = async () => {
  const { data } = await api.get('/analytics/recent-trends')
  return data
}
