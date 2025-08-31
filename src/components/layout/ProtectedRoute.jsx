import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/helpers';
import Loading from '../ui/Loading';

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/login',
  showUnauthorized = false 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading fullScreen text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasPermission(user?.role, requiredRoles)) {
    if (showUnauthorized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              You don't have permission to access this page. Required roles: {requiredRoles.join(', ')}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;