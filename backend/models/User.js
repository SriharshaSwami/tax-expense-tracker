import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

/**
 * User Schema definition.
 * Stores user authentication details, basic profile information, and tax preferences.
 * Includes methods for password hashing and validation.
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [
        function() {
          return !this.googleId
        },
        'Password is required',
      ],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    salary: {
      type: Number,
      default: 0,
    },
    taxRegime: {
      type: String,
      enum: ['old', 'new'],
      default: 'new',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
)

// Pre-save hook to hash the password before saving it to the database
// This ensures passwords are never stored in plain text.
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

/**
 * Instance method to compare an entered password with the hashed password in the DB.
 * @param {string} enteredPassword - The plain text password to check.
 * @returns {Promise<boolean>} - True if passwords match.
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  // Hash token before saving to DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Token valid for 10 minutes (strict security)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)

export default User
