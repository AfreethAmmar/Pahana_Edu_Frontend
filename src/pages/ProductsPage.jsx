import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import SearchBar from '../components/ui/SearchBar';
import FilterDropdown from '../components/ui/FilterDropdown';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StockBadge from '../components/ui/StockBadge';
import Button from '../components/ui/Button';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/helpers';
import { BOOK_GENRES, STATIONARY_TYPES } from '../utils/constants';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('book');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await productService.getAllProducts();
      if (result.success) {
        setProducts(result.data || []);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = filters.length === 0 || 
      filters.includes(product.category) ||
      filters.includes(product.genre) ||
      filters.includes(product.type);
    
    return matchesSearch && matchesFilters;
  });

  const handleAddProduct = (type) => {
    setModalType(type);
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setModalType(product.category.toLowerCase());
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await productService.deleteProduct(productToDelete.productId);
      if (result.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleProductSubmit = async (data) => {
    try {
      let result;
      if (editingProduct) {
        result = await productService.updateProduct(editingProduct.productId, data);
      } else {
        if (modalType === 'book') {
          result = await productService.createBook(data);
        } else {
          result = await productService.createStationary(data);
        }
      }

      if (result.success) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        fetchProducts();
        setShowModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleUpdateStock = async (product, newQuantity) => {
    try {
      const result = await productService.updateStock(product.productId, newQuantity);
      if (result.success) {
        toast.success('Stock updated successfully');
        fetchProducts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Name',
      sortable: true
    },
    {
      key: 'category',
      title: 'Category',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          {value}
        </span>
      )
    },
    {
      key: 'price',
      title: 'Price',
      type: 'currency',
      sortable: true
    },
    {
      key: 'quantity',
      title: 'Stock',
      render: (value) => <StockBadge quantity={value} />,
      sortable: true
    },
    {
      key: 'author',
      title: 'Author/Brand',
      render: (value, row) => row?.author || row?.brand || '-'
    },
    {
      key: 'genre',
      title: 'Genre/Type',
      render: (value, row) => row?.genre || row?.type || '-'
    }
  ];

  const getFormFields = () => {
    const commonFields = [
      {
        name: 'name',
        label: 'Product Name',
        type: 'text',
        required: true,
        validation: { required: 'Product name is required' }
      },
      {
        name: 'price',
        label: 'Price',
        type: 'number',
        required: true,
        step: '0.01',
        min: '0',
        validation: { 
          required: 'Price is required',
          min: { value: 0, message: 'Price must be positive' }
        }
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        required: true,
        min: '0',
        validation: { 
          required: 'Quantity is required',
          min: { value: 0, message: 'Quantity cannot be negative' }
        }
      }
    ];

    if (modalType === 'book') {
      return [
        ...commonFields,
        {
          name: 'genre',
          label: 'Genre',
          type: 'select',
          options: Object.values(BOOK_GENRES).map(genre => ({ value: genre, label: genre }))
        },
        {
          name: 'author',
          label: 'Author',
          type: 'text'
        },
        {
          name: 'isbn',
          label: 'ISBN',
          type: 'text'
        },
        {
          name: 'publisher',
          label: 'Publisher',
          type: 'text'
        },
        {
          name: 'pages',
          label: 'Pages',
          type: 'number',
          min: '1'
        }
      ];
    } else {
      return [
        ...commonFields,
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: Object.values(STATIONARY_TYPES).map(type => ({ value: type, label: type }))
        },
        {
          name: 'brand',
          label: 'Brand',
          type: 'text'
        },
        {
          name: 'color',
          label: 'Color',
          type: 'text'
        },
        {
          name: 'size',
          label: 'Size',
          type: 'text'
        },
        {
          name: 'material',
          label: 'Material',
          type: 'text'
        }
      ];
    }
  };

  const filterOptions = [
    { value: 'BOOK', label: 'Books' },
    { value: 'STATIONARY', label: 'Stationary' },
    ...Object.values(BOOK_GENRES).map(genre => ({ value: genre, label: `Books - ${genre}` })),
    ...Object.values(STATIONARY_TYPES).map(type => ({ value: type, label: `Stationary - ${type}` }))
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Products
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your books and stationary inventory
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => handleAddProduct('book')}
              >
                Add Book
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleAddProduct('stationary')}
              >
                Add Stationary
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search products..."
          />
          <FilterDropdown
            options={filterOptions}
            selectedValues={filters}
            onSelectionChange={setFilters}
            placeholder="Filter by category..."
            multiSelect
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
          </div>
        </div>

        {/* Products Table/Grid */}
        <DataTable
          data={filteredProducts}
          columns={columns}
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          selectable
          onSelectionChange={setSelectedProducts}
          emptyMessage="No products found"
        />

        {/* Add/Edit Product Modal */}
        <FormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingProduct ? 'Edit Product' : `Add ${modalType === 'book' ? 'Book' : 'Stationary'}`}
          onSubmit={handleProductSubmit}
          fields={getFormFields()}
          initialData={editingProduct || {}}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default ProductsPage;