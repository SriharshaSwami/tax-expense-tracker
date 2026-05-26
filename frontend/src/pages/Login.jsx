import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/ui/FormField'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import GoogleAuthButton from '../components/common/GoogleAuthButton'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success('Welcome back to FinPulse!')
      navigate('/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
    }
  }

  useEffect(() => {
    if (searchParams.get('reset') === '1') {
      toast.success('Password updated. Please sign in.')
      navigate('/login', { replace: true })
    }
  }, [navigate, searchParams])

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your taxes and expenses"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLabel="Create one"
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

        <FormField
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          leftIcon="🔒"
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 transition duration-200"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="w-full py-3"
        >
          Sign in
        </Button>

        <div className="flex items-center pt-2 pb-2">
          <div className="flex-1 border-t border-fin-border"></div>
          <span className="px-4 text-[11px] font-extrabold uppercase tracking-widest text-fin-text-muted">
            Or
          </span>
          <div className="flex-1 border-t border-fin-border"></div>
        </div>

        <GoogleAuthButton />
      </form>
    </AuthLayout>
  )
}

export default Login
