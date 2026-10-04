import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FiPlus,
  FiFolder,
  FiUser,
  FiBriefcase,
  FiMail,
  FiDownload,
  FiEye,
  FiFilter,
  FiSliders,
  FiArrowUpRight
} from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'

import DashboardLayout from '../components/common/DashboardLayout'
import ModernFolderCard from '../components/common/ModernFolderCard'
import FileListRow from '../components/common/FileListRow'
import StudentCredentialForm from '../components/teacher/StudentCredentialForm'
import { departments } from '../utils/mockData'
import { SERVER_URL } from '../config'

const TeacherHome = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ category: '', department: '', semester: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [showCredentialForm, setShowCredentialForm] = useState(false)
  const [activeTab, setActiveTab] = useState('drive')

  // Fetch all students
  const getStudents = async () => {
    const token = localStorage.getItem('jwt_token_teacher')
    setIsLoading(true)
    try {
      const result = await axios.get(`${SERVER_URL}/teacher/getAllStudents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (Array.isArray(result.data)) {
        setStudents(result.data)
      } else if (result.data?.students) {
        setStudents(result.data.students)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load students. Please check backend connection.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getStudents()
  }, [])

  // Filter students based on all filters + search query
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const categoryMatch = filters.category ? student.category === filters.category : true
      const departmentMatch = filters.department ? student.department === filters.department : true
      const semesterMatch = filters.semester ? String(student.semester) === String(filters.semester) : true
      const q = searchQuery.toLowerCase()
      const searchMatch = searchQuery
        ? (student.USN && student.USN.toLowerCase().includes(q)) ||
          (student.firstName && student.firstName.toLowerCase().includes(q)) ||
          (student.lastName && student.lastName.toLowerCase().includes(q)) ||
          (student.department && student.department.toLowerCase().includes(q))
        : true

      return categoryMatch && departmentMatch && semesterMatch && searchMatch
    })
  }, [students, filters, searchQuery])

  // Count by department for folder cards
  const deptCounts = useMemo(() => {
    const counts = {}
    students.forEach((s) => {
      const dept = s.department || 'General'
      counts[dept] = (counts[dept] || 0) + 1
    })
    return counts
  }, [students])

  const handleCreateStudentSuccess = () => {
    setShowCredentialForm(false)
    getStudents()
  }

  const handleDownloadCSV = () => {
    const headers = ['firstName', 'lastName', 'email', 'USN', 'department', 'semester']
    const rows = students.map(s => [
      s.firstName,
      s.lastName,
      s.email,
      s.USN,
      s.department,
      s.semester
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `student_roster_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Roster downloaded successfully')
  }

  // Right panel stats
  const dashboardStats = [
    {
      label: 'Enrolled students',
      subtext: 'active accounts',
      value: students.length || 0,
      percentage: Math.min(100, Math.round((students.length / 50) * 100)) || 65,
      color: '#5d5fef'
    },
    {
      label: 'Departments',
      subtext: 'academic branches',
      value: Object.keys(deptCounts).length || 4,
      percentage: 85,
      color: '#3b82f6'
    },
    {
      label: 'Verified records',
      subtext: 'accredited',
      value: '98%',
      percentage: 98,
      color: '#10b981'
    }
  ]

  const [activeCard, setActiveCard] = useState(departments[0] || 'Computer Science')

  return (
    <DashboardLayout
      userRole="teacher"
      userName="Faculty Admin"
      userEmail="faculty@college.edu"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      actionButtonText="ADD STUDENT"
      onActionClick={() => setShowCredentialForm(true)}
      stats={dashboardStats}
      bannerTitle="Student Roster Export"
      bannerText="Export credentials and certificate audits directly into formatted spreadsheet."
      bannerButtonText="DOWNLOAD CSV"
      onBannerClick={handleDownloadCSV}
      departments={departments}
      selectedDepartment={filters.department}
      onDepartmentSelect={(dept) => {
        setActiveCard(dept)
        setFilters(f => ({ ...f, department: dept }))
      }}
    >
      <div className="space-y-8">
        
        {/* ================= SECTION 1: RECENTLY USED FOLDERS ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Recently used
            </h2>
            {filters.department && (
              <button
                onClick={() => {
                  setFilters(f => ({ ...f, department: '' }))
                  setActiveCard('')
                }}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1 rounded-full"
              >
                Clear Department Filter ({filters.department})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Folder 1: Highlighted active periwinkle card */}
            <ModernFolderCard
              title={departments[0] || 'Computer Science'}
              type="DEPARTMENT"
              isActive={activeCard === (departments[0] || 'Computer Science')}
              fileCount={deptCounts[departments[0]] || 14}
              tag="Active Batch"
              onClick={() => {
                setActiveCard(departments[0])
                setFilters((f) => ({
                  ...f,
                  department: f.department === departments[0] ? '' : departments[0],
                }))
              }}
            />

            {/* Folder 2: White card */}
            <ModernFolderCard
              title={departments[1] || 'Information Science'}
              type="DEPARTMENT"
              isActive={activeCard === (departments[1] || 'Information Science')}
              fileCount={deptCounts[departments[1]] || 9}
              tag="Semester 6 & 8"
              onClick={() => {
                setActiveCard(departments[1])
                setFilters((f) => ({
                  ...f,
                  department: f.department === departments[1] ? '' : departments[1],
                }))
              }}
            />

            {/* Folder 3: White card */}
            <ModernFolderCard
              title={departments[2] || 'Electronics & Comm.'}
              type="DEPARTMENT"
              isActive={activeCard === (departments[2] || 'Electronics & Comm.')}
              fileCount={deptCounts[departments[2]] || 6}
              tag="Accredited"
              onClick={() => {
                setActiveCard(departments[2])
                setFilters((f) => ({
                  ...f,
                  department: f.department === departments[2] ? '' : departments[2],
                }))
              }}
            />
          </div>
        </div>

        {/* ================= SECTION 2: NEW FILES / RECENT STUDENTS ================= */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                New files
              </h2>
              <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
              </span>
            </div>

            {/* Semester Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-md">
              <button
                onClick={() => setFilters(f => ({ ...f, semester: '' }))}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  !filters.semester
                    ? 'bg-neutral-800 text-white'
                    : 'bg-white text-neutral-500 hover:bg-neutral-100 border border-neutral-200/60'
                }`}
              >
                All Semesters
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setFilters(f => ({ ...f, semester: f.semester === String(sem) ? '' : String(sem) }))}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    filters.semester === String(sem)
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-white text-neutral-500 hover:bg-neutral-100 border border-neutral-200/60'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Student Files List */}
          <div className="bg-white/70 backdrop-blur-xs rounded-3xl p-3 border border-neutral-100/90 shadow-card">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="space-y-1">
                {filteredStudents.slice(0, 7).map((student, idx) => (
                  <FileListRow
                    key={student._id || idx}
                    title={`${student.firstName} ${student.lastName} (${student.USN})`}
                    category={`${student.department || 'General'} • Sem ${student.semester || 1}`}
                    date={student.createdAt || '2026-10-04'}
                    extension="pdf"
                    isHighlighted={idx === 2} // highlight one row like in reference photo
                    onView={() => navigate(`/teacher?USN=${student.USN}`)}
                    onDownload={handleDownloadCSV}
                    onShare={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/teacher?USN=${student.USN}`)
                      toast.success('Student folder link copied!')
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-600">
                  <FiFolder className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-neutral-800">No students found</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {searchQuery ? 'Try matching another name or USN' : 'Click "+ ADD STUDENT" to provision access'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 3: SHARED WITH ME (ALL STUDENT FOLDERS GRID) ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Shared with me
            </h2>
            <span className="text-xs font-semibold text-neutral-400">
              Student Repository Folders
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredStudents.map((student) => (
              <motion.div
                key={student._id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/teacher?USN=${student.USN}`)}
                className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-card hover:shadow-hover cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                      FOLDER
                    </span>
                    <FiArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-600" />
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 font-bold text-xs">
                    {student.firstName ? student.firstName.charAt(0).toUpperCase() : 'S'}
                  </div>

                  <h4 className="text-xs font-bold text-neutral-800 truncate mb-0.5">
                    {student.firstName} {student.lastName}
                  </h4>
                  <p className="text-[11px] font-mono text-neutral-400 truncate">
                    {student.USN}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100/80 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-medium truncate">
                    Sem {student.semester || 1}
                  </span>
                  <span className="text-[10px] font-semibold text-brand-600">
                    Open →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Student Provisioning Modal */}
      <AnimatePresence>
        {showCredentialForm && (
          <StudentCredentialForm
            onClose={() => setShowCredentialForm(false)}
            onSuccess={handleCreateStudentSuccess}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}

export default TeacherHome
