import { useState, useCallback } from 'react';
import api, { handleApiError } from '../services/api';

export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (requestFunction, showSuccessMessage = false, successMessage = 'Operation completed successfully') => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestFunction();
      
      if (showSuccessMessage && result.success) {
        // You can integrate with toast here if needed
        console.log(successMessage);
      }
      
      return result;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      return {
        success: false,
        message: apiError.message,
        error: apiError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async (url, params = {}) => {
    return makeRequest(async () => {
      const response = await api.get(url, { params });
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    });
  }, [makeRequest]);

  const post = useCallback(async (url, data = {}, showSuccess = false, successMessage = 'Created successfully') => {
    return makeRequest(async () => {
      const response = await api.post(url, data);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    }, showSuccess, successMessage);
  }, [makeRequest]);

  const put = useCallback(async (url, data = {}, showSuccess = false, successMessage = 'Updated successfully') => {
    return makeRequest(async () => {
      const response = await api.put(url, data);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    }, showSuccess, successMessage);
  }, [makeRequest]);

  const patch = useCallback(async (url, data = {}, showSuccess = false, successMessage = 'Updated successfully') => {
    return makeRequest(async () => {
      const response = await api.patch(url, data);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    }, showSuccess, successMessage);
  }, [makeRequest]);

  const del = useCallback(async (url, showSuccess = false, successMessage = 'Deleted successfully') => {
    return makeRequest(async () => {
      const response = await api.delete(url);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    }, showSuccess, successMessage);
  }, [makeRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,
    makeRequest
  };
};

export const useAsyncOperation = (operation) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation(...args);
      setData(result);
      return result;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [operation]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
};

export const usePagination = (initialPage = 1, initialPageSize = 20) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const changePageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  const updateTotal = useCallback((newTotal) => {
    setTotal(newTotal);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    setTotal(0);
  }, [initialPage, initialPageSize]);

  return {
    page,
    pageSize,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    updateTotal,
    reset,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useAPI;