import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Award, 
  LogOut, 
  Upload, 
  Clipboard, 
  Home, 
  Users, 
  CheckSquare, 
  BellRing,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  const studentNavItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/student/upload', label: 'Upload Certificate', icon: <Upload size={20} /> },
    { path: '/student/certificates', label: 'My Certificates', icon: <Award size={20} /> },
    { path: '/student/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const teacherNavItems = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/teacher/students', label: 'My Students', icon: <Users size={20} /> },
    { path: '/teacher/certificates', label: 'Certificates', icon: <CheckSquare size={20} /> },
    { path: '/teacher/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const navItems = isStudent ? studentNavItems : teacherNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={`/${user?.role}/dashboard`} className="flex items-center">
              <Award className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CertifyMe</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <BellRing size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </button>
            
            <div className="flex items-center">
              <img 
                src={user?.profileImage || 'https://ui-avatars.com/api/?name=User&background=random'} 
                alt={user?.name || 'User'} 
                className="h-8 w-8 rounded-full"
              />
              <span className="ml-2 text-gray-700">{user?.name}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="ml-4 p-2 rounded-md hover:bg-gray-100 flex items-center text-gray-700"
            >
              <LogOut size={18} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-2 rounded-md ${
                  location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-gray-200 my-2 pt-2">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-white shadow-md">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    location.pathname === item.path 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;