import { User, LoginCredentials, RegisterData } from '../types';
import { mockUsers } from '../data/mockData';

// Simulate API calls with localStorage for persistence
const STORAGE_KEY = 'certificate_app_user';

// Get the current user from localStorage
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (userData) {
      resolve(JSON.parse(userData));
    } else {
      resolve(null);
    }
  });
};

// Login user
export const loginUser = (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === credentials.email && credentials.password === 'password' // In a real app, we'd properly verify hashed passwords
      );

      if (user) {
        // Remove password before storing user data
        const { password, ...userData } = user as any;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        resolve(userData);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

// Register user
export const registerUser = (data: RegisterData): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      // Check if email is already in use
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        reject(new Error('Email already in use'));
        return;
      }

      // In a real app, we'd create a user in the database
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        role: data.role,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
        department: data.department,
        rollNumber: data.role === 'student' ? data.rollNumber : undefined,
        mentorId: data.role === 'student' ? mockUsers.find(u => u.role === 'teacher')?.id : undefined,
        students: data.role === 'teacher' ? [] : undefined
      };

      // Add user to mock data
      mockUsers.push({ ...newUser, password: data.password } as any);
      
      // Store in localStorage without password
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      
      resolve(newUser);
    }, 800);
  });
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Update user profile
export const updateUserProfile = (userId: string, data: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        reject(new Error('User not found'));
        return;
      }
      
      // Update user in mock data
      const updatedUser = { ...mockUsers[userIndex], ...data };
      mockUsers[userIndex] = updatedUser;
      
      // Update localStorage if it's the current user
      const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (currentUser.id === userId) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({...currentUser, ...data}));
      }
      
      // Remove password before returning
      const { password, ...userData } = updatedUser as any;
      resolve(userData);
    }, 800);
  });
};