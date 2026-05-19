import mongoose from 'mongoose'

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Savings goal title is required'],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0.01, 'Target amount must be greater than zero'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current contribution cannot be negative'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
)

const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema)

export default SavingsGoal
