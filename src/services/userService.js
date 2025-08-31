import api, { handleApiError } from './api';

const API_ENDPOINTS = {
  AUTH: {
    REGISTER_CUSTOMER: '/api/auth/register/customer',
    REGISTER_CASHIER: '/api/auth/register/cashier'
  }
};

export const userService = {
  async registerCustomer(customerData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER_CUSTOMER, customerData);
      
      return {
        success: true,
        data: response.data,
        message: 'Customer registered successfully'
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        message: apiError.message,
        error: apiError
      };
    }
  },

  async registerCashier(cashierData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER_CASHIER, cashierData);
      
      return {
        success: true,
        data: response.data,
        message: 'Cashier registered successfully'
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        message: apiError.message,
        error: apiError
      };
    }
  },

  // Helper function to check if user has admin privileges
  isAdmin() {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'ADMIN';
  },

  // Helper function to enforce admin access
  requireAdmin() {
    if (!this.isAdmin()) {
      throw new Error('Admin access required');
    }
  }
};

export default userService;