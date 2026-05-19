import TaxCalculation from '../models/TaxCalculation.js'
import { compareTaxRegimes } from '../utils/taxEngine.js'

/**
 * Perform on-the-fly Indian income tax calculations & regime comparison
 * POST /api/tax/calculate
 */
export const calculateTax = async (req, res) => {
  try {
    const {
      annualSalary,
      otherIncome,
      hraExemption,
      deductions80C,
      deductions80D,
      homeLoanInterest,
      professionalTax,
    } = req.body

    // Numeric validations
    const sal = Number(annualSalary) || 0
    const oth = Number(otherIncome) || 0
    const hra = Number(hraExemption) || 0
    const d80c = Number(deductions80C) || 0
    const d80d = Number(deductions80D) || 0
    const loan = Number(homeLoanInterest) || 0
    const prof = Number(professionalTax) || 0

    if (sal < 0 || oth < 0 || hra < 0 || d80c < 0 || d80d < 0 || loan < 0 || prof < 0) {
      return res.status(400).json({
        success: false,
        message: 'Tax calculation parameters cannot contain negative numbers',
      })
    }

    const comparison = compareTaxRegimes({
      annualSalary: sal,
      otherIncome: oth,
      hraExemption: hra,
      deductions80C: d80c,
      deductions80D: d80d,
      homeLoanInterest: loan,
      professionalTax: prof,
    })

    return res.status(200).json({
      success: true,
      data: comparison,
    })
  } catch (err) {
    console.error('Error in calculateTax:', err)
    return res.status(500).json({
      success: false,
      message: 'Failed to process tax calculation',
    })
  }
}

/**
 * Save tax comparison record to database
 * POST /api/tax/save
 */
export const saveTaxCalculation = async (req, res) => {
  try {
    const {
      annualSalary,
      otherIncome,
      hraExemption,
      deductions80C,
      deductions80D,
      homeLoanInterest,
      professionalTax,
    } = req.body

    const sal = Number(annualSalary) || 0
    const oth = Number(otherIncome) || 0
    const hra = Number(hraExemption) || 0
    const d80c = Number(deductions80C) || 0
    const d80d = Number(deductions80D) || 0
    const loan = Number(homeLoanInterest) || 0
    const prof = Number(professionalTax) || 0

    if (sal < 0 || oth < 0 || hra < 0 || d80c < 0 || d80d < 0 || loan < 0 || prof < 0) {
      return res.status(400).json({
        success: false,
        message: 'Tax calculation parameters cannot contain negative numbers',
      })
    }

    // Generate comparison results
    const inputs = {
      annualSalary: sal,
      otherIncome: oth,
      hraExemption: hra,
      deductions80C: d80c,
      deductions80D: d80d,
      homeLoanInterest: loan,
      professionalTax: prof,
    }

    const result = compareTaxRegimes(inputs)

    // Save to DB
    const newRecord = new TaxCalculation({
      user: req.user._id,
      inputs,
      result,
    })

    await newRecord.save()

    return res.status(201).json({
      success: true,
      message: 'Tax calculation history saved successfully',
      data: newRecord,
    })
  } catch (err) {
    console.error('Error in saveTaxCalculation:', err)
    return res.status(500).json({
      success: false,
      message: 'Failed to save tax calculation',
    })
  }
}

/**
 * Retrieve user's historical tax calculations
 * GET /api/tax/history
 */
export const getTaxHistory = async (req, res) => {
  try {
    const history = await TaxCalculation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10) // Keep standard history neat

    return res.status(200).json({
      success: true,
      data: history,
    })
  } catch (err) {
    console.error('Error in getTaxHistory:', err)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tax comparison history',
    })
  }
}
