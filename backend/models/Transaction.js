import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      validate: {
        validator: function (value) {
          // If transaction is an expense, it must belong to expense categories
          if (this.type === 'expense') {
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
          }
          // If transaction is an income, it must belong to income categories
          if (this.type === 'income') {
            return [
              'Salary',
              'Freelance',
              'Investments',
              'Business',
              'Other',
            ].includes(value)
          }
          return false
        },
        message: props => `${props.value} is not a valid category for the selected transaction type`,
      },
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Date is required'],
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    receipt: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' },
      fileType: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
)

transactionSchema.index({ user: 1, date: -1 })
transactionSchema.index({ user: 1, category: 1 })
transactionSchema.index({ user: 1, createdAt: -1 })

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction
