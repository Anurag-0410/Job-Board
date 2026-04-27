import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser, getAuthToken } from '../services/authService';
import { applyForJob as apiApplyForJob } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      const currentUser = getCurrentUser();
      if (token && currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await loginUser(email, password);
      setUser(userData.user);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await registerUser(userData);
      setUser(newUser.user);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user in context
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const applyForJob = async (jobId, applicationData) => {
    try {
      const payload = {
        jobId,
        applicantName: applicationData.name,
        applicantEmail: applicationData.email,
        resume: applicationData.resume,
        coverLetter: applicationData.coverLetter,
        phone: applicationData.phone || '',
      };
      
      const response = await apiApplyForJob(payload);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated,
      login, 
      register, 
      logout,
      updateUser,
      applyForJob,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};