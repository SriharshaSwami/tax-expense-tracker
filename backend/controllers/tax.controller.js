import TaxCalculation from '../models/TaxCalculation.js'
import { compareTaxRegimes } from '../utils/taxEngine.js'

/**
 * @desc    Perform on-the-fly Indian income tax calculations & regime comparison
 * @route   POST /api/tax/calculate
 * @access  Private (Requires Authentication)
 * @param   {Object} req.body - Contains salary, exemptions, and deductions (e.g., 80C, 80D).
 * @returns {Object} JSON response with tax comparison data (Old vs New Regime).
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

    // Execute the core tax engine logic to compare both regimes based on validated inputs
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
 * @desc    Save a tax comparison record to the database for historical tracking
 * @route   POST /api/tax/save
 * @access  Private
 * @param   {Object} req.body - Contains tax inputs to generate the comparison.
 * @returns {Object} JSON response confirming the saved record.
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
 * @desc    Retrieve the user's historical tax calculations
 * @route   GET /api/tax/history
 * @access  Private
 * @returns {Array} List of the last 10 tax calculation records, sorted by newest first.
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
