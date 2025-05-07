import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useCertificates } from '../../context/CertificateContext';
import { useAuth } from '../../context/AuthContext';
import CertificateGrid from '../../components/CertificateGrid';
import FilterBar from '../../components/FilterBar';
import { Certificate, CertificateFilter } from '../../types';
import { verifyCertificate } from '../../services/certificateService';

const CertificateVerification: React.FC = () => {
  const { user } = useAuth();
  const { certificates, loading, refreshCertificates } = useCertificates();
  const [filter, setFilter] = useState<CertificateFilter>({ verified: false });
  const [verifying, setVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleFilterChange = (newFilter: CertificateFilter) => {
    setFilter(newFilter);
  };
  
  const handleVerify = async (certificateId: string) => {
    if (!user) return;
    
    try {
      setVerifying(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      await verifyCertificate(certificateId, user.id, user.name);
      await refreshCertificates();
      
      setSuccessMessage('Certificate verified successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      setErrorMessage('Failed to verify certificate. Please try again.');
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setVerifying(false);
    }
  };
  
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
        <p className="text-gray-600">Review and verify student certificates</p>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
      
      {/* Filter Bar */}
      <FilterBar 
        onFilterChange={handleFilterChange}
        showCategoryFilter={true}
        showVerifiedFilter={true}
        showDateFilter={true}
        initialFilter={{ verified: false }}
      />
      
      {/* Certificate Grid */}
      {loading || verifying ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <CertificateGrid 
          certificates={certificates}
          filter={filter}
          onVerify={handleVerify}
        />
      )}
    </div>
  );
};

export default CertificateVerification;