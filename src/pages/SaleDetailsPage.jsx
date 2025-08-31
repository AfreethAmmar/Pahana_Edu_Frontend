import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';
// import Select from '../components/ui/Select'; // Not used in this component
import salesService from '../services/salesService';
import { SALE_STATUS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/helpers';

const SaleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadSaleDetails();
    }
  }, [id]);

  const loadSaleDetails = async () => {
    setLoading(true);
    try {
      const result = await salesService.getSaleById(id);
      if (result.success) {
        setSale(result.data);
      } else {
        toast.error(result.error.message);
        navigate('/sales');
      }
    } catch (error) {
      toast.error('Failed to load sale details');
      navigate('/sales');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const result = await salesService.updateSaleStatus(id, newStatus);
      if (result.success) {
        toast.success('Sale status updated successfully');
        setSale(prev => ({ ...prev, saleStatus: newStatus }));
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error('Failed to update sale status');
    } finally {
      setUpdating(false);
    }
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    const receiptHTML = generateReceiptHTML();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${sale.saleNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .line { border-bottom: 1px dashed #ccc; margin: 10px 0; }
            .total { font-weight: bold; font-size: 1.2em; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 5px 0; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          ${receiptHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const generateReceiptHTML = () => {
    if (!sale) return '';

    return `
      <div class="receipt">
        <div class="header">
          <h2>Pahana Bookshop</h2>
          <p>Receipt</p>
        </div>
        
        <div class="line"></div>
        
        <table>
          <tr>
            <td><strong>Sale #:</strong></td>
            <td class="text-right">${sale.saleNumber}</td>
          </tr>
          <tr>
            <td><strong>Date:</strong></td>
            <td class="text-right">${formatDate(sale.saleDate)}</td>
          </tr>
          <tr>
            <td><strong>Customer:</strong></td>
            <td class="text-right">${sale.customerName}</td>
          </tr>
          <tr>
            <td><strong>Cashier:</strong></td>
            <td class="text-right">${sale.soldByName}</td>
          </tr>
        </table>
        
        <div class="line"></div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${sale.items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${formatCurrency(item.unitPrice)}</td>
                <td class="text-right">${formatCurrency(item.subTotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="line"></div>
        
        <table>
          <tr>
            <td><strong>Subtotal:</strong></td>
            <td class="text-right"><strong>${formatCurrency(sale.totalAmount)}</strong></td>
          </tr>
          ${sale.discount > 0 ? `
          <tr>
            <td><strong>Discount:</strong></td>
            <td class="text-right"><strong>-${formatCurrency(sale.discount)}</strong></td>
          </tr>
          ` : ''}
          <tr class="total">
            <td><strong>Total:</strong></td>
            <td class="text-right"><strong>${formatCurrency(sale.finalAmount)}</strong></td>
          </tr>
          <tr>
            <td><strong>Payment:</strong></td>
            <td class="text-right"><strong>${sale.paymentMethod}</strong></td>
          </tr>
        </table>
        
        <div class="line"></div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p>Thank you for your business!</p>
          <p style="font-size: 0.8em;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
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

  const getAvailableStatusOptions = (currentStatus) => {
    const allStatuses = Object.values(SALE_STATUS).map(status => ({
      value: status,
      label: status
    }));

    // Filter based on current status
    switch (currentStatus) {
      case 'PENDING':
        return allStatuses.filter(s => ['COMPLETED', 'CANCELLED'].includes(s.value));
      case 'COMPLETED':
        return allStatuses.filter(s => ['REFUNDED'].includes(s.value));
      default:
        return [];
    }
  };

  if (loading) return <Loading />;
  if (!sale) return <div className="p-6">Sale not found</div>;

  const statusOptions = getAvailableStatusOptions(sale.saleStatus);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sale Details</h1>
          <p className="text-gray-600 mt-1">View complete sale information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={printReceipt}
            disabled={updating}
          >
            🖨️ Print Receipt
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/sales')}
          >
            ← Back to Sales
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sale Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sale Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Sale Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Sale Number</label>
                <p className="text-lg font-mono">{sale.saleNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date & Time</label>
                <p className="text-lg">{formatDate(sale.saleDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Customer</label>
                <p className="text-lg">{sale.customerName}</p>
                {sale.customerId && (
                  <p className="text-sm text-gray-500">ID: {sale.customerId}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Cashier</label>
                <p className="text-lg">{sale.soldByName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Method</label>
                <p className="text-lg">
                  <Badge variant="outline">{sale.paymentMethod}</Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-lg">
                  <Badge variant={getStatusBadgeVariant(sale.saleStatus)}>
                    {sale.saleStatus}
                  </Badge>
                </p>
              </div>
            </div>

            {sale.notes && (
              <div className="mt-4 pt-4 border-t">
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <p className="text-gray-800 mt-1">{sale.notes}</p>
              </div>
            )}
          </Card>

          {/* Items */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Items ({sale.itemsCount})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" size="sm">{item.productCode}</Badge>
                            <Badge 
                              variant={item.productCategory === 'BOOK' ? 'primary' : 'secondary'} 
                              size="sm"
                            >
                              {item.productCategory}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-medium">{item.quantity}</td>
                      <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(item.subTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column - Status & Totals */}
        <div className="space-y-6">
          {/* Status Management */}
          {statusOptions.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Current Status
                  </label>
                  <Badge variant={getStatusBadgeVariant(sale.saleStatus)} size="lg">
                    {sale.saleStatus}
                  </Badge>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Change Status To
                  </label>
                  <div className="space-y-2">
                    {statusOptions.map(option => (
                      <Button
                        key={option.value}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleStatusUpdate(option.value)}
                        disabled={updating}
                        loading={updating}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Payment Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(sale.totalAmount)}</span>
              </div>
              
              {sale.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span className="font-medium">-{formatCurrency(sale.discount)}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(sale.finalAmount)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Method:</span>
                <span className="font-medium">{sale.paymentMethod}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={printReceipt}
              >
                🖨️ Print Receipt
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/sales/create')}
              >
                + Create New Sale
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/sales/customer/${sale.customerId || 'none'}`)}
                disabled={!sale.customerId}
              >
                👤 View Customer Sales
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsPage;