import api, { handleApiError } from './api';

const API_ENDPOINTS = {
  PRODUCTS: {
    BASE: '/api/products',
    BOOKS: '/api/products/books',
    STATIONARY: '/api/products/stationary',
    CREATE_BOOK: '/api/products/book',
    CREATE_STATIONARY: '/api/products/stationary',
    LOW_STOCK: '/api/products/lowstock'
  }
};

export const productService = {
  async getAllProducts(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
      
      return {
        success: true,
        data: response.data,
        message: 'Products fetched successfully'
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

  async getProductById(id) {
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Product fetched successfully'
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

  async createBook(bookData) {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE_BOOK, bookData);
      
      return {
        success: true,
        data: response.data,
        message: 'Book created successfully'
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

  async createStationary(stationaryData) {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE_STATIONARY, stationaryData);
      
      return {
        success: true,
        data: response.data,
        message: 'Stationary created successfully'
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

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`, productData);
      
      return {
        success: true,
        data: response.data,
        message: 'Product updated successfully'
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

  async deleteProduct(id) {
    try {
      await api.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
      
      return {
        success: true,
        message: 'Product deleted successfully'
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

  async getBooks(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.BOOKS, { params });
      
      return {
        success: true,
        data: response.data,
        message: 'Books fetched successfully'
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

  async getStationary(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.STATIONARY, { params });
      
      return {
        success: true,
        data: response.data,
        message: 'Stationary items fetched successfully'
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

  async searchProducts(query, filters = {}) {
    try {
      const params = { q: query, ...filters };
      const response = await api.get(API_ENDPOINTS.PRODUCTS.SEARCH, { params });
      
      return {
        success: true,
        data: response.data,
        message: 'Search completed successfully'
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

  async getLowStockProducts(threshold = 5) {
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS.LOW_STOCK}?threshold=${threshold}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Low stock products fetched successfully'
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

  async getBooksByGenre(genre) {
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS.BOOKS}/genre/${genre}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Books by genre fetched successfully'
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

  async getBooksByAuthor(author) {
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS.BOOKS}/author/${author}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Books by author fetched successfully'
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

  async getStationaryByType(type) {
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS.STATIONARY}/type/${type}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Stationary by type fetched successfully'
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

  async getStationaryByBrand(brand) {
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS.STATIONARY}/brand/${brand}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Stationary by brand fetched successfully'
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

  async updateStock(id, quantity) {
    try {
      const response = await api.patch(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/stock`, {
        quantity
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Stock updated successfully'
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

  async bulkUpdateProducts(updates) {
    try {
      const response = await api.patch(`${API_ENDPOINTS.PRODUCTS.BASE}/bulk`, {
        updates
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Bulk update completed successfully'
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

  async bulkDeleteProducts(ids) {
    try {
      await api.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/bulk`, {
        data: { ids }
      });
      
      return {
        success: true,
        message: 'Products deleted successfully'
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        message: apiError.message,
        error: apiError
      };
    }
  }
};

export default productService;