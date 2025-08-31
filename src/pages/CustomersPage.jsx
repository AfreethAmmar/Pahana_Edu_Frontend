import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import SearchBar from '../components/ui/SearchBar';
import Button from '../components/ui/Button';
import { userService } from '../services/userService';
import { FORM_VALIDATION } from '../utils/constants';

const CustomersPage = () => {
  const { hasRole } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate fetching customers - replace with actual API call
    setLoading(false);
    setCustomers([
      {
        id: 1,
        username: 'customer1',
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        customerAddress: '123 Main Street, City',
        comment: 'VIP Customer',
        registrationDate: '2024-01-15'
      },
      {
        id: 2,
        username: 'customer2',
        fullName: 'Jane Doe',
        email: 'jane.doe@email.com',
        customerAddress: '456 Oak Avenue, Town',
        comment: 'Regular customer',
        registrationDate: '2024-02-20'
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
              You need administrator privileges to access customer management.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredCustomers = customers.filter(customer => {
    return !searchTerm || 
      customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleRegisterCustomer = async (data) => {
    try {
      const result = await userService.registerCustomer(data);
      if (result.success) {
        toast.success('Customer registered successfully');
        // Refresh customer list
        setShowModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to register customer');
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
      key: 'customerAddress',
      title: 'Address'
    },
    {
      key: 'comment',
      title: 'Comment'
    },
    {
      key: 'registrationDate',
      title: 'Registration Date',
      type: 'date',
      sortable: true
    }
  ];

  const customerFormFields = [
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
      name: 'customerAddress',
      label: 'Address',
      type: 'textarea',
      rows: 3,
      placeholder: 'Enter customer address'
    },
    {
      name: 'comment',
      label: 'Comment',
      type: 'textarea',
      rows: 2,
      placeholder: 'Any additional notes about the customer'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Customers
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer accounts and information
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4">
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              Register New Customer
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search customers..."
          />
        </div>

        {/* Customers Table */}
        <DataTable
          data={filteredCustomers}
          columns={columns}
          loading={loading}
          actions={false}
          emptyMessage="No customers found"
        />

        {/* Register Customer Modal */}
        <FormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Register New Customer"
          onSubmit={handleRegisterCustomer}
          fields={customerFormFields}
          submitText="Register Customer"
        />
      </div>
    </Layout>
  );
};

export default CustomersPage;