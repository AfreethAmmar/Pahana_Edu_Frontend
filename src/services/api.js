import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers.Cookie = `JSESSIONID=${sessionId}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Check if it's a CORS error
    if (error.message.includes('CORS') || error.code === 'ERR_NETWORK') {
      return {
        message: 'Backend server is not responding or CORS is not configured. Please ensure the backend server is running and CORS is enabled.',
        status: 0,
        data: null,
        type: 'CORS_ERROR'
      };
    }
    return {
      message: 'Network error - please check your connection and ensure the backend server is running',
      status: 0,
      data: null
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null
    };
  }
};

export const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

export default api;