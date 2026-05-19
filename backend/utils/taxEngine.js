/**
 * Indian Tax Calculation Engine Utility
 * Supports Old and New Tax Regimes (FY 2024-25 / AY 2025-26 Budget Slabs)
 */

/**
 * Calculates tax under the Old Tax Regime
 * Includes exemptions: HRA, Section 80C, 80D, Sec 24(b) Home Loan, Standard Deduction, and Professional Tax
 */
export const calculateOldRegime = (inputs) => {
  const annualSalary = Math.max(0, Number(inputs.annualSalary) || 0)
  const otherIncome = Math.max(0, Number(inputs.otherIncome) || 0)
  const hraExemption = Math.max(0, Number(inputs.hraExemption) || 0)
  const deductions80C = Math.max(0, Number(inputs.deductions80C) || 0)
  const deductions80D = Math.max(0, Number(inputs.deductions80D) || 0)
  const homeLoanInterest = Math.max(0, Number(inputs.homeLoanInterest) || 0)
  const professionalTax = Math.max(0, Number(inputs.professionalTax) || 0)

  const grossIncome = annualSalary + otherIncome

  // Old Regime Deductions & Exemptions Capping
  const standardDeduction = annualSalary > 0 ? Math.min(annualSalary, 50000) : 0
  const capped80C = Math.min(deductions80C, 150000)
  const capped80D = Math.min(deductions80D, 75000) // Standard 25K + parents 50K
  const cappedHomeLoan = Math.min(homeLoanInterest, 200000)

  const totalDeductions =
    standardDeduction +
    hraExemption +
    capped80C +
    capped80D +
    cappedHomeLoan +
    professionalTax

  const taxableIncome = Math.max(0, grossIncome - totalDeductions)

  // Slab taxation (Old Regime)
  // Up to ₹2,50,000: Nil
  // ₹2,50,001 to ₹5,00,000: 5%
  // ₹5,00,001 to ₹10,00,000: 20%
  // Above ₹10,00,000: 30%
  let slabTax = 0
  if (taxableIncome <= 250000) {
    slabTax = 0
  } else if (taxableIncome <= 500000) {
    slabTax = (taxableIncome - 250000) * 0.05
  } else if (taxableIncome <= 1000000) {
    slabTax = 12500 + (taxableIncome - 500000) * 0.2
  } else {
    slabTax = 112500 + (taxableIncome - 1000000) * 0.3
  }

  // Section 87A rebate for Old Regime: if taxable income is <= ₹5,00,000, 100% tax rebate (up to ₹12,500)
  if (taxableIncome <= 500000) {
    slabTax = 0
  }

  // Health & Education Cess: 4%
  const cess = slabTax * 0.04
  const finalTax = slabTax + cess

  const effectiveTaxRate = grossIncome > 0 ? parseFloat(((finalTax / grossIncome) * 100).toFixed(2)) : 0

  return {
    grossIncome,
    totalDeductions,
    taxableIncome: Math.round(taxableIncome),
    taxPayable: parseFloat(finalTax.toFixed(2)),
    effectiveTaxRate,
  }
}

/**
 * Calculates tax under the New Tax Regime (Union Budget 2024 revisions)
 * Includes: Standard Deduction of ₹75,000. Blocks other exemptions.
 */
export const calculateNewRegime = (inputs) => {
  const annualSalary = Math.max(0, Number(inputs.annualSalary) || 0)
  const otherIncome = Math.max(0, Number(inputs.otherIncome) || 0)

  const grossIncome = annualSalary + otherIncome

  // New Regime Deductions: only Standard Deduction of ₹75,000
  const standardDeduction = annualSalary > 0 ? Math.min(annualSalary, 75000) : 0
  const totalDeductions = standardDeduction
  const taxableIncome = Math.max(0, grossIncome - totalDeductions)

  // Slab taxation (New Regime Budget 2024 slabs)
  // Up to ₹3,00,000: Nil
  // ₹3,00,001 to ₹7,00,000: 5%
  // ₹7,00,001 to ₹10,00,000: 10%
  // ₹10,00,001 to ₹12,00,000: 15%
  // ₹12,00,001 to ₹15,00,000: 20%
  // Above ₹15,00,000: 30%
  let slabTax = 0
  if (taxableIncome <= 300000) {
    slabTax = 0
  } else if (taxableIncome <= 700000) {
    slabTax = (taxableIncome - 300000) * 0.05
  } else if (taxableIncome <= 1000000) {
    slabTax = 20000 + (taxableIncome - 700000) * 0.1
  } else if (taxableIncome <= 1200000) {
    slabTax = 50000 + (taxableIncome - 1000000) * 0.15
  } else if (taxableIncome <= 1500000) {
    slabTax = 80000 + (taxableIncome - 1200000) * 0.2
  } else {
    slabTax = 140000 + (taxableIncome - 1500000) * 0.3
  }

  // Section 87A rebate for New Regime: if taxable income is <= ₹7,00,000, 100% rebate (up to ₹20,000)
  if (taxableIncome <= 700000) {
    slabTax = 0
  }

  const cess = slabTax * 0.04
  const finalTax = slabTax + cess

  const effectiveTaxRate = grossIncome > 0 ? parseFloat(((finalTax / grossIncome) * 100).toFixed(2)) : 0

  return {
    grossIncome,
    totalDeductions,
    taxableIncome: Math.round(taxableIncome),
    taxPayable: parseFloat(finalTax.toFixed(2)),
    effectiveTaxRate,
  }
}

/**
 * Compares Old vs New Regimes and returns savings details
 */
export const compareTaxRegimes = (inputs) => {
  const oldResult = calculateOldRegime(inputs)
  const newResult = calculateNewRegime(inputs)

  const diff = oldResult.taxPayable - newResult.taxPayable
  const recommendedRegime = diff >= 0 ? 'new' : 'old'
  const amountSaved = Math.abs(diff)

  return {
    oldRegime: oldResult,
    newRegime: newResult,
    savings: {
      recommendedRegime,
      amountSaved: parseFloat(amountSaved.toFixed(2)),
    },
  }
}
