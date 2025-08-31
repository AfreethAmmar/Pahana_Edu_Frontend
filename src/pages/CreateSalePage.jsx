import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import ProductSelector from '../components/ui/ProductSelector';
import salesService from '../services/salesService';
import { PAYMENT_METHODS, FORM_VALIDATION } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

const CreateSalePage = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      customerName: '',
      customerId: '',
      paymentMethod: 'CASH',
      discount: '0',
      notes: ''
    }
  });

  const watchedDiscount = watch('discount', '0');

  const calculateSubtotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0);
  };

  const calculateFinalAmount = () => {
    const subtotal = calculateSubtotal();
    const discount = parseFloat(watchedDiscount) || 0;
    return Math.max(0, subtotal - discount);
  };

  const onSubmit = async (formData) => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    setCreating(true);
    try {
      const itemsString = salesService.formatItemsForApi(selectedItems);
      
      const saleData = {
        customerName: formData.customerName,
        customerId: formData.customerId || null,
        items: itemsString,
        paymentMethod: formData.paymentMethod,
        discount: formData.discount || '0.00',
        notes: formData.notes
      };

      const result = await salesService.createSale(saleData);
      
      if (result.success) {
        toast.success(`Sale created successfully! Sale #${result.data.saleNumber}`);
        navigate(`/sales/${result.data.saleId}`);
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error('Failed to create sale');
    } finally {
      setCreating(false);
    }
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    const subtotal = calculateSubtotal();
    
    if (parseFloat(value) > subtotal) {
      toast.error('Discount cannot exceed subtotal amount');
      setValue('discount', subtotal.toString());
    }
  };

  const paymentMethodOptions = Object.values(PAYMENT_METHODS).map(method => ({
    value: method,
    label: method
  }));

  const subtotal = calculateSubtotal();
  const finalAmount = calculateFinalAmount();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Sale</h1>
          <p className="text-gray-600 mt-1">Add products and customer information to create a sale</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/sales')}
        >
          ← Back to Sales
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Products */}
          <div className="lg:col-span-2">
            <ProductSelector
              selectedItems={selectedItems}
              onItemsChange={setSelectedItems}
              disabled={creating}
            />
          </div>

          {/* Right Column - Customer & Payment Details */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
              <div className="space-y-4">
                <Input
                  label="Customer Name"
                  placeholder="Enter customer name"
                  error={errors.customerName?.message}
                  disabled={creating}
                  {...register('customerName', {
                    required: FORM_VALIDATION.REQUIRED
                  })}
                />
                
                <Input
                  label="Customer ID (Optional)"
                  placeholder="e.g., CUST001"
                  error={errors.customerId?.message}
                  disabled={creating}
                  {...register('customerId')}
                />
              </div>
            </Card>

            {/* Payment Details */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
              <div className="space-y-4">
                <Select
                  label="Payment Method"
                  options={paymentMethodOptions}
                  error={errors.paymentMethod?.message}
                  disabled={creating}
                  {...register('paymentMethod')}
                />

                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={subtotal}
                  label="Discount Amount"
                  placeholder="0.00"
                  error={errors.discount?.message}
                  disabled={creating}
                  {...register('discount', {
                    validate: (value) => {
                      const discount = parseFloat(value) || 0;
                      if (discount < 0) return 'Discount cannot be negative';
                      if (discount > subtotal) return 'Discount cannot exceed subtotal';
                      return true;
                    }
                  })}
                  onChange={handleDiscountChange}
                />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  {parseFloat(watchedDiscount) > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(parseFloat(watchedDiscount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(finalAmount)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Notes */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add any additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={creating}
                    {...register('notes')}
                  />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={creating || selectedItems.length === 0 || subtotal === 0}
                  loading={creating}
                >
                  {creating ? 'Creating Sale...' : `Complete Sale - ${formatCurrency(finalAmount)}`}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedItems([]);
                    setValue('customerName', '');
                    setValue('customerId', '');
                    setValue('discount', '0');
                    setValue('notes', '');
                  }}
                  disabled={creating}
                >
                  Clear All
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSalePage;