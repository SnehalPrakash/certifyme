import React, { useState } from 'react';
import { 
  Download, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Calendar
} from 'lucide-react';
import { Certificate } from '../types';
import { useAuth } from '../context/AuthContext';

interface CertificateCardProps {
  certificate: Certificate;
  onEdit?: (certificate: Certificate) => void;
  onDelete?: (certificateId: string) => void;
  onVerify?: (certificateId: string) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ 
  certificate, 
  onEdit, 
  onDelete,
  onVerify
}) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const canEdit = isStudent && certificate.studentId === user?.id && !certificate.verified;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800';
      case 'Co-curricular':
        return 'bg-purple-100 text-purple-800';
      case 'Cultural':
        return 'bg-pink-100 text-pink-800';
      case 'Social':
        return 'bg-orange-100 text-orange-800';
      case 'Sports':
        return 'bg-green-100 text-green-800';
      case 'Workshop':
        return 'bg-indigo-100 text-indigo-800';
      case 'Internship':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        {/* Certificate thumbnail */}
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={certificate.thumbnailUrl} 
            alt={certificate.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Category badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(certificate.category)}`}>
          {certificate.category}
        </div>
        
        {/* Verification status */}
        {certificate.verified ? (
          <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Verified
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <XCircle size={14} className="mr-1" />
            Pending
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{certificate.title}</h3>
        
        <div className="mt-2 text-sm text-gray-600 flex items-center">
          <Calendar size={16} className="mr-1" />
          <span>Issued: {formatDate(certificate.issueDate)}</span>
        </div>
        
        {isTeacher && (
          <div className="mt-1 text-sm text-gray-600">
            <span className="font-medium">Student: </span>
            {certificate.studentName}
          </div>
        )}
        
        {/* Toggle details button */}
        <button 
          className="mt-3 w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-800"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp size={16} className="mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" />
              Show Details
            </>
          )}
        </button>
        
        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">{certificate.description}</p>
            
            {certificate.verified && (
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-medium">Verified by: </span>
                {certificate.verifiedBy} on {formatDate(certificate.verifiedDate || '')}
              </div>
            )}
            
            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <a 
                href={certificate.fileUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                <FileText size={16} className="mr-1" />
                View
              </a>
              
              <a 
                href={certificate.fileUrl} 
                download={`${certificate.title}.pdf`}
                className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                <Download size={16} className="mr-1" />
                Download
              </a>
              
              {canEdit && onEdit && (
                <button 
                  onClick={() => onEdit(certificate)}
                  className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
              )}
              
              {canEdit && onDelete && (
                <button 
                  onClick={() => onDelete(certificate.id)}
                  className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              )}
              
              {isTeacher && !certificate.verified && onVerify && (
                <button 
                  onClick={() => onVerify(certificate.id)}
                  className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Verify
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;