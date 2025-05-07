import React from 'react';
import { useAuth } from '../../context/AuthContext';

const TeacherProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Teacher Profile</h1>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-8">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl text-gray-600">
                {user?.name?.[0]?.toUpperCase() || 'T'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {user?.name || 'Not provided'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {user?.email || 'Not provided'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Department</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {user?.department || 'Not provided'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Number of Students</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {user?.students?.length || 0} students
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;