import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Helper to set token and user
const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Helper to clear auth data
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  if (response.data.token) {
    setAuthData(response.data.token, response.data.user);
  }
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}login`, { email, password });
  if (response.data.token) {
    setAuthData(response.data.token, response.data.user);
  }
  return response.data;
};

export const logoutUser = async () => {
  try {
    await axios.post(`${API_URL}logout`);
  } catch (error) {
    console.log('Logout error:', error);
  } finally {
    clearAuthData();
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getAuthToken = () => getToken();

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}profile`, profileData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};