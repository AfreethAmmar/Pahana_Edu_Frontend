import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import SearchBar from '../components/ui/SearchBar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { userService } from '../services/userService';
import { FORM_VALIDATION } from '../utils/constants';

const CashiersPage = () => {
  const { hasRole } = useAuth();
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate fetching cashiers - replace with actual API call
    setLoading(false);
    setCashiers([
      {
        id: 1, 
        username: 'cashier1',
        fullName: 'Alice Johnson',
        email: 'alice.johnson@pahana.com',
        salary: 25000.00,
        record: 'EXPERIENCED',
        registrationDate: '2024-01-10',
        status: 'Active'
      },
      {
        id: 2,
        username: 'cashier2',
        fullName: 'Bob Wilson',
        email: 'bob.wilson@pahana.com',
        salary: 22000.00,
        record: 'NEW',
        registrationDate: '2024-03-15',
        status: 'Active'
      }
    ]);
  }, []);

  // Check admin access
  if (!hasRole('ADMIN')) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              You need administrator privileges to access cashier management.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredCashiers = cashiers.filter(cashier => {
    return !searchTerm || 
      cashier.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleRegisterCashier = async (data) => {
    try {
      const result = await userService.registerCashier(data);
      if (result.success) {
        toast.success('Cashier registered successfully');
        // Refresh cashier list
        setShowModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to register cashier');
    }
  };

  const columns = [
    {
      key: 'username',
      title: 'Username',
      sortable: true
    },
    {
      key: 'fullName',
      title: 'Full Name',
      sortable: true
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true
    },
    {
      key: 'salary',
      title: 'Salary',
      type: 'currency',
      sortable: true
    },
    {
      key: 'record',
      title: 'Experience',
      render: (value) => {
        const variant = value === 'EXPERIENCED' ? 'success' : 'warning';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => {
        const variant = value === 'Active' ? 'success' : 'danger';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      key: 'registrationDate',
      title: 'Registration Date',
      type: 'date',
      sortable: true
    }
  ];

  const cashierFormFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      validation: { 
        required: FORM_VALIDATION.REQUIRED,
        minLength: { value: 3, message: 'Username must be at least 3 characters' }
      }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      validation: { 
        required: FORM_VALIDATION.REQUIRED,
        minLength: { value: 6, message: FORM_VALIDATION.MIN_PASSWORD }
      }
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      validation: { 
        required: FORM_VALIDATION.REQUIRED,
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: FORM_VALIDATION.EMAIL
        }
      }
    },
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      validation: { required: FORM_VALIDATION.REQUIRED }
    },
    {
      name: 'salary',
      label: 'Monthly Salary',
      type: 'number',
      required: true,
      step: '0.01',
      min: '0',
      validation: { 
        required: FORM_VALIDATION.REQUIRED,
        min: { value: 0, message: 'Salary must be positive' }
      }
    },
    {
      name: 'record',
      label: 'Experience Level',
      type: 'select',
      required: true,
      options: [
        { value: 'NEW', label: 'New' },
        { value: 'EXPERIENCED', label: 'Experienced' },
        { value: 'SENIOR', label: 'Senior' }
      ],
      validation: { required: FORM_VALIDATION.REQUIRED }
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Cashiers
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage cashier accounts and permissions
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              Register New Cashier
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search cashiers..."
          />
        </div>

        {/* Cashiers Table */}
        <DataTable
          data={filteredCashiers}
          columns={columns}
          loading={loading}
          actions={false}
          emptyMessage="No cashiers found"
        />

        {/* Register Cashier Modal */}
        <FormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Register New Cashier"
          onSubmit={handleRegisterCashier}
          fields={cashierFormFields}
          submitText="Register Cashier"
        />
      </div>
    </Layout>
  );
};

export default CashiersPage;