import api from '../utils/api'

/**
 * Fetch budgets of the user, optionally filtered by month and year.
 */
export const fetchBudgets = async (month, year) => {
  const params = {}
  if (month) params.month = month
  if (year) params.year = year
  
  const { data } = await api.get('/budgets', { params })
  return data
}

/**
 * Create a new monthly budget limit for a category.
 */
export const createBudget = async (budgetData) => {
  const { data } = await api.post('/budgets', budgetData)
  return data
}

/**
 * Update an existing category budget limit or alert threshold.
 */
export const updateBudget = async (id, budgetData) => {
  const { data } = await api.put(`/budgets/${id}`, budgetData)
  return data
}

/**
 * Delete a category budget configuration.
 */
export const deleteBudget = async (id) => {
  const { data } = await api.delete(`/budgets/${id}`)
  return data
}
