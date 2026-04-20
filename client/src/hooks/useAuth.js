import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login, register, logout } from '../services/authService';

const useAuth = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Logic to check if user is authenticated
      const user = await getUserFromLocalStorage(); // Implement this function
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [setUser, setIsAuthenticated]);

  const handleLogin = async (credentials) => {
    const user = await login(credentials);
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRegister = async (userData) => {
    const user = await register(userData);
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};

export default useAuth;