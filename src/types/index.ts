// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profileImage?: string;
  rollNumber?: string; // For students
  department?: string;
  mentorId?: string; // For students, references teacher id
  students?: string[]; // For teachers, references student ids
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'teacher';
  rollNumber?: string; // For students
  department?: string;
}

// Certificate types
export interface Certificate {
  id: string;
  title: string;
  description: string;
  category: CertificateCategory;
  fileUrl: string;
  thumbnailUrl: string;
  uploadDate: string;
  issueDate: string;
  studentId: string;
  studentName: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

export type CertificateCategory = 
  | 'Academic' 
  | 'Co-curricular' 
  | 'Cultural' 
  | 'Social' 
  | 'Sports' 
  | 'Workshop' 
  | 'Internship' 
  | 'Other';

export interface CertificateFormData {
  title: string;
  description: string;
  category: CertificateCategory;
  file: File;
  issueDate: string;
}

// Filter types
export interface CertificateFilter {
  category?: CertificateCategory | 'All';
  searchTerm?: string;
  studentId?: string;
  verified?: boolean;
  startDate?: string;
  endDate?: string;
}

// Analytics types
export interface CategoryCount {
  category: CertificateCategory;
  count: number;
}

export interface StudentSummary {
  id: string;
  name: string;
  rollNumber: string;
  totalCertificates: number;
  verifiedCertificates: number;
  pendingCertificates: number;
  categoryBreakdown: CategoryCount[];
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
  type: 'info' | 'warning' | 'success' | 'error';
  link?: string;
}