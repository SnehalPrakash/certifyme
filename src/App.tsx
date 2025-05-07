import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CertificateProvider } from './context/CertificateContext';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import UploadCertificate from './pages/student/UploadCertificate';
import MyCertificates from './pages/student/MyCertificates';
import StudentProfile from './pages/student/Profile';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentManagement from './pages/teacher/StudentManagement';
import CertificateVerification from './pages/teacher/CertificateVerification';
import TeacherProfile from './pages/teacher/Profile';

// Shared Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CertificateProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Routes */}
            <Route 
              path="/student" 
              element={
                <PrivateRoute role="student">
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="upload" element={<UploadCertificate />} />
              <Route path="certificates" element={<MyCertificates />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
            
            {/* Teacher Routes */}
            <Route 
              path="/teacher" 
              element={
                <PrivateRoute role="teacher">
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="certificates" element={<CertificateVerification />} />
              <Route path="profile" element={<TeacherProfile />} />
            </Route>
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CertificateProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;