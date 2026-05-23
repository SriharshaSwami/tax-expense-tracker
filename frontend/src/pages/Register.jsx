import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(60, 'Name too long'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(72, 'Password too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    salary: z
      .string()
      .optional()
      .transform((v) => (v ? Number(v) : 0))
      .refine((v) => v >= 0, 'Salary cannot be negative'),
    taxRegime: z.enum(['new', 'old']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const Register = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      salary: '',
      taxRegime: 'new',
    },
  })

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data
      await registerUser(payload)
      toast.success('Welcome aboard TaxExpense Planner!')
      navigate('/dashboard')
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start tracking your Indian taxes and expenses"
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="name"
          type="text"
          label="Full Name"
          placeholder="Rahul Sharma"
          error={errors.name?.message}
          leftIcon="👤"
          {...register('name')}
        />

        <FormField
          id="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          leftIcon="✉"
          {...register('email')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <FormField
            id="confirmPassword"
            type="password"
            label="Confirm"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="salary"
            type="number"
            label="Annual Salary (₹)"
            placeholder="1200000"
            error={errors.salary?.message}
            leftIcon="₹"
            {...register('salary')}
          />

          <div className="w-full space-y-1.5">
            <label
              htmlFor="taxRegime"
              className="block text-xs font-semibold uppercase tracking-wider text-fin-text-secondary"
            >
              Tax Regime
            </label>
            <select
              id="taxRegime"
              className="w-full rounded-xl border bg-fin-input-bg px-4 py-2.5 text-sm text-fin-text-primary outline-none transition duration-150 border-fin-border focus:border-fin-primary focus:ring-2 focus:ring-fin-primary/20"
              {...register('taxRegime')}
            >
              <option value="new">New Regime</option>
              <option value="old">Old Regime</option>
            </select>
            {errors.taxRegime && (
              <p className="text-xs text-rose-500 font-medium mt-1">
                ⚠ {errors.taxRegime.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="w-full py-3"
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}

export default Register
