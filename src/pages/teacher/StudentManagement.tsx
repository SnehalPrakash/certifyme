import React, { useEffect, useState } from 'react';
import { Search, Filter, Users, Award, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StudentSummary, CategoryCount } from '../../types';
import { getStudentSummaries } from '../../services/certificateService';

const StudentManagement: React.FC = () => {
  const { user } = useAuth();
  const [studentSummaries, setStudentSummaries] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
  // Fetch student summaries
  useEffect(() => {
    const fetchStudentSummaries = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const summaries = await getStudentSummaries(user.id);
          setStudentSummaries(summaries);
        } catch (error) {
          console.error('Failed to fetch student summaries:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudentSummaries();
  }, [user?.id]);
  
  // Filter students based on search term
  const filteredStudents = studentSummaries.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleExpand = (studentId: string) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };
  
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600">View and manage your students' certificates</p>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students by name or roll number..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Student list */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <li key={student.id} className="hover:bg-gray-50">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                        alt={student.name}
                        className="h-10 w-10 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">Roll No: {student.rollNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-center justify-center bg-purple-50 p-2 rounded-lg">
                        <Award size={16} className="text-purple-600" />
                        <div className="text-xs font-medium text-purple-700 mt-1">{student.totalCertificates}</div>
                        <div className="text-xs text-purple-500">Total</div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center bg-green-50 p-2 rounded-lg">
                        <CheckCircle size={16} className="text-green-600" />
                        <div className="text-xs font-medium text-green-700 mt-1">{student.verifiedCertificates}</div>
                        <div className="text-xs text-green-500">Verified</div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center bg-yellow-50 p-2 rounded-lg">
                        <Clock size={16} className="text-yellow-600" />
                        <div className="text-xs font-medium text-yellow-700 mt-1">{student.pendingCertificates}</div>
                        <div className="text-xs text-yellow-500">Pending</div>
                      </div>
                      
                      <button
                        onClick={() => toggleExpand(student.id)}
                        className="ml-2 p-2 rounded-full hover:bg-gray-200"
                      >
                        {expandedStudent === student.id ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded section */}
                  {expandedStudent === student.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Certificate Categories</h4>
                      
                      {student.categoryBreakdown.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {student.categoryBreakdown.map(category => (
                            <div key={category.category} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(category.category)}`}></div>
                                <span className="text-sm text-gray-700">{category.category}</span>
                              </div>
                              <span className="text-sm font-medium">{category.count}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No certificates available</p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
          <p className="text-gray-500">
            {searchTerm ? `No results for "${searchTerm}"` : 'You have no assigned students yet'}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function
const getCategoryColor = (category: string) => {
  switch(category) {
    case 'Academic': return 'bg-blue-500';
    case 'Co-curricular': return 'bg-purple-500';
    case 'Cultural': return 'bg-pink-500';
    case 'Social': return 'bg-orange-500';
    case 'Sports': return 'bg-green-500';
    case 'Workshop': return 'bg-indigo-500';
    case 'Internship': return 'bg-cyan-500';
    default: return 'bg-gray-500';
  }
};

export default StudentManagement;