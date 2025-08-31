import api, { handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.data.sessionId) {
        localStorage.setItem('sessionId', response.data.sessionId);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userRole', response.data.user.role);
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
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

  async logout() {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
  },

  async register(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      return {
        success: true,
        data: response.data,
        message: 'Registration successful'
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

  async getProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      
      return {
        success: true,
        data: response.data,
        message: 'Profile fetched successfully'
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

  async updateProfile(profileData) {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
      
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully'
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

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  getSessionId() {
    return localStorage.getItem('sessionId');
  },

  isAuthenticated() {
    const sessionId = this.getSessionId();
    const user = this.getCurrentUser();
    return !!(sessionId && user);
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return user && roles.includes(user.role);
  },

  isSessionExpired() {
    const user = this.getCurrentUser();
    if (!user || !user.tokenExpiry) return false;
    
    return new Date().getTime() > user.tokenExpiry;
  },

  clearAuthData() {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  }
};

export default authService;