import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import BooksPage from './pages/BooksPage';
import StationaryPage from './pages/StationaryPage';
import CustomersPage from './pages/CustomersPage';
import CashiersPage from './pages/CashiersPage';
import SalesPage from './pages/SalesPage';
import CreateSalePage from './pages/CreateSalePage';
import SaleDetailsPage from './pages/SaleDetailsPage';
import { USER_ROLES } from './utils/constants';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/products"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CASHIER]}>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/books"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CASHIER]}>
                  <BooksPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/stationary"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CASHIER]}>
                  <StationaryPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/customers"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.CASHIER]}>
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/cashiers"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]} showUnauthorized>
                  <CashiersPage />
                </ProtectedRoute>
              }
            />

            {/* Sales Routes */}
            <Route
              path="/sales"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CASHIER]}>
                  <SalesPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/sales/create"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CASHIER]}>
                  <CreateSalePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/sales/:id"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.CASHIER]}>
                  <SaleDetailsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="max-w-md w-full text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20c-2.22 0-4.22-.896-5.657-2.343A7.962 7.962 0 014 12c0-2.22.896-4.22 2.343-5.657A7.962 7.962 0 0112 4c2.22 0 4.22.896 5.657 2.343A7.962 7.962 0 0120 12a7.963 7.963 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">404</h1>
                    <h2 className="mt-2 text-xl font-semibold text-gray-700">Page Not Found</h2>
                    <p className="mt-2 text-gray-500">
                      The page you're looking for doesn't exist.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;