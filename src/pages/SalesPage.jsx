import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import FilterDropdown from '../components/ui/FilterDropdown';
import SearchBar from '../components/ui/SearchBar';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import salesService from '../services/salesService';
import { SALE_STATUS, PAYMENT_METHODS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/helpers';

const SalesPage = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ totalSalesAmount: 0, totalSalesCount: 0 });
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    loadSalesData();
    loadAnalytics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sales, filters]);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const result = await salesService.getAllSales();
      if (result.success) {
        setSales(result.data);
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const result = await salesService.getSalesAnalytics();
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...sales];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(sale => sale.saleStatus === filters.status);
    }

    // Filter by payment method
    if (filters.paymentMethod !== 'all') {
      filtered = filtered.filter(sale => sale.paymentMethod === filters.paymentMethod);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(sale =>
        sale.customerName.toLowerCase().includes(searchTerm) ||
        sale.saleNumber.toLowerCase().includes(searchTerm) ||
        sale.soldByName.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredSales(filtered);
  };

  const handleStatusUpdate = async (saleId, newStatus) => {
    try {
      const result = await salesService.updateSaleStatus(saleId, newStatus);
      if (result.success) {
        toast.success('Sale status updated successfully');
        loadSalesData();
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error('Failed to update sale status');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      case 'REFUNDED': return 'secondary';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'saleNumber',
      header: 'Sale #',
      render: (value, sale) => (
        <button
          onClick={() => navigate(`/sales/${sale.saleId}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {value}
        </button>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true
    },
    {
      key: 'saleDate',
      header: 'Date',
      render: (value) => formatDate(value),
      sortable: true
    },
    {
      key: 'itemsCount',
      header: 'Items',
      render: (value) => `${value} item${value !== 1 ? 's' : ''}`
    },
    {
      key: 'totalAmount',
      header: 'Subtotal',
      render: (value) => formatCurrency(value),
      sortable: true
    },
    {
      key: 'discount',
      header: 'Discount',
      render: (value) => value > 0 ? `-${formatCurrency(value)}` : '-'
    },
    {
      key: 'finalAmount',
      header: 'Total',
      render: (value) => formatCurrency(value),
      sortable: true
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      render: (value) => (
        <Badge variant="outline">
          {value}
        </Badge>
      )
    },
    {
      key: 'saleStatus',
      header: 'Status',
      render: (value, sale) => (
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(value)}>
            {value}
          </Badge>
          {value === 'PENDING' && (
            <select
              onChange={(e) => {
                if (e.target.value !== 'PENDING') {
                  handleStatusUpdate(sale.saleId, e.target.value);
                }
              }}
              className="text-xs border rounded px-1 py-0.5"
              defaultValue="PENDING"
            >
              <option value="PENDING">Change Status</option>
              <option value="COMPLETED">Complete</option>
              <option value="CANCELLED">Cancel</option>
            </select>
          )}
        </div>
      )
    },
    {
      key: 'soldByName',
      header: 'Sold By',
      sortable: true
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    ...Object.values(SALE_STATUS).map(status => ({
      value: status,
      label: status
    }))
  ];

  const paymentMethodOptions = [
    { value: 'all', label: 'All Payment Methods' },
    ...Object.values(PAYMENT_METHODS).map(method => ({
      value: method,
      label: method
    }))
  ];

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600 mt-1">View and manage all sales transactions</p>
        </div>
        <Button
          onClick={() => navigate('/sales/create')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + New Sale
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalSalesCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalSalesAmount)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Sale</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.totalSalesCount > 0 ? analytics.totalSalesAmount / analytics.totalSalesCount : 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <SearchBar
              placeholder="Search by customer name, sale number, or sold by..."
              onSearch={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
            />
          </div>
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          />
          <FilterDropdown
            label="Payment Method"
            options={paymentMethodOptions}
            value={filters.paymentMethod}
            onChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}
          />
          <Button
            variant="outline"
            onClick={() => setFilters({ status: 'all', paymentMethod: 'all', searchTerm: '' })}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Sales Table */}
      <Card>
        <DataTable
          data={filteredSales}
          columns={columns}
          loading={loading}
          emptyMessage="No sales found"
          pagination={{
            enabled: true,
            pageSize: 20
          }}
        />
      </Card>
    </div>
  );
};

export default SalesPage;