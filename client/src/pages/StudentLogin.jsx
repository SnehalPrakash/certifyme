import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight, FiBookmark } from 'react-icons/fi'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { SERVER_URL } from '../config'

const StudentLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(`${SERVER_URL}/verify`, { token })
      if (response.status === 200) {
        navigate('/student/home')
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.')
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('jwt_token_student')
    if (token) {
      verifyToken(token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in both email and password.')
      toast.error('Please enter all credentials')
      return
    }

    setLoading(true)
    const formData = { email, password }

    try {
      const response = await axios.post(`${SERVER_URL}/studentLogin`, formData)
      if (response.status === 200) {
        const token = response.headers['x-auth-token']
        localStorage.setItem('jwt_token_student', token)
        toast.success('Welcome back, Scholar!')
        navigate('/student/home')
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Incorrect password. Please verify your credentials.')
        toast.error('Invalid credentials')
      } else if (err.response?.status === 404) {
        setError('No student account associated with this email.')
        toast.error('Student not found')
      } else {
        setError('Login failed. Please verify that server is running.')
        toast.error('Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4fa] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-card border border-neutral-100 max-w-md w-full p-8 sm:p-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center cursor-pointer mb-4"
          >
            <span className="text-3xl font-black tracking-tight text-neutral-900">
              certify
            </span>
            <span className="text-3xl font-black text-brand-600">.</span>
          </div>

          {/* Role Pill Switcher */}
          <div className="inline-flex p-1 bg-neutral-100 rounded-full text-xs font-semibold mb-6">
            <button
              onClick={() => navigate('/teacher/login')}
              className="px-4 py-1.5 text-neutral-500 hover:text-neutral-900 rounded-full transition-colors"
            >
              Faculty Portal
            </button>
            <span className="px-4 py-1.5 bg-brand-600 text-white rounded-full shadow-xs">
              Student Portal
            </span>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Student Sign In
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Access your verified certificate portfolio
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-700 rounded-2xl text-xs font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Registered Student Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="student@college.edu"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pill w-full py-3 text-sm font-semibold tracking-wide shadow-brand flex items-center justify-center mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {loading ? 'Signing in...' : 'Sign In as Student'}
            {!loading && <FiArrowRight className="ml-2 w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-500">
          Account created by faculty admin?{' '}
          <span className="text-neutral-700 font-medium">
            Contact your department coordinator if you need credentials.
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default StudentLogin
