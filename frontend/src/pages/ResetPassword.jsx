import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Link, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import { resetPassword } from '../services/authService'

const resetSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(72, 'Password too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const [resetDone, setResetDone] = useState(false)

  const token = searchParams.get('token')
  const id = searchParams.get('id')

  const missingParams = useMemo(() => !token || !id, [token, id])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data) => {
    if (missingParams) {
      toast.error('Reset link is missing or invalid')
      return
    }

    try {
      await resetPassword({
        token,
        id,
        password: data.password,
      })
      toast.success('Password reset successful. Please sign in.')
      setResetDone(true)
    } catch (error) {
      const message =
        error.response?.data?.message || 'Password reset failed. Try again.'
      toast.error(message)
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account"
      footerText="Need a new reset link?"
      footerLink="/forgot-password"
      footerLabel="Send again"
    >
      {missingParams ? (
        <div className="space-y-4">
          <p className="text-xs text-rose-500">
            Reset link is missing or invalid.
          </p>
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 transition duration-200"
          >
            Request a new reset link
          </Link>
        </div>
      ) : resetDone ? (
        <div className="space-y-4">
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            Your password has been updated successfully.
          </p>
          <Link
            to="/login?reset=1"
            className="text-xs font-semibold text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 transition duration-200"
          >
            Continue to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormField
            id="password"
            type="password"
            label="New Password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            leftIcon="🔒"
            {...register('password')}
          />

          <FormField
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            leftIcon="🔒"
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="w-full py-3"
          >
            Update password
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ResetPassword
