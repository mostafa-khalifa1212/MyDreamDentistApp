import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

// Payment status options
const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' }
];

// Payment method options
const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' }
];

// Status options
const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no-show', label: 'No Show' }
];

// Color options for appointments
const COLOR_OPTIONS = [
  { value: '#4287f5', label: 'Blue', className: 'bg-blue-500' },
  { value: '#42f5aa', label: 'Green', className: 'bg-green-500' },
  { value: '#f54242', label: 'Red', className: 'bg-red-500' },
  { value: '#f5d442', label: 'Yellow', className: 'bg-yellow-500' },
  { value: '#f542cb', label: 'Pink', className: 'bg-pink-500' },
  { value: '#42f5f2', label: 'Cyan', className: 'bg-cyan-500' },
  { value: '#8e42f5', label: 'Purple', className: 'bg-purple-500' },
  { value: '#f58e42', label: 'Orange', className: 'bg-orange-500' }
];

// Validate Egyptian, Saudi, or UAE phone number
const validatePhoneNumber = (phoneNumber) => {
  // Regex for Egyptian (+20), Saudi (+966), and UAE (+971) numbers
  return /^(\+20|00201)[0-9]{9}$|^(\+966|00966)[0-9]{9}$|^(\+971|00971)[0-9]{9}$/.test(phoneNumber);
};

const AppointmentForm = ({ 
  appointment, 
  onSave, 
  onDelete, 
  onClose,
  timezone = 'Africa/Cairo'
}) => {
  // Default form data
  const defaultFormData = {
    patientName: '',
    patientPhone: '',
    procedure: '',
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 30 * 60 * 1000), // Default 30 min
    notes: '',
    status: 'scheduled',
    colorCode: '#4287f5',
    payment: {
      amount: 0,
      status: 'pending',
      method: 'cash',
      notes: ''
    }
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with appointment data if editing
  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment.patientName || '',
        patientPhone: appointment.patientPhone || '',
        procedure: appointment.procedure || '',
        startTime: new Date(appointment.startTime),
        endTime: new Date(appointment.endTime),
        notes: appointment.notes || '',
        status: appointment.status || 'scheduled',
        colorCode: appointment.colorCode || '#4287f5',
        payment: {
          amount: appointment.payment?.amount || 0,
          status: appointment.payment?.status || 'pending',
          method: appointment.payment?.method || 'cash',
          notes: appointment.payment?.notes || ''
        }
      });
    }
  }, [appointment]);
  
  // Form validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    
    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = 'Patient phone is required';
    } else if (!validatePhoneNumber(formData.patientPhone)) {
      newErrors.patientPhone = 'Invalid phone format for Egypt, Saudi Arabia, or UAE';
    }
    
    if (!formData.procedure.trim()) {
      newErrors.procedure = 'Procedure is required';
    }
    
    if (formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    if (formData.payment.amount < 0) {
      newErrors.paymentAmount = 'Amount cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('payment.')) {
      const paymentField = name.split('.')[1];
      setFormData({
        ...formData,
        payment: {
          ...formData.payment,
          [paymentField]: paymentField === 'amount' ? parseFloat(value) || 0 : value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for the field
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };
  
  // Time change handlers
  const handleTimeChange = (e, field) => {
    const { value } = e.target;
    const [hours, minutes] = value.split(':').map(Number);
    
    const newTime = new Date(formData[field]);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    
    setFormData({ ...formData, [field]: newTime });
    
    // Clear error for the field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert dates to proper format with timezone
      const appointmentData = {
        ...formData,
        timezone
      };
      
      onSave(appointmentData);
      toast.success(appointment ? 'Appointment updated' : 'Appointment created');
    } catch (error) {
      toast.error(error.message || 'Error saving appointment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle appointment deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      onDelete();
      toast.success('Appointment deleted');
    }
  };
  
  // Format time for input
  const formatTimeForInput = (date) => {
    return moment(date).format('HH:mm');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#201A23] mb-4">
          {appointment ? 'Edit Appointment' : 'New Appointment'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-[#8E7C93] mb-2">
                Patient Information
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Patient Name
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.patientName ? 'border-red-500' : 'border-[#C5BAC9]'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
              />
              {errors.patientName && (
                <p className="mt-1 text-sm text-red-500">{errors.patientName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Patient Phone
              </label>
              <input
                type="text"
                name="patientPhone"
                value={formData.patientPhone}
                onChange={handleChange}
                placeholder="+20xxxxxxxxx"
                className={`w-full px-3 py-2 border ${
                  errors.patientPhone ? 'border-red-500' : 'border-[#C5BAC9]'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
              />
              {errors.patientPhone && (
                <p className="mt-1 text-sm text-red-500">{errors.patientPhone}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Procedure
              </label>
              <input
                type="text"
                name="procedure"
                value={formData.procedure}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.procedure ? 'border-red-500' : 'border-[#C5BAC9]'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
              />
              {errors.procedure && (
                <p className="mt-1 text-sm text-red-500">{errors.procedure}</p>
              )}
            </div>
            
            {/* Appointment Details */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-[#8E7C93] mb-2">
                Appointment Details
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formatTimeForInput(formData.startTime)}
                onChange={(e) => handleTimeChange(e, 'startTime')}
                className="w-full px-3 py-2 border border-[#C5BAC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formatTimeForInput(formData.endTime)}
                onChange={(e) => handleTimeChange(e, 'endTime')}
                className={`w-full px-3 py-2 border ${
                  errors.endTime ? 'border-red-500' : 'border-[#C5BAC9]'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#C5BAC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Color
              </label>
              <div className="flex space-x-2">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, colorCode: color.value })}
                    className={`w-8 h-8 rounded-full ${color.className} ${
                      formData.colorCode === color.value ? 'ring-2 ring-offset-2 ring-gray-800' : ''
                    }`}
                    aria-label={`Select ${color.label} color`}
                  />
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-[#C5BAC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]"
              />
            </div>
            
            {/* Payment Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-[#8E7C93] mb-2">
                Payment Information
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Amount
              </label>
              <input
                type="number"
                name="payment.amount"
                value={formData.payment.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border ${
                  errors.paymentAmount ? 'border-red-500' : 'border-[#C5BAC9]'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
              />
              {errors.paymentAmount && (
                <p className="mt-1 text-sm text-red-500">{errors.paymentAmount}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Payment Status
              </label>
              <select
                name="payment.status"
                value={formData.payment.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#C5BAC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]"
              >
                {PAYMENT_STATUS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Payment Method
              </label>
              <select
                name="payment.method"
                value={formData.payment.method}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#C5BAC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]"
              >
                {PAYMENT_METHODS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#201A23] mb-1">
                Payment Notes
              </label>
              <input
                type="text"
                name="payment.notes"
                value={formData.payment.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#C5BAC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]"
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            {appointment && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                disabled={isSubmitting}
              >
                Delete
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-[#8E7C93] text-white rounded-md hover:bg-[#201A23] transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (appointment ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;