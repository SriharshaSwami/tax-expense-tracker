import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import { forgotPassword } from '../services/authService'

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
})

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data) => {
    try {
      await forgotPassword({ email: data.email })
      toast.success('Reset link sent to your email')
      setEmailSent(true)
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to send reset email. Try again.'
      toast.error(message)
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We will email you a secure reset link"
      footerText="Remember your password?"
      footerLink="/login"
      footerLabel="Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

        {emailSent && (
          <div className="space-y-2">
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              If the email exists, a reset link has been sent.
            </p>
            <Link
              to="/login"
              className="text-xs font-semibold text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 transition duration-200"
            >
              Back to sign in
            </Link>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="w-full py-3"
        >
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
