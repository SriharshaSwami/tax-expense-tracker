import api from '../utils/api'

/**
 * Fetch AI Financial Health Score & Suggestions
 * @returns {Promise<Object>}
 */
export const fetchFinancialHealth = async () => {
  const { data } = await api.get('/insights/financial-health')
  return data
}

/**
 * Fetch AI Spending Pattern Detections
 * @returns {Promise<Object>}
 */
export const fetchSpendingPatterns = async () => {
  const { data } = await api.get('/insights/spending-patterns')
  return data
}

/**
 * Fetch Smart AI Recommendations
 * @returns {Promise<Object>}
 */
export const fetchRecommendations = async () => {
  const { data } = await api.get('/insights/recommendations')
  return data
}

/**
 * Submit receipt file for instant OCR Text Extraction & Auto-Fill Suggestions
 * @param {File} file - Receipt Image or PDF File
 * @returns {Promise<Object>}
 */
export const scanReceiptFile = async (file) => {
  const formData = new FormData()
  formData.append('receipt', file)

  const { data } = await api.post('/transactions/scan-receipt', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
