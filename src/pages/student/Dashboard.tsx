import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Award, 
  CheckCircle, 
  Clock, 
  PieChart, 
  BarChart,
  Users
} from 'lucide-react';
import { useCertificates } from '../../context/CertificateContext';
import { useAuth } from '../../context/AuthContext';
import { CategoryCount } from '../../types';
import { getCategoryCounts } from '../../services/certificateService';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { certificates, loading } = useCertificates();
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);

  // Get counts of certificates by category
  useEffect(() => {
    if (certificates.length > 0) {
      const counts = getCategoryCounts(certificates);
      setCategoryCounts(counts);
    }
  }, [certificates]);

  // Counts of verified and pending certificates
  const verifiedCount = certificates.filter(cert => cert.verified).length;
  const pendingCount = certificates.filter(cert => !cert.verified).length;
  const totalCount = certificates.length;

  // Get last uploaded certificate
  const lastUploadedCertificate = [...certificates]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Quick actions */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/student/upload"
          className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center transition-all hover:bg-blue-100"
        >
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Upload Certificate</h3>
            <p className="text-sm text-gray-600">Add a new certificate</p>
          </div>
        </Link>

        <Link
          to="/student/certificates"
          className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center transition-all hover:bg-purple-100"
        >
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">My Certificates</h3>
            <p className="text-sm text-gray-600">View all your certificates</p>
          </div>
        </Link>

        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Verified</h3>
            <p className="text-sm text-gray-600">{verifiedCount} certificates</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-center">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Pending</h3>
            <p className="text-sm text-gray-600">{pendingCount} certificates</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category distribution */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
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
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No certificates yet</p>
              <Link to="/student/upload" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Upload your first certificate
              </Link>
            </div>
          )}
        </div>

        {/* Recent uploads */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            <BarChart className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Total Certificates</h3>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Verification Rate</h3>
              <p className="text-2xl font-bold text-gray-900">
                {totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0}%
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm text-gray-500 mb-1">Average per Month</h3>
              <p className="text-2xl font-bold text-gray-900">
                {calculateAvgPerMonth(certificates)}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Last Uploaded Certificate</h3>
            
            {lastUploadedCertificate ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryBgColor(lastUploadedCertificate.category)}`}>
                      <Award className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{lastUploadedCertificate.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded on {formatDate(lastUploadedCertificate.uploadDate)}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lastUploadedCertificate.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lastUploadedCertificate.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                <p>No certificates uploaded yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Teacher information */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Mentor</h2>
            <Users className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <img 
                src="https://ui-avatars.com/api/?name=Sarah+Williams&background=random" 
                alt="Mentor" 
                className="w-16 h-16 rounded-full"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Dr. Sarah Williams</h3>
              <p className="text-gray-600">Computer Science Department</p>
              <p className="text-sm text-gray-500 mt-1">sarah@teacher.edu</p>
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {verifiedCount} certificates verified
                </span>
              </div>
            </div>
          </div>
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

const calculateAvgPerMonth = (certificates: any[]) => {
  if (certificates.length === 0) return 0;
  
  // Get the earliest upload date
  const dates = certificates.map(cert => new Date(cert.uploadDate));
  const earliestDate = new Date(Math.min(...dates.map(date => date.getTime())));
  
  // Calculate months between earliest date and now
  const now = new Date();
  const monthDiff = (now.getFullYear() - earliestDate.getFullYear()) * 12 + 
                     (now.getMonth() - earliestDate.getMonth());
  
  // If less than a month, return the total
  if (monthDiff < 1) return certificates.length;
  
  // Calculate average per month
  return (certificates.length / monthDiff).toFixed(1);
};

export default StudentDashboard;