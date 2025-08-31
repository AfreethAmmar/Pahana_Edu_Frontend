import api, { handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

class SalesService {
  // Get all sales
  async getAllSales() {
    try {
      const response = await api.get(API_ENDPOINTS.SALES.BASE);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // Get sale by ID
  async getSaleById(id) {
    try {
      const response = await api.get(`${API_ENDPOINTS.SALES.BASE}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // Create new sale
  async createSale(saleData) {
    try {
      const response = await api.post(API_ENDPOINTS.SALES.CREATE, {
        customerId: saleData.customerId || null,
        customerName: saleData.customerName,
        items: saleData.items,
        paymentMethod: saleData.paymentMethod || 'CASH',
        discount: saleData.discount || '0.00',
        notes: saleData.notes || ''
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // Get sales by status
  async getSalesByStatus(status) {
    try {
      const response = await api.get(`${API_ENDPOINTS.SALES.BY_STATUS}/${status}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // Get sales by customer
  async getSalesByCustomer(customerId) {
    try {
      const response = await api.get(`${API_ENDPOINTS.SALES.BY_CUSTOMER}/${customerId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // Get sales analytics
  async getSalesAnalytics() {
    try {
      const response = await api.get(API_ENDPOINTS.SALES.ANALYTICS);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // Update sale status
  async updateSaleStatus(saleId, status) {
    try {
      const response = await api.put(`${API_ENDPOINTS.SALES.BASE}/${saleId}/status`, {
        status: status
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error)
      };
    }
  }

  // Format items for API (convert array to string format)
  formatItemsForApi(items) {
    return items.map(item => `${item.productId}:${item.quantity}`).join(',');
  }

  // Calculate total amount from items
  calculateTotal(items) {
    return items.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0);
  }

  // Calculate final amount after discount
  calculateFinalAmount(subtotal, discount = 0) {
    return Math.max(0, subtotal - parseFloat(discount));
  }
}

const salesService = new SalesService();
export default salesService;