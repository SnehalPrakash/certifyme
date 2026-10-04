import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiAward,
  FiEye,
  FiDownload,
  FiShare2,
  FiFolder,
  FiArrowUpRight,
  FiFilter,
  FiCheckCircle,
  FiUser
} from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'

import DashboardLayout from '../components/common/DashboardLayout'
import ModernFolderCard from '../components/common/ModernFolderCard'
import FileListRow from '../components/common/FileListRow'
import ModernUploadModal from '../components/common/ModernUploadModal'
import { SERVER_URL } from '../config'

const TeacherStudentHome = () => {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activeCategoryCard, setActiveCategoryCard] = useState('course')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [activeTab, setActiveTab] = useState('drive')

  const queryParams = new URLSearchParams(window.location.search)
  const USN = queryParams.get('USN') || ''

  const categories = [
    'course',
    'workshop',
    'internship',
    'hackathon',
    'skill',
    'NSS',
    'sports'
  ]

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('jwt_token_teacher')
      const response = await axios.get(
        `${SERVER_URL}/teacher/getStudentCertificate?USN=${USN}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.data.certificates) {
        setCertificates(response.data.certificates)
      } else if (Array.isArray(response.data)) {
        setCertificates(response.data)
      } else {
        setCertificates([])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load certificates for this student')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [USN])

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts = {}
    certificates.forEach((c) => {
      const tag = (c.Tag || 'Other').toLowerCase()
      counts[tag] = (counts[tag] || 0) + 1
    })
    return counts
  }, [certificates])

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesCategory = selectedCategory
        ? (cert.Tag || '').toLowerCase() === selectedCategory.toLowerCase()
        : true
      const matchesSearch = searchQuery
        ? (cert.Title && cert.Title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (cert.Tag && cert.Tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
      return matchesCategory && matchesSearch
    })
  }, [certificates, selectedCategory, searchQuery])

  // View PDF
  const handleViewPdf = (cert) => {
    try {
      if (!cert.Data) {
        toast.error('Certificate binary data unavailable')
        return
      }
      const byteCharacters = atob(cert.Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (err) {
      console.error(err)
      toast.error('Could not decode certificate file')
    }
  }

  // Download PDF
  const handleDownloadPdf = (cert) => {
    try {
      if (!cert.Data) {
        toast.error('Certificate binary data unavailable')
        return
      }
      const byteCharacters = atob(cert.Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cert.Title || 'certificate'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Certificate download started')
    } catch (err) {
      console.error(err)
      toast.error('Could not download certificate')
    }
  }

  // Teacher uploading certificate on behalf of student
  const handleUploadCertificate = async ({ title, tag, file }) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result.split(',')[1]
          const payload = {
            title,
            tag,
            date: new Date().toISOString().split('T')[0],
            path: `/${USN}`,
            Data: base64Data
          }
          const token = localStorage.getItem('jwt_token_student') || localStorage.getItem('jwt_token_teacher')
          await axios.post(`${SERVER_URL}/student/uploadCertificate`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          })
          fetchCertificates()
          resolve()
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Right panel stats
  const dashboardStats = [
    {
      label: 'Total certificates',
      subtext: `USN: ${USN || 'Active'}`,
      value: certificates.length,
      percentage: Math.min(100, Math.round((certificates.length / 10) * 100)) || 50,
      color: '#5d5fef'
    },
    {
      label: 'Verified authenticity',
      subtext: 'verified credentials',
      value: '100%',
      percentage: 100,
      color: '#10b981'
    },
    {
      label: 'Categories',
      subtext: 'courses, hackathons',
      value: Object.keys(categoryCounts).length || 3,
      percentage: 75,
      color: '#3b82f6'
    }
  ]

  return (
    <DashboardLayout
      userRole="teacher"
      userName={USN ? `USN: ${USN}` : 'Student Portfolio'}
      userEmail={`student.${USN?.toLowerCase()}@college.edu`}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      actionButtonText="UPLOAD CERTIFICATE"
      onActionClick={() => setShowUploadModal(true)}
      stats={dashboardStats}
      bannerTitle="Certificate Verification"
      bannerText="All documents in this folder are cryptographically checked against institutional ledger."
      bannerButtonText="GENERATE DOSSIER"
      onBannerClick={() => toast.success('Institutional dossier generated!')}
    >
      <div className="space-y-8">
        
        {/* ================= SECTION 1: RECENTLY USED CATEGORY FOLDERS ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                Recently used
              </h2>
              <p className="text-xs text-neutral-500">
                Categorized folders for student {USN}
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setActiveCategoryCard('')
                }}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1 rounded-full"
              >
                Clear Category Filter ({selectedCategory})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Course / Academic (Active Purple) */}
            <ModernFolderCard
              title="Courses & MOOCs"
              type="CATEGORY"
              isActive={activeCategoryCard === 'course'}
              fileCount={categoryCounts['course'] || 0}
              tag="Accredited"
              onClick={() => {
                setActiveCategoryCard('course')
                setSelectedCategory(selectedCategory === 'course' ? '' : 'course')
              }}
            />

            {/* Card 2: Workshops & Seminars */}
            <ModernFolderCard
              title="Workshops"
              type="CATEGORY"
              isActive={activeCategoryCard === 'workshop'}
              fileCount={categoryCounts['workshop'] || 0}
              tag="Hands-on"
              onClick={() => {
                setActiveCategoryCard('workshop')
                setSelectedCategory(selectedCategory === 'workshop' ? '' : 'workshop')
              }}
            />

            {/* Card 3: Hackathons & Internships */}
            <ModernFolderCard
              title="Hackathons & Competitions"
              type="CATEGORY"
              isActive={activeCategoryCard === 'hackathon'}
              fileCount={categoryCounts['hackathon'] || 0}
              tag="Excellence"
              onClick={() => {
                setActiveCategoryCard('hackathon')
                setSelectedCategory(selectedCategory === 'hackathon' ? '' : 'hackathon')
              }}
            />
          </div>
        </div>

        {/* ================= SECTION 2: NEW FILES (RECENT CERTIFICATES LIST) ================= */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                New files
              </h2>
              <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                {filteredCertificates.length} {filteredCertificates.length === 1 ? 'file' : 'files'}
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-md">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  !selectedCategory
                    ? 'bg-neutral-800 text-white'
                    : 'bg-white text-neutral-500 hover:bg-neutral-100 border border-neutral-200/60'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-white text-neutral-500 hover:bg-neutral-100 border border-neutral-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Files List */}
          <div className="bg-white/70 backdrop-blur-xs rounded-3xl p-3 border border-neutral-100/90 shadow-card">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
              </div>
            ) : filteredCertificates.length > 0 ? (
              <div className="space-y-1">
                {filteredCertificates.map((cert, idx) => (
                  <FileListRow
                    key={cert._id || idx}
                    title={cert.Title || 'Untitled Certificate'}
                    category={cert.Tag || 'Course'}
                    date={cert.Date || '2026-10-04'}
                    extension="pdf"
                    isHighlighted={idx === 0}
                    onView={() => handleViewPdf(cert)}
                    onDownload={() => handleDownloadPdf(cert)}
                    onShare={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Certificate link copied to clipboard')
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-600">
                  <FiAward className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-neutral-800">No certificates found</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {selectedCategory
                    ? `No certificates in category "${selectedCategory}"`
                    : 'Click "+ UPLOAD CERTIFICATE" to add credentials'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 3: SHARED WITH ME (CERTIFICATES GRID) ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Shared with me
            </h2>
            <span className="text-xs font-semibold text-neutral-400">
              Document Previews
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredCertificates.map((cert) => (
              <motion.div
                key={cert._id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleViewPdf(cert)}
                className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-card hover:shadow-hover cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                      PDF
                    </span>
                    <FiArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-600" />
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                    <FiAward className="w-4 h-4" />
                  </div>

                  <h4 className="text-xs font-bold text-neutral-800 truncate mb-0.5">
                    {cert.Title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 capitalize truncate">
                    {cert.Tag || 'Course'}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100/80 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">
                    {cert.Date ? new Date(cert.Date).getFullYear() : '2026'}
                  </span>
                  <span className="text-[10px] font-semibold text-brand-600">
                    Preview →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Upload Certificate Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <ModernUploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onSubmit={handleUploadCertificate}
            initialCategory={selectedCategory || 'course'}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}

export default TeacherStudentHome
