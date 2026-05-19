import mongoose from 'mongoose'

const TaxCalculationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inputs: {
      annualSalary: {
        type: Number,
        required: true,
        min: [0, 'Annual salary cannot be negative'],
      },
      otherIncome: {
        type: Number,
        default: 0,
        min: [0, 'Other income cannot be negative'],
      },
      hraExemption: {
        type: Number,
        default: 0,
        min: [0, 'HRA exemption cannot be negative'],
      },
      deductions80C: {
        type: Number,
        default: 0,
        min: [0, 'Section 80C deductions cannot be negative'],
      },
      deductions80D: {
        type: Number,
        default: 0,
        min: [0, 'Section 80D deductions cannot be negative'],
      },
      homeLoanInterest: {
        type: Number,
        default: 0,
        min: [0, 'Home loan interest cannot be negative'],
      },
      professionalTax: {
        type: Number,
        default: 0,
        min: [0, 'Professional tax cannot be negative'],
      },
    },
    result: {
      oldRegime: {
        grossIncome: { type: Number, required: true },
        totalDeductions: { type: Number, required: true },
        taxableIncome: { type: Number, required: true },
        taxPayable: { type: Number, required: true },
        effectiveTaxRate: { type: Number, required: true },
      },
      newRegime: {
        grossIncome: { type: Number, required: true },
        totalDeductions: { type: Number, required: true },
        taxableIncome: { type: Number, required: true },
        taxPayable: { type: Number, required: true },
        effectiveTaxRate: { type: Number, required: true },
      },
      savings: {
        recommendedRegime: {
          type: String,
          enum: ['old', 'new'],
          required: true,
        },
        amountSaved: {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('TaxCalculation', TaxCalculationSchema)
