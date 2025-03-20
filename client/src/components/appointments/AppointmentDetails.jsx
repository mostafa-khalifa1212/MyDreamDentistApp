import React from 'react';
import { format } from 'date-fns';
import { useApp } from '../../App';

const AppointmentDetails = ({ appointment, onEdit, onDelete, canEdit = false }) => {
  const { user } = useApp();
  
  if (!appointment) {
    return <div>No appointment data available</div>;
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy h:mm a');
  };
  
  const getDuration = () => {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    const diffInMinutes = Math.round((end - start) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`;
    }
  };
  
  const getStatusBadgeClass = () => {
    switch (appointment.status) {
      case 'confirmed':
        return 'bg-success';
      case 'scheduled':
        return 'bg-primary';
      case 'completed':
        return 'bg-info';
      case 'cancelled':
        return 'bg-danger';
      case 'no-show':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };
  
  const getPaymentStatusBadgeClass = () => {
    switch (appointment.payment?.status) {
      case 'paid':
        return 'bg-success';
      case 'partial':
        return 'bg-warning text-dark';
      case 'pending':
      default:
        return 'bg-danger';
    }
  };
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getAppointmentTypeLabel = (type) => {
    const types = {
      'checkup': 'Check-up',
      'cleaning': 'Cleaning',
      'filling': 'Filling',
      'extraction': 'Extraction',
      'root-canal': 'Root Canal',
      'crown': 'Crown',
      'consultation': 'Consultation',
      'other': 'Other'
    };
    return types[type] || type;
  };
  
  return (
    <div className="appointment-details">
      <div className="row mb-4">
        <div className="col-md-6">
          <h5 className="mb-3">Patient Information</h5>
          <p>
            <strong>Name:</strong> {appointment.patient?.user?.name || 'N/A'}
          </p>
          <p>
            <strong>Contact:</strong> {appointment.patient?.contactNumber || 'N/A'}
          </p>
        </div>
        
        <div className="col-md-6">
          <h5 className="mb-3">Appointment Information</h5>
          <p>
            <strong>Dentist:</strong> Dr. {appointment.dentist?.name || 'N/A'}
          </p>
          <p>
            <strong>Type:</strong> {getAppointmentTypeLabel(appointment.type)}
          </p>
          <p>
            <strong>Status:</strong> <span className={`badge ${getStatusBadgeClass()}`}>{appointment.status}</span>
          </p>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-12">
          <h5 className="mb-3">Schedule Details</h5>
          <div className="row">
            <div className="col-md-4">
              <p>
                <strong>Start Time:</strong><br />
                {formatDate(appointment.startTime)}
              </p>
            </div>
            <div className="col-md-4">
              <p>
                <strong>End Time:</strong><br />
                {formatDate(appointment.endTime)}
              </p>
            </div>
            <div className="col-md-4">
              <p>
                <strong>Duration:</strong><br />
                {getDuration()}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-12">
          <h5 className="mb-3">Payment Information</h5>
          <div className="row">
            <div className="col-md-4">
              <p>
                <strong>Amount:</strong><br />
                {formatAmount(appointment.payment?.amount || 0)}
              </p>
            </div>
            <div className="col-md-4">
              <p>
                <strong>Status:</strong><br />
                <span className={`badge ${getPaymentStatusBadgeClass()}`}>{appointment.payment?.status || 'pending'}</span>
              </p>
            </div>
            <div className="col-md-4">
              <p>
                <strong>Method:</strong><br />
                {appointment.payment?.method || 'N/A'}
              </p>
            </div>
          </div>
          
          {appointment.payment?.notes && (
            <div className="row mt-2">
              <div className="col-md-12">
                <p>
                  <strong>Payment Notes:</strong><br />
                  {appointment.payment.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {appointment.notes && (
        <div className="row mb-4">
          <div className="col-md-12">
            <h5 className="mb-3">Notes</h5>
            <div className="card">
              <div className="card-body">
                {appointment.notes}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-end mt-3">
            {canEdit && (
              <>
                <button 
                  className="btn btn-primary me-2" 
                  onClick={onEdit}
                >
                  <i className="fas fa-edit me-1"></i> Edit
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={onDelete}
                >
                  <i className="fas fa-trash-alt me-1"></i> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;