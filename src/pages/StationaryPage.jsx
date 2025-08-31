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
import { STATIONARY_TYPES, FORM_VALIDATION } from '../utils/constants';

const StationaryPage = () => {
  const [stationary, setStationary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchStationary();
  }, []);

  const fetchStationary = async () => {
    try {
      setLoading(true);
      const result = await productService.getStationary();
      if (result.success) {
        setStationary(result.data || []);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch stationary items');
    } finally {
      setLoading(false);
    }
  };

  const filteredStationary = stationary.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter.length === 0 || typeFilter.includes(item.type);
    
    return matchesSearch && matchesType;
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await productService.deleteProduct(itemToDelete.productId);
      if (result.success) {
        toast.success('Stationary item deleted successfully');
        fetchStationary();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleItemSubmit = async (data) => {
    try {
      let result;
      if (editingItem) {
        result = await productService.updateProduct(editingItem.productId, data);
      } else {
        result = await productService.createStationary(data);
      }

      if (result.success) {
        toast.success(editingItem ? 'Item updated successfully' : 'Item created successfully');
        fetchStationary();
        setShowModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Product Name',
      sortable: true
    },
    {
      key: 'type',
      title: 'Type',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
          {value}
        </span>
      )
    },
    {
      key: 'brand',
      title: 'Brand',
      sortable: true
    },
    {
      key: 'color',
      title: 'Color'
    },
    {
      key: 'size',
      title: 'Size'
    },
    {
      key: 'material',
      title: 'Material'
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
    }
  ];

  const stationaryFormFields = [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
      validation: { required: FORM_VALIDATION.REQUIRED }
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: Object.values(STATIONARY_TYPES).map(type => ({ value: type, label: type })),
      validation: { required: FORM_VALIDATION.REQUIRED }
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'text',
      required: true,
      validation: { required: FORM_VALIDATION.REQUIRED }
    },
    {
      name: 'color',
      label: 'Color',
      type: 'text',
      placeholder: 'e.g., Blue, Red, Black'
    },
    {
      name: 'size',
      label: 'Size',
      type: 'text',
      placeholder: 'e.g., A4, Medium, 0.5mm'
    },
    {
      name: 'material',
      label: 'Material',
      type: 'text',
      placeholder: 'e.g., Plastic, Metal, Paper'
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      step: '0.01',
      min: '0',
      validation: { 
        required: FORM_VALIDATION.REQUIRED,
        min: { value: 0, message: FORM_VALIDATION.MIN_PRICE }
      }
    },
    {
      name: 'quantity',
      label: 'Quantity in Stock',
      type: 'number',
      required: true,
      min: '0',
      validation: { 
        required: FORM_VALIDATION.REQUIRED,
        min: { value: 0, message: FORM_VALIDATION.MIN_QUANTITY }
      }
    }
  ];

  const typeOptions = Object.values(STATIONARY_TYPES).map(type => ({
    value: type,
    label: type
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Stationary
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your stationary inventory
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <Button
              variant="secondary"
              onClick={handleAddItem}
            >
              Add New Item
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search by name, brand, color, or material..."
          />
          <FilterDropdown
            options={typeOptions}
            selectedValues={typeFilter}
            onSelectionChange={setTypeFilter}
            placeholder="Filter by type..."
            multiSelect
          />
        </div>

        {/* Stationary Table */}
        <DataTable
          data={filteredStationary}
          columns={columns}
          loading={loading}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          emptyMessage="No stationary items found"
        />

        {/* Add/Edit Item Modal */}
        <FormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingItem ? 'Edit Stationary Item' : 'Add New Stationary Item'}
          onSubmit={handleItemSubmit}
          fields={stationaryFormFields}
          initialData={editingItem || {}}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Delete Stationary Item"
          message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default StationaryPage;