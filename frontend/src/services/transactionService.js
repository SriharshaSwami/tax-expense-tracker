import api from '../utils/api'

/**
 * Fetch transactions with advanced filters
 * @param {Object} filters - Query parameters: { type, category, month, year, search }
 */
export const fetchTransactions = async (filters = {}) => {
  const cleanFilters = {}
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleanFilters[key] = value
    }
  })

  const { data } = await api.get('/transactions', { params: cleanFilters })
  return data
}

/**
 * Fetch transaction totals: income, expense, balance
 */
export const fetchSummary = async () => {
  const { data } = await api.get('/transactions/summary')
  return data
}

/**
 * Create a new transaction
 * @param {Object} transactionData - { title, amount, type, category, date, note }
 */
export const createTransaction = async (transactionData) => {
  const { data } = await api.post('/transactions', transactionData)
  return data
}

/**
 * Update an existing transaction
 * @param {string} id - Transaction ID
 * @param {Object} transactionData - Updated fields
 */
export const updateTransaction = async (id, transactionData) => {
  const { data } = await api.put(`/transactions/${id}`, transactionData)
  return data
}

/**
 * Delete a transaction
 * @param {string} id - Transaction ID
 */
export const deleteTransaction = async (id) => {
  const { data } = await api.delete(`/transactions/${id}`)
  return data
}

/**
 * Upload receipt attachment to a transaction
 * @param {string} id - Transaction ID
 * @param {File} file - Receipt file object
 */
export const uploadReceiptFile = async (id, file) => {
  const formData = new FormData()
  formData.append('receipt', file)
  const { data } = await api.post(`/transactions/upload-receipt/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

/**
 * Remove receipt attachment from a transaction
 * @param {string} id - Transaction ID
 */
export const deleteReceiptFile = async (id) => {
  const { data } = await api.delete(`/transactions/remove-receipt/${id}`)
  return data
}
