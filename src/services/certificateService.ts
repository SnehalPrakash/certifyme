import { Certificate, CertificateFormData, CertificateFilter, StudentSummary, CategoryCount } from '../types';
import { mockCertificates, mockUsers } from '../data/mockData';

// Get all certificates
export const getCertificates = (): Promise<Certificate[]> => {
  return new Promise((resolve) => {
    // Simulate API request delay
    setTimeout(() => {
      resolve([...mockCertificates]);
    }, 800);
  });
};

// Get certificates for a specific student
export const getStudentCertificates = (studentId: string): Promise<Certificate[]> => {
  return new Promise((resolve) => {
    // Simulate API request delay
    setTimeout(() => {
      const certificates = mockCertificates.filter(cert => cert.studentId === studentId);
      resolve(certificates);
    }, 800);
  });
};

// Get certificates for all students of a teacher
export const getTeacherStudentsCertificates = (teacherId: string): Promise<Certificate[]> => {
  return new Promise((resolve) => {
    // Simulate API request delay
    setTimeout(() => {
      // Find teacher
      const teacher = mockUsers.find(user => user.id === teacherId && user.role === 'teacher');
      
      if (!teacher || !teacher.students || teacher.students.length === 0) {
        resolve([]);
        return;
      }
      
      // Get certificates for all students of the teacher
      const certificates = mockCertificates.filter(cert => 
        teacher.students?.includes(cert.studentId)
      );
      
      resolve(certificates);
    }, 800);
  });
};

// Add a new certificate
export const addCertificate = (data: CertificateFormData): Promise<Certificate> => {
  return new Promise((resolve) => {
    // Simulate API request delay
    setTimeout(() => {
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('certificate_app_user') || '{}');
      
      // Create a new certificate
      const newCertificate: Certificate = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        category: data.category,
        fileUrl: URL.createObjectURL(data.file), // In a real app, this would be a URL after uploading to storage
        thumbnailUrl: URL.createObjectURL(data.file), // In a real app, we'd generate a thumbnail
        uploadDate: new Date().toISOString(),
        issueDate: data.issueDate,
        studentId: user.id,
        studentName: user.name,
        verified: false
      };
      
      mockCertificates.push(newCertificate);
      resolve(newCertificate);
    }, 800);
  });
};

// Update a certificate
export const updateCertificate = (id: string, data: Partial<Certificate>): Promise<Certificate> => {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      const index = mockCertificates.findIndex(cert => cert.id === id);
      
      if (index === -1) {
        reject(new Error('Certificate not found'));
        return;
      }
      
      const updatedCertificate = { ...mockCertificates[index], ...data };
      mockCertificates[index] = updatedCertificate;
      
      resolve(updatedCertificate);
    }, 800);
  });
};

// Delete a certificate
export const deleteCertificate = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      const index = mockCertificates.findIndex(cert => cert.id === id);
      
      if (index === -1) {
        reject(new Error('Certificate not found'));
        return;
      }
      
      mockCertificates.splice(index, 1);
      resolve();
    }, 800);
  });
};

// Verify a certificate
export const verifyCertificate = (id: string, teacherId: string, teacherName: string): Promise<Certificate> => {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      const index = mockCertificates.findIndex(cert => cert.id === id);
      
      if (index === -1) {
        reject(new Error('Certificate not found'));
        return;
      }
      
      const updatedCertificate = { 
        ...mockCertificates[index], 
        verified: true,
        verifiedBy: teacherName,
        verifiedDate: new Date().toISOString()
      };
      
      mockCertificates[index] = updatedCertificate;
      resolve(updatedCertificate);
    }, 800);
  });
};

// Filter certificates
export const filterCertificates = (certificates: Certificate[], filter: CertificateFilter): Certificate[] => {
  return certificates.filter(cert => {
    // Filter by category
    if (filter.category && filter.category !== 'All' && cert.category !== filter.category) {
      return false;
    }
    
    // Filter by student ID
    if (filter.studentId && cert.studentId !== filter.studentId) {
      return false;
    }
    
    // Filter by verification status
    if (filter.verified !== undefined && cert.verified !== filter.verified) {
      return false;
    }
    
    // Filter by date range
    if (filter.startDate && new Date(cert.issueDate) < new Date(filter.startDate)) {
      return false;
    }
    
    if (filter.endDate && new Date(cert.issueDate) > new Date(filter.endDate)) {
      return false;
    }
    
    // Filter by search term (title, description, student name)
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      return (
        cert.title.toLowerCase().includes(term) ||
        cert.description.toLowerCase().includes(term) ||
        cert.studentName.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
};

// Get category counts
export const getCategoryCounts = (certificates: Certificate[]): CategoryCount[] => {
  const counts: Record<string, number> = {};
  
  certificates.forEach(cert => {
    counts[cert.category] = (counts[cert.category] || 0) + 1;
  });
  
  return Object.entries(counts).map(([category, count]) => ({
    category: category as any,
    count
  }));
};

// Get student summaries for a teacher
export const getStudentSummaries = (teacherId: string): Promise<StudentSummary[]> => {
  return new Promise((resolve) => {
    // Simulate API request delay
    setTimeout(() => {
      // Find teacher
      const teacher = mockUsers.find(user => user.id === teacherId && user.role === 'teacher');
      
      if (!teacher || !teacher.students || teacher.students.length === 0) {
        resolve([]);
        return;
      }
      
      // Get summaries for each student
      const summaries = teacher.students.map(studentId => {
        const student = mockUsers.find(user => user.id === studentId);
        const studentCertificates = mockCertificates.filter(cert => cert.studentId === studentId);
        
        return {
          id: studentId,
          name: student?.name || 'Unknown Student',
          rollNumber: student?.rollNumber || '',
          totalCertificates: studentCertificates.length,
          verifiedCertificates: studentCertificates.filter(cert => cert.verified).length,
          pendingCertificates: studentCertificates.filter(cert => !cert.verified).length,
          categoryBreakdown: getCategoryCounts(studentCertificates)
        };
      });
      
      resolve(summaries);
    }, 800);
  });
};