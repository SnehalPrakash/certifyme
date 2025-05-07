import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useCertificates } from '../../context/CertificateContext';
import CertificateGrid from '../../components/CertificateGrid';
import FilterBar from '../../components/FilterBar';
import { Certificate, CertificateFilter } from '../../types';

const MyCertificates: React.FC = () => {
  const { certificates, loading, removeExistingCertificate } = useCertificates();
  const [filter, setFilter] = useState<CertificateFilter>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleFilterChange = (newFilter: CertificateFilter) => {
    setFilter(newFilter);
  };
  
  const handleEdit = (certificate: Certificate) => {
    // In a real app, this would navigate to an edit page or open a modal
    console.log('Edit certificate:', certificate);
  };
  
  const handleDelete = (certificateId: string) => {
    setCertificateToDelete(certificateId);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (certificateToDelete) {
      try {
        setIsDeleting(true);
        await removeExistingCertificate(certificateToDelete);
      } catch (error) {
        console.error('Failed to delete certificate:', error);
      } finally {
        setIsDeleting(false);
        setShowDeleteModal(false);
        setCertificateToDelete(null);
      }
    }
  };
  
  return (
    <div>
      <div className="mb-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600">Manage and view all your certificates</p>
        </div>
        
        <Link
          to="/student/upload"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm flex items-center hover:bg-blue-700 transition-colors"
        >
          <Upload size={16} className="mr-1" />
          <span>Upload New</span>
        </Link>
      </div>
      
      {/* Filter Bar */}
      <FilterBar 
        onFilterChange={handleFilterChange}
        showCategoryFilter={true}
        showVerifiedFilter={true}
        showDateFilter={true}
      />
      
      {/* Certificate Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <CertificateGrid 
          certificates={certificates}
          filter={filter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Certificate</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete this certificate? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 flex items-center ${
                  isDeleting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;