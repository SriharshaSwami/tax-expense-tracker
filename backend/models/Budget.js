import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      validate: {
        validator: function (value) {
          return [
            'Food',
            'Travel',
            'Shopping',
            'Bills',
            'Entertainment',
            'Health',
            'Education',
            'Other',
          ].includes(value)
        },
        message: props => `${props.value} is not a valid expense category`,
      },
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Monthly limit is required'],
      min: [0.01, 'Monthly limit must be greater than zero'],
    },
    spentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be valid'],
    },
    alertThreshold: {
      type: Number,
      default: 80,
      min: [1, 'Alert threshold must be at least 1%'],
      max: [100, 'Alert threshold cannot exceed 100%'],
    },
  },
  {
    timestamps: true,
  }
)

// Compound index to guarantee one budget per user/category/month/year combo
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true })

budgetSchema.index({ user: 1 })
budgetSchema.index({ user: 1, name: 1 }, { unique: true })

const Budget = mongoose.model('Budget', budgetSchema)

export default Budget
