'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/app/lib/api'
import { ROUTES, TOKEN_KEY, USER_KEY } from '@/app/lib/constants'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
    } else {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  const handlePasswordBlur = () => {
    if (password && !validatePassword(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }))
    } else {
      setErrors(prev => ({ ...prev, password: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      return
    }

    if (!validatePassword(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }))
      return
    }

    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      
      localStorage.setItem(TOKEN_KEY, res.token)
      if (res.token) {
        const userDetails = await authApi.getUserDetails(res.token)
        localStorage.setItem(USER_KEY, JSON.stringify(userDetails.user))
      }
      localStorage.setItem('isAuth', 'true')
      window.dispatchEvent(new Event('authChange'))
      
      router.push(ROUTES.PROPERTIES)
    } catch (err) {
      setError((err as Error)?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-cardBg rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Welcome Back</h1>
        <p className="text-center text-textSecondary mb-8">Login to your account</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
              }}
              onBlur={handleEmailBlur}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${
                errors.email ? 'border-error' : 'border-gray-300'
              }`}
              required
            />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                }}
                onBlur={handlePasswordBlur}
                className={`w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${
                  errors.password ? 'border-error' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
          </div>
          {error && (
            <div className="bg-red-50 border border-error rounded-lg p-3">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !!errors.email || !!errors.password}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-textSecondary mt-6">
          Don&apos;t have an account?{' '}
          <a href={ROUTES.SIGNUP} className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
