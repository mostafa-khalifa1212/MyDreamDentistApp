// client/src/pages/Financials.js
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { financialAPI, appointmentsAPI } from '../services/api';
import Spinner from '../components/common/Spinner';

const Financials = () => {
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState({
    appointments: [],
    dailySummary: {
      totalPayments: 0,
      totalRefunds: 0,
      totalAdjustments: 0,
      netIncome: 0,
      paymentMethodBreakdown: {
        cash: 0,
        card: 0,
        insurance: 0,
        other: 0
      }
    },
    transactions: []
  });
  
  const [newPayment, setNewPayment] = useState({
    appointmentId: '',
    patientName: '',
    amount: 0,
    type: 'payment',
    paymentMethod: 'cash',
    notes: ''
  });
  
  // Get user's timezone or default to Cairo
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';
  
  // Format date for display
  const formatDate = (date) => moment(date).format('YYYY-MM-DD');
  
  // Format time for display
  const formatTime = (time) => moment(time).format('h:mm A');
  
  // Load financial data for the selected date
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        
        // Format date for API
        const dateStr = formatDate(selectedDate);
        
        // Fetch daily financial summary
        const dailySummaryResponse = await financialAPI.getDailySummary(dateStr, timezone);
        
        // Fetch appointments for the day
        const startDate = moment(selectedDate).startOf('day').toISOString();
        const endDate = moment(selectedDate).endOf('day').toISOString();
        const appointmentsResponse = await appointmentsAPI.getAppointments(startDate, endDate, timezone);
        
        setFinancialData({
          appointments: appointmentsResponse.data || [],
          dailySummary: {
            totalPayments: dailySummaryResponse.totalPayments || 0,
            totalRefunds: dailySummaryResponse.totalRefunds || 0,
            totalAdjustments: dailySummaryResponse.totalAdjustments || 0,
            netIncome: dailySummaryResponse.netIncome || 0,
            paymentMethodBreakdown: dailySummaryResponse.paymentMethodBreakdown || {
              cash: 0,
              card: 0,
              insurance: 0,
              other: 0
            }
          },
          transactions: dailySummaryResponse.transactions || []
        });
        
        setError(null);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setError('Failed to load financial data. Please try again.');
        toast.error('Error loading financial data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFinancialData();
  }, [selectedDate, timezone]);
  
  // Handle date change
  const handleDateChange = (direction) => {
    const newDate = moment(selectedDate).add(direction, 'days').toDate();
    setSelectedDate(newDate);
  };
  
  // Handle payment form changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Handle appointment selection for payment
  const handleAppointmentSelect = (appointmentId) => {
    const appointment = financialData.appointments.find(a => a._id === appointmentId);
    
    if (appointment) {
      setNewPayment(prev => ({
        ...prev,
        appointmentId,
        patientName: appointment.patientName
      }));
    }
  };
  
  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPayment.patientName || newPayment.amount <= 0) {
      toast.error('Please provide a patient name and a valid amount');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create transaction
      await financialAPI.createTransaction({
        ...newPayment,
        date: moment(selectedDate).toISOString(),
        timezone
      });
      
      toast.success('Payment recorded successfully');
      
      // Refresh data
      const dateStr = formatDate(selectedDate);
      const dailySummaryResponse = await financialAPI.getDailySummary(dateStr, timezone);
      
      // Fetch appointments for the day to update status
      const startDate = moment(selectedDate).startOf('day').toISOString();
      const endDate = moment(selectedDate).endOf('day').toISOString();
      const appointmentsResponse = await appointmentsAPI.getAppointments(startDate, endDate, timezone);
      
      setFinancialData({
        appointments: appointmentsResponse.data || [],
        dailySummary: {
          totalPayments: dailySummaryResponse.totalPayments || 0,
          totalRefunds: dailySummaryResponse.totalRefunds || 0,
          totalAdjustments: dailySummaryResponse.totalAdjustments || 0,
          netIncome: dailySummaryResponse.netIncome || 0,
          paymentMethodBreakdown: dailySummaryResponse.paymentMethodBreakdown || {
            cash: 0,
            card: 0,
            insurance: 0,
            other: 0
          }
        },
        transactions: dailySummaryResponse.transactions || []
      });
      
      // Reset form
      setNewPayment({
        appointmentId: '',
        patientName: '',
        amount: 0,
        type: 'payment',
        paymentMethod: 'cash',
        notes: ''
      });
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };
  
  // Get payment status badge
  const PaymentBadge = ({ status }) => {
    let badgeClass = '';
    
    switch (status) {
      case 'paid':
        badgeClass = 'bg-green-100 text-green-800';
        break;
      case 'partial':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        break;
      default:
        badgeClass = 'bg-red-100 text-red-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {status}
      </span>
    );
  };
  
  // Get transaction type badge
  const TransactionBadge = ({ type }) => {
    let badgeClass = '';
    
    switch (type) {
      case 'payment':
        badgeClass = 'bg-green-100 text-green-800';
        break;
      case 'refund':
        badgeClass = 'bg-red-100 text-red-800';
        break;
      case 'adjustment':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {type}
      </span>
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <p className="mt-1 text-[#8E7C93]">
          Track payments and financial performance
        </p>
      </div>
      
      {/* Date navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => handleDateChange(-1)}
          className="flex items-center px-3 py-2 bg-white rounded-md shadow-sm dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Previous Day
        </button>
        
        <h2 className="text-xl font-semibold">
          {moment(selectedDate).format('dddd, MMMM D, YYYY')}
        </h2>
        
        <button
          onClick={() => handleDateChange(1)}
          className="flex items-center px-3 py-2 bg-white rounded-md shadow-sm dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Next Day
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Financial summary box */}
      <div className="bg-green-50 rounded-lg shadow-md p-4 mb-6 sticky top-4 right-4 w-auto lg:w-64 lg:absolute lg:z-10 dark:bg-green-900/20">
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
          Daily Summary
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-green-600 dark:text-green-400">Payments:</span>
            <span className="font-medium text-green-700 dark:text-green-300">
              ${financialData.dailySummary.totalPayments.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-green-600 dark:text-green-400">Refunds:</span>
            <span className="font-medium text-red-500 dark:text-red-300">
              -${financialData.dailySummary.totalRefunds.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-green-600 dark:text-green-400">Adjustments:</span>
            <span className="font-medium text-yellow-600 dark:text-yellow-300">
              ${financialData.dailySummary.totalAdjustments.toFixed(2)}
            </span>
          </div>
          
          <div className="border-t border-green-200 dark:border-green-700 my-2"></div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Net Income:</span>
            <span className="font-bold text-lg text-green-700 dark:text-green-300">
              ${financialData.dailySummary.netIncome.toFixed(2)}
            </span>
          </div>
          
          <div className="border-t border-green-200 dark:border-green-700 my-2"></div>
          
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
            Payment Methods:
          </h4>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs text-green-600 dark:text-green-400">Cash:</span>
            </div>
            <span className="text-xs text-right text-green-700 dark:text-green-300">
              ${financialData.dailySummary.paymentMethodBreakdown.cash.toFixed(2)}
            </span>
            
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-xs text-green-600 dark:text-green-400">Card:</span>
            </div>
            <span className="text-xs text-right text-green-700 dark:text-green-300">
              ${financialData.dailySummary.paymentMethodBreakdown.card.toFixed(2)}
            </span>
            
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-xs text-green-600 dark:text-green-400">Insurance:</span>
            </div>
            <span className="text-xs text-right text-green-700 dark:text-green-300">
              ${financialData.dailySummary.paymentMethodBreakdown.insurance.toFixed(2)}
            </span>
            
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <span className="text-xs text-green-600 dark:text-green-400">Other:</span>
            </div>
            <span className="text-xs text-right text-green-700 dark:text-green-300">
              ${financialData.dailySummary.paymentMethodBreakdown.other.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="lg:mr-72">
        {/* Record payment form */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-4">Record Payment</h3>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Appointment
                </label>
                <select
                  name="appointmentId"
                  value={newPayment.appointmentId}
                  onChange={(e) => {
                    handleAppointmentSelect(e.target.value);
                    handlePaymentChange(e);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8E7C93] focus:border-[#8E7C93] dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">-- Select appointment --</option>
                  {financialData.appointments.map(appointment => (
                    <option key={appointment._id} value={appointment._id}>
                      {formatTime(appointment.startTime)} - {appointment.patientName} ({appointment.procedure})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={newPayment.patientName}
                  onChange={handlePaymentChange}
                  placeholder="Enter patient name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8E7C93] focus:border-[#8E7C93] dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newPayment.amount}
                  onChange={handlePaymentChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8E7C93] focus:border-[#8E7C93] dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={newPayment.type}
                  onChange={handlePaymentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8E7C93] focus:border-[#8E7C93] dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="payment">Payment</option>
                  <option value="refund">Refund</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={newPayment.paymentMethod}
                  onChange={handlePaymentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8E7C93] focus:border-[#8E7C93] dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={newPayment.notes}
                  onChange={handlePaymentChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8E7C93] focus:border-[#8E7C93] dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Optional notes"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#8E7C93] text-white rounded-md hover:bg-[#201A23] transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Appointments table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 dark:bg-gray-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium">Today's Appointments</h3>
          </div>
          
          {loading ? (
            <div className="p-6 flex justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : financialData.appointments.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No appointments scheduled for this day.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Procedure
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {financialData.appointments
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                    .map((appointment) => (
                      <tr 
                        key={appointment._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => handleAppointmentSelect(appointment._id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">
                            {formatTime(appointment.startTime)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(appointment.endTime)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">
                            {appointment.patientName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.patientPhone}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs truncate">
                            {appointment.procedure}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <PaymentBadge status={appointment.payment?.status || 'pending'} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-lg font-medium">
                            ${(appointment.payment?.amount || 0).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.payment?.method || 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Transactions table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium">Transaction History</h3>
          </div>
          
          {loading ? (
            <div className="p-6 flex justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : financialData.transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No transactions recorded for this day.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {financialData.transactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((transaction) => (
                      <tr 
                        key={transaction._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatTime(transaction.date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {transaction.patientName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <TransactionBadge type={transaction.type} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="capitalize">
                            {transaction.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`font-medium ${
                            transaction.type === 'refund' 
                              ? 'text-red-500' 
                              : transaction.type === 'adjustment' 
                                ? 'text-yellow-500' 
                                : 'text-green-500'
                          }`}>
                            {transaction.type === 'refund' ? '-' : ''}
                            ${transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs truncate">
                            {transaction.notes || '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financials;