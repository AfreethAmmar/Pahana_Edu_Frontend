import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
// import Input from './Input'; // Not used in this component
import Button from './Button';
import Badge from './Badge';
import Card from './Card';
import Loading from './Loading';
import FilterDropdown from './FilterDropdown';
import SearchBar from './SearchBar';
import productService from '../../services/productService';
import { PRODUCT_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const ProductSelector = ({ selectedItems = [], onItemsChange, disabled = false }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, categoryFilter]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await productService.getAllProducts();
      if (result.success) {
        // Filter only available products with stock > 0
        const availableProducts = result.data.filter(product => 
          product.status === 'AVAILABLE' && product.quantity > 0
        );
        setProducts(availableProducts);
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.productCode.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const getSelectedQuantity = (productId) => {
    const item = selectedItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const getAvailableStock = (product) => {
    const selectedQty = getSelectedQuantity(product.productId);
    return product.quantity - selectedQty;
  };

  const addToCart = (product) => {
    const currentQuantity = getSelectedQuantity(product.productId);
    if (currentQuantity >= product.quantity) {
      toast.error(`Cannot add more items. Only ${product.quantity} in stock.`);
      return;
    }

    const existingItemIndex = selectedItems.findIndex(item => item.productId === product.productId);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      updatedItems = [...selectedItems, {
        productId: product.productId,
        productName: product.name,
        productCode: product.productCode,
        productCategory: product.category,
        unitPrice: product.price,
        quantity: 1
      }];
    }

    onItemsChange(updatedItems);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 0) return;

    const product = products.find(p => p.productId === productId);
    if (newQuantity > product.quantity) {
      toast.error(`Cannot exceed stock limit of ${product.quantity}`);
      return;
    }

    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = selectedItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    onItemsChange(updatedItems);
  };

  const removeFromCart = (productId) => {
    const updatedItems = selectedItems.filter(item => item.productId !== productId);
    onItemsChange(updatedItems);
  };

  const calculateSubtotal = (item) => {
    return item.unitPrice * item.quantity;
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + calculateSubtotal(item), 0);
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...Object.values(PRODUCT_TYPES).map(type => ({
      value: type,
      label: type
    }))
  ];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Product Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 min-w-0">
            <SearchBar
              placeholder="Search products by name or code..."
              onSearch={setSearchTerm}
              disabled={disabled}
            />
          </div>
          <FilterDropdown
            label="Category"
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            disabled={disabled}
          />
        </div>
      </Card>

      {/* Selected Items Cart */}
      {selectedItems.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Selected Items ({selectedItems.length})</h3>
          <div className="space-y-3">
            {selectedItems.map(item => (
              <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.productName}</span>
                    <Badge variant="outline" size="sm">{item.productCode}</Badge>
                    <Badge variant="secondary" size="sm">{item.productCategory}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatCurrency(item.unitPrice)} each
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={disabled}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={disabled}
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-right min-w-20">
                    <div className="font-medium">{formatCurrency(calculateSubtotal(item))}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-800"
                    disabled={disabled}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Available Products */}
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4">Available Products</h3>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || categoryFilter !== 'all' 
              ? 'No products found matching your criteria'
              : 'No products available'
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const availableStock = getAvailableStock(product);
              const selectedQty = getSelectedQuantity(product.productId);
              const isOutOfStock = availableStock <= 0;

              return (
                <div
                  key={product.productId}
                  className={`border rounded-lg p-4 transition-colors ${
                    isOutOfStock 
                      ? 'border-gray-200 bg-gray-50 opacity-60' 
                      : 'border-gray-300 hover:border-blue-400 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" size="sm">{product.productCode}</Badge>
                        <Badge 
                          variant={product.category === 'BOOK' ? 'primary' : 'secondary'} 
                          size="sm"
                        >
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Stock: {availableStock} available
                      {selectedQty > 0 && (
                        <span className="text-blue-600 ml-1">
                          ({selectedQty} selected)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={disabled || isOutOfStock}
                      className={isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {isOutOfStock ? 'Out of Stock' : selectedQty > 0 ? 'Add More' : 'Add to Cart'}
                    </Button>
                    
                    {selectedQty > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(product.productId, selectedQty - 1)}
                          disabled={disabled}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{selectedQty}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(product.productId, selectedQty + 1)}
                          disabled={disabled || selectedQty >= product.quantity}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductSelector;