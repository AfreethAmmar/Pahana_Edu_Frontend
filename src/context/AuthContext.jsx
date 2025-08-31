import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const initializeAuth = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const isAuthenticated = authService.isAuthenticated();
      
      if (isAuthenticated) {
        // const user = authService.getCurrentUser();
        
        if (authService.isSessionExpired()) {
          await logout();
          return;
        }
        
        const profileResult = await authService.getProfile();
        
        if (profileResult.success) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: profileResult.data.user }
          });
        } else {
          dispatch({
            type: 'LOGIN_FAILURE',
            payload: 'Session expired'
          });
          authService.clearAuthData();
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Failed to initialize authentication'
      });
      authService.clearAuthData();
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const result = await authService.login(credentials);
      
      if (result.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: result.data.user }
        });
        toast.success('Login successful!');
        return { success: true };
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: result.message
        });
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const result = await authService.register(userData);
      
      if (result.success) {
        toast.success('Registration successful!');
        return { success: true };
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: result.message
        });
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: result.data.user
        });
        toast.success('Profile updated successfully!');
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles) => {
    return authService.hasAnyRole(roles);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    updateProfile,
    hasRole,
    hasAnyRole,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;