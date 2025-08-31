import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import Loading from '../components/ui/Loading';

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen text="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSuccess = () => {
    // Navigation will be handled by the redirect logic above
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
};

export default LoginPage;