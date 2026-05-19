import api from '../utils/api'

/**
 * Fetch all savings goals of the user.
 */
export const fetchGoals = async () => {
  const { data } = await api.get('/goals')
  return data
}

/**
 * Create a new savings goal milestone.
 */
export const createGoal = async (goalData) => {
  const { data } = await api.post('/goals', goalData)
  return data
}

/**
 * Update an existing savings goal title, amount contribution, or status.
 */
export const updateGoal = async (id, goalData) => {
  const { data } = await api.put(`/goals/${id}`, goalData)
  return data
}

/**
 * Delete a savings goal configuration.
 */
export const deleteGoal = async (id) => {
  const { data } = await api.delete(`/goals/${id}`)
  return data
}
