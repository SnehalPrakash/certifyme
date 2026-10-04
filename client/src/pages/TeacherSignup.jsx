import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiBookmark, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { SERVER_URL } from '../config'

const TeacherSignup = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    TID: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { firstName, lastName, email, password, TID } = formData

    if (!firstName || !lastName || !email || !password || !TID) {
      setError('All fields are required')
      toast.error('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      toast.error('Invalid email address')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${SERVER_URL}/createTeacher`, formData, {
        timeout: 10000,
      })

      if (response.data.message === 'Success') {
        toast.success('Faculty account created! Please sign in.')
        navigate('/teacher/login')
      } else {
        setError(response.data.message || 'Error creating account')
        toast.error('Registration failed')
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not connect to server. Is it running?'
      )
      toast.error('Registration failed')
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
        className="bg-white rounded-3xl shadow-card border border-neutral-100 max-w-lg w-full p-8 sm:p-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center cursor-pointer mb-3"
          >
            <span className="text-3xl font-black tracking-tight text-neutral-900">
              certify
            </span>
            <span className="text-3xl font-black text-brand-600">.</span>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Create Faculty Account
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Join your institution's certificate management network
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-700 rounded-2xl text-xs font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                First Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="First name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Teacher ID (TID)
            </label>
            <div className="relative">
              <FiBookmark className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                name="TID"
                value={formData.TID}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="e.g. FAC2026-08"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Institutional Email
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
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Minimum 6 characters"
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
            {loading ? 'Creating Account...' : 'Register as Faculty'}
            {!loading && <FiArrowRight className="ml-2 w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-500">
          Already have an account?{' '}
          <Link
            to="/teacher/login"
            className="text-brand-600 font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default TeacherSignup
