import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight, FiShield, FiUser } from 'react-icons/fi'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { SERVER_URL } from '../config'

const TeacherLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(`${SERVER_URL}/verify`, { token })
      if (response.status === 200) {
        navigate('/teacher/home')
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.')
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('jwt_token_teacher')
    if (token) {
      verifyToken(token)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.')
      toast.error('Please enter all credentials')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${SERVER_URL}/teacherLogin`, formData)
      if (response.status === 200) {
        const token = response.headers['x-auth-token']
        localStorage.setItem('jwt_token_teacher', token)
        toast.success('Welcome back, Professor!')
        navigate('/teacher/home')
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid password. Please check your credentials.')
        toast.error('Invalid credentials')
      } else if (err.response?.status === 404) {
        setError('No faculty account registered with this email.')
        toast.error('Account not found')
      } else {
        setError('Login service unavailable. Please check backend connection.')
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
            <span className="px-4 py-1.5 bg-brand-600 text-white rounded-full shadow-xs">
              Faculty Portal
            </span>
            <button
              onClick={() => navigate('/student/login')}
              className="px-4 py-1.5 text-neutral-500 hover:text-neutral-900 rounded-full transition-colors"
            >
              Student Portal
            </button>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Access the institutional certificate repository
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-700 rounded-2xl text-xs font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Faculty Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="faculty@college.edu"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            {loading ? 'Authenticating...' : 'Sign In as Faculty'}
            {!loading && <FiArrowRight className="ml-2 w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-500">
          New department faculty?{' '}
          <Link
            to="/teacher/signup"
            className="text-brand-600 font-bold hover:underline"
          >
            Create Faculty Account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default TeacherLogin
