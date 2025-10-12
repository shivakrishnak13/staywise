'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/app/lib/api'
import { ROUTES, TOKEN_KEY, USER_KEY } from '@/app/lib/constants'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      localStorage.setItem(TOKEN_KEY, res.token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.user))
      router.push(ROUTES.PROPERTIES)
    } catch (err) {
      setError('Login failed')
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          {error && <p className="text-error text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-textSecondary mt-6">
          Don’t have an account?{' '}
          <a href={ROUTES.SIGNUP} className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
