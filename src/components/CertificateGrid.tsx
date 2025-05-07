import React from 'react';
import { Certificate, CertificateFilter } from '../types';
import CertificateCard from './CertificateCard';
import { filterCertificates } from '../services/certificateService';
import { FileQuestion } from 'lucide-react';

interface CertificateGridProps {
  certificates: Certificate[];
  filter?: CertificateFilter;
  onEdit?: (certificate: Certificate) => void;
  onDelete?: (certificateId: string) => void;
  onVerify?: (certificateId: string) => void;
}

const CertificateGrid: React.FC<CertificateGridProps> = ({ 
  certificates, 
  filter = {}, 
  onEdit, 
  onDelete,
  onVerify
}) => {
  // Apply filters
  const filteredCertificates = filter ? filterCertificates(certificates, filter) : certificates;
  
  if (filteredCertificates.length === 0) {
    return (
      <div className="py-10 flex flex-col items-center justify-center text-gray-500">
        <FileQuestion size={48} className="mb-3 text-gray-400" />
        <h3 className="text-xl font-medium mb-1">No certificates found</h3>
        <p className="text-gray-400">
          {filter.searchTerm ? 'Try adjusting your search or filters' : 'Upload new certificates to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredCertificates.map(certificate => (
        <CertificateCard 
          key={certificate.id}
          certificate={certificate}
          onEdit={onEdit}
          onDelete={onDelete}
          onVerify={onVerify}
        />
      ))}
    </div>
  );
};

export default CertificateGrid;