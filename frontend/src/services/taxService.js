import api from '../utils/api'

/**
 * Perform on-the-fly Indian income tax calculations and regime comparisons
 * @param {Object} inputs - annualSalary, otherIncome, hraExemption, deductions80C, deductions80D, homeLoanInterest, professionalTax
 */
export const calculateTax = async (inputs) => {
  const { data } = await api.post('/tax/calculate', inputs)
  return data
}

/**
 * Save active tax comparison metrics to history database
 * @param {Object} inputs - tax input parameters
 */
export const saveTaxCalculation = async (inputs) => {
  const { data } = await api.post('/tax/save', inputs)
  return data
}

/**
 * Fetch historical tax calculation records
 */
export const fetchTaxHistory = async () => {
  const { data } = await api.get('/tax/history')
  return data
}
