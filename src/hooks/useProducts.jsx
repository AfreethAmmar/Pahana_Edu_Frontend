import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { debounce } from '../utils/helpers';
import toast from 'react-hot-toast';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await productService.getAllProducts({
        ...initialParams,
        ...params
      });
      
      if (result.success) {
        setProducts(result.data.products || []);
        setPagination({
          page: result.data.page || 1,
          pageSize: result.data.pageSize || 20,
          total: result.data.total || 0,
          totalPages: result.data.totalPages || 0
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const createProduct = async (productData) => {
    try {
      const result = await productService.createProduct(productData);
      
      if (result.success) {
        toast.success('Product created successfully');
        await fetchProducts();
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to create product');
      return { success: false, message: 'Failed to create product' };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const result = await productService.updateProduct(id, productData);
      
      if (result.success) {
        toast.success('Product updated successfully');
        setProducts(prev => 
          prev.map(product => 
            product.id === id ? { ...product, ...result.data } : product
          )
        );
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to update product');
      return { success: false, message: 'Failed to update product' };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const result = await productService.deleteProduct(id);
      
      if (result.success) {
        toast.success('Product deleted successfully');
        setProducts(prev => prev.filter(product => product.id !== id));
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to delete product');
      return { success: false, message: 'Failed to delete product' };
    }
  };

  const updateStock = async (id, quantity) => {
    try {
      const result = await productService.updateStock(id, quantity);
      
      if (result.success) {
        toast.success('Stock updated successfully');
        setProducts(prev => 
          prev.map(product => 
            product.id === id ? { ...product, quantity } : product
          )
        );
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to update stock');
      return { success: false, message: 'Failed to update stock' };
    }
  };

  const bulkDelete = async (ids) => {
    try {
      const result = await productService.bulkDeleteProducts(ids);
      
      if (result.success) {
        toast.success(`${ids.length} products deleted successfully`);
        setProducts(prev => prev.filter(product => !ids.includes(product.id)));
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to delete products');
      return { success: false, message: 'Failed to delete products' };
    }
  };

  const bulkUpdate = async (updates) => {
    try {
      const result = await productService.bulkUpdateProducts(updates);
      
      if (result.success) {
        toast.success('Products updated successfully');
        await fetchProducts();
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to update products');
      return { success: false, message: 'Failed to update products' };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    bulkDelete,
    bulkUpdate,
    refetch: fetchProducts
  };
};

export const useProductSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(
    debounce(async (query, filters = {}) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await productService.searchProducts(query, filters);
        
        if (result.success) {
          setResults(result.data.products || []);
        } else {
          setError(result.message);
          setResults([]);
        }
      } catch (err) {
        setError('Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
};

export const useLowStockProducts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLowStockProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await productService.getLowStockProducts();
      
      if (result.success) {
        setLowStockProducts(result.data.products || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch low stock products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLowStockProducts();
  }, [fetchLowStockProducts]);

  return {
    lowStockProducts,
    loading,
    error,
    refetch: fetchLowStockProducts
  };
};

export default useProducts;