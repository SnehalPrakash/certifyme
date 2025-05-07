import { User, Certificate, CertificateCategory, Notification } from '../types';

// Mock users data
export const mockUsers: (User & { password?: string })[] = [
  {
    id: 's1',
    name: 'John Smith',
    email: 'john@student.edu',
    password: 'password',
    role: 'student',
    profileImage: 'https://ui-avatars.com/api/?name=John+Smith&background=random',
    rollNumber: 'S001',
    department: 'Computer Science',
    mentorId: 't1'
  },
  {
    id: 's2',
    name: 'Emily Johnson',
    email: 'emily@student.edu',
    password: 'password',
    role: 'student',
    profileImage: 'https://ui-avatars.com/api/?name=Emily+Johnson&background=random',
    rollNumber: 'S002',
    department: 'Computer Science',
    mentorId: 't1'
  },
  {
    id: 's3',
    name: 'Michael Brown',
    email: 'michael@student.edu',
    password: 'password',
    role: 'student',
    profileImage: 'https://ui-avatars.com/api/?name=Michael+Brown&background=random',
    rollNumber: 'S003',
    department: 'Electrical Engineering',
    mentorId: 't2'
  },
  {
    id: 't1',
    name: 'Dr. Sarah Williams',
    email: 'sarah@teacher.edu',
    password: 'password',
    role: 'teacher',
    profileImage: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=random',
    department: 'Computer Science',
    students: ['s1', 's2']
  },
  {
    id: 't2',
    name: 'Prof. Robert Johnson',
    email: 'robert@teacher.edu',
    password: 'password',
    role: 'teacher',
    profileImage: 'https://ui-avatars.com/api/?name=Robert+Johnson&background=random',
    department: 'Electrical Engineering',
    students: ['s3']
  }
];

// Mock certificates data
export const mockCertificates: Certificate[] = [
  {
    id: 'c1',
    title: 'Web Development Certification',
    description: 'Certification for completing the advanced web development course with distinction.',
    category: 'Academic',
    fileUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    thumbnailUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    uploadDate: '2023-11-15T10:30:00.000Z',
    issueDate: '2023-11-10T00:00:00.000Z',
    studentId: 's1',
    studentName: 'John Smith',
    verified: true,
    verifiedBy: 'Dr. Sarah Williams',
    verifiedDate: '2023-11-16T14:25:00.000Z'
  },
  {
    id: 'c2',
    title: 'Python Programming Contest Winner',
    description: 'First place in the national Python programming competition.',
    category: 'Co-curricular',
    fileUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    thumbnailUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    uploadDate: '2023-10-20T14:45:00.000Z',
    issueDate: '2023-10-15T00:00:00.000Z',
    studentId: 's1',
    studentName: 'John Smith',
    verified: true,
    verifiedBy: 'Dr. Sarah Williams',
    verifiedDate: '2023-10-21T11:10:00.000Z'
  },
  {
    id: 'c3',
    title: 'Public Speaking Workshop',
    description: 'Completion of advanced public speaking and presentation skills workshop.',
    category: 'Cultural',
    fileUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    thumbnailUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    uploadDate: '2023-09-05T09:15:00.000Z',
    issueDate: '2023-09-01T00:00:00.000Z',
    studentId: 's1',
    studentName: 'John Smith',
    verified: false
  },
  {
    id: 'c4',
    title: 'UI/UX Design Certification',
    description: 'Certification for mastering user interface and user experience design principles.',
    category: 'Academic',
    fileUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    thumbnailUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    uploadDate: '2023-12-10T16:20:00.000Z',
    issueDate: '2023-12-05T00:00:00.000Z',
    studentId: 's2',
    studentName: 'Emily Johnson',
    verified: true,
    verifiedBy: 'Dr. Sarah Williams',
    verifiedDate: '2023-12-11T10:45:00.000Z'
  },
  {
    id: 'c5',
    title: 'Dance Competition Runner-up',
    description: 'Second place in the inter-university cultural dance competition.',
    category: 'Cultural',
    fileUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    thumbnailUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    uploadDate: '2023-11-25T13:40:00.000Z',
    issueDate: '2023-11-20T00:00:00.000Z',
    studentId: 's2',
    studentName: 'Emily Johnson',
    verified: false
  },
  {
    id: 'c6',
    title: 'Electronics Workshop Participation',
    description: 'Participation and project completion in advanced electronics workshop.',
    category: 'Workshop',
    fileUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    thumbnailUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    uploadDate: '2023-12-15T11:30:00.000Z',
    issueDate: '2023-12-10T00:00:00.000Z',
    studentId: 's3',
    studentName: 'Michael Brown',
    verified: true,
    verifiedBy: 'Prof. Robert Johnson',
    verifiedDate: '2023-12-16T09:50:00.000Z'
  },
  {
    id: 'c7',
    title: 'Volunteer Work Recognition',
    description: 'Certificate of recognition for 100+ hours of community service.',
    category: 'Social',
    fileUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    thumbnailUrl: 'https://static.vecteezy.com/system/resources/thumbnails/002/052/337/small/certificate-of-achievement-template-free-vector.jpg',
    uploadDate: '2023-10-05T10:00:00.000Z',
    issueDate: '2023-10-01T00:00:00.000Z',
    studentId: 's3',
    studentName: 'Michael Brown',
    verified: false
  }
];

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Certificate Verified',
    message: 'Your Web Development Certification has been verified by Dr. Sarah Williams.',
    read: false,
    date: '2023-11-16T14:25:00.000Z',
    type: 'success',
    link: '/student/certificates'
  },
  {
    id: 'n2',
    title: 'New Certificate Uploaded',
    message: 'Emily Johnson uploaded a new certificate: UI/UX Design Certification.',
    read: true,
    date: '2023-12-10T16:20:00.000Z',
    type: 'info',
    link: '/teacher/certificates'
  },
  {
    id: 'n3',
    title: 'Certificate Pending Verification',
    message: 'Your Dance Competition Runner-up certificate is pending verification.',
    read: false,
    date: '2023-11-25T13:40:00.000Z',
    type: 'warning',
    link: '/student/certificates'
  }
];