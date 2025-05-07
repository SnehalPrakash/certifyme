import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Award, 
  PieChart,
  AlertCircle,
  TrendingUp,
  BarChart4
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCertificates } from '../../context/CertificateContext';
import { CategoryCount, StudentSummary } from '../../types';
import { getCategoryCounts, getStudentSummaries } from '../../services/certificateService';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { certificates, loading } = useCertificates();
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [studentSummaries, setStudentSummaries] = useState<StudentSummary[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Get counts of certificates by category
  useEffect(() => {
    if (certificates.length > 0) {
      const counts = getCategoryCounts(certificates);
      setCategoryCounts(counts);
    }
  }, [certificates]);

  // Get student summaries
  useEffect(() => {
    const fetchStudentSummaries = async () => {
      if (user?.id) {
        try {
          setLoadingStats(true);
          const summaries = await getStudentSummaries(user.id);
          setStudentSummaries(summaries);
        } catch (error) {
          console.error('Failed to fetch student summaries:', error);
        } finally {
          setLoadingStats(false);
        }
      }
    };

    fetchStudentSummaries();
  }, [user?.id]);

  // Counts of verified and pending certificates
  const verifiedCount = certificates.filter(cert => cert.verified).length;
  const pendingCount = certificates.filter(cert => !cert.verified).length;
  const totalCount = certificates.length;

  if (loading || loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Quick stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-blue-100 rounded-lg p-4 flex items-center shadow-sm">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Students</p>
            <h3 className="text-xl font-bold text-gray-900">{studentSummaries.length}</h3>
          </div>
        </div>

        <div className="bg-white border border-purple-100 rounded-lg p-4 flex items-center shadow-sm">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Certificates</p>
            <h3 className="text-xl font-bold text-gray-900">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white border border-green-100 rounded-lg p-4 flex items-center shadow-sm">
          <div className="p-3 bg-green-100 rounded-lg mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Verified</p>
            <h3 className="text-xl font-bold text-gray-900">{verifiedCount}</h3>
          </div>
        </div>

        <div className="bg-white border border-yellow-100 rounded-lg p-4 flex items-center shadow-sm">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <h3 className="text-xl font-bold text-gray-900">{pendingCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category distribution */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Certificate Types</h2>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          
          {categoryCounts.length > 0 ? (
            <div className="space-y-4">
              {categoryCounts.map(({ category, count }) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(category)}`}></div>
                    <span className="text-sm text-gray-700">{category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getCategoryBgColor(category)}`} 
                        style={{ width: `${(count / totalCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No certificates available</p>
            </div>
          )}
        </div>

        {/* Student performance */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Student Performance</h2>
            <BarChart4 className="h-5 w-5 text-gray-500" />
          </div>
          
          {studentSummaries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-3 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-3 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending
                    </th>
                    <th className="px-3 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentSummaries.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                            alt={student.name}
                            className="h-8 w-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.rollNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-gray-900">{student.totalCertificates}</span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-green-600">{student.verifiedCertificates}</span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-center">
                        {student.pendingCertificates > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {student.pendingCertificates}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">0</span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ 
                              width: student.totalCertificates > 0 
                                ? `${(student.verifiedCertificates / student.totalCertificates) * 100}%` 
                                : '0%' 
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No student data available</p>
            </div>
          )}
        </div>
        
        {/* Pending certificates */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Verifications</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">{pendingCount} pending</span>
              <Link 
                to="/teacher/certificates" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          
          {pendingCount > 0 ? (
            <div className="overflow-hidden">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {certificates
                    .filter(cert => !cert.verified)
                    .slice(0, 5)
                    .map(certificate => (
                      <li key={certificate.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${getCategoryBgColor(certificate.category)}`}>
                              <Award className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {certificate.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {certificate.studentName} · {formatDate(certificate.uploadDate)}
                            </p>
                          </div>
                          <div>
                            <Link
                              to="/teacher/certificates"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                              Verify
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">All caught up!</p>
                <p className="text-sm text-green-700 mt-1">No pending certificates to verify.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

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

const getCategoryBgColor = (category: string) => {
  switch(category) {
    case 'Academic': return 'bg-blue-600';
    case 'Co-curricular': return 'bg-purple-600';
    case 'Cultural': return 'bg-pink-600';
    case 'Social': return 'bg-orange-600';
    case 'Sports': return 'bg-green-600';
    case 'Workshop': return 'bg-indigo-600';
    case 'Internship': return 'bg-cyan-600';
    default: return 'bg-gray-600';
  }
};

export default TeacherDashboard;