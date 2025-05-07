import React, { createContext, useContext, useState, useEffect } from 'react';
import { Certificate, CertificateFormData } from '../types';
import { 
  getCertificates, 
  addCertificate, 
  updateCertificate, 
  deleteCertificate, 
  getStudentCertificates,
  getTeacherStudentsCertificates
} from '../services/certificateService';
import { useAuth } from './AuthContext';

interface CertificateContextType {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  addNewCertificate: (data: CertificateFormData) => Promise<void>;
  updateExistingCertificate: (id: string, data: Partial<Certificate>) => Promise<void>;
  removeExistingCertificate: (id: string) => Promise<void>;
  refreshCertificates: () => Promise<void>;
  clearError: () => void;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export function CertificateProvider({ children }: { children: React.ReactNode }) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshCertificates();
    }
  }, [user]);

  const refreshCertificates = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let data: Certificate[] = [];
      
      if (user.role === 'student') {
        data = await getStudentCertificates(user.id);
      } else if (user.role === 'teacher') {
        data = await getTeacherStudentsCertificates(user.id);
      } else {
        data = await getCertificates();
      }
      
      setCertificates(data);
    } catch (err) {
      setError('Failed to load certificates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addNewCertificate = async (data: CertificateFormData) => {
    try {
      setLoading(true);
      setError(null);
      await addCertificate(data);
      await refreshCertificates();
    } catch (err) {
      setError('Failed to add certificate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingCertificate = async (id: string, data: Partial<Certificate>) => {
    try {
      setLoading(true);
      setError(null);
      await updateCertificate(id, data);
      await refreshCertificates();
    } catch (err) {
      setError('Failed to update certificate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeExistingCertificate = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCertificate(id);
      setCertificates(prevCertificates => prevCertificates.filter(cert => cert.id !== id));
    } catch (err) {
      setError('Failed to delete certificate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <CertificateContext.Provider 
      value={{ 
        certificates, 
        loading, 
        error, 
        addNewCertificate, 
        updateExistingCertificate, 
        removeExistingCertificate, 
        refreshCertificates,
        clearError
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificates() {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
}