import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SketchPicker } from 'react-color';

const AppointmentForm = ({ onSubmit, initialData, mode = 'create' }) => {
  const { isAuthenticated, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    patient: '',
    dentist: user?.role === 'dentist' ? user?.id : '',
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 30 * 60000), // Default 30 min appointment
    type: 'checkup',
    notes: '',
    status: 'scheduled',
    colorCode: '#4287f5', // Default blue
    payment: {
      amount: 0,
      status: 'pending',
      method: 'cash',
      notes: ''
    }
  });

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startTime: new Date(initialData.startTime),
        endTime: new Date(initialData.endTime),
        patient: initialData.patient._id || initialData.patient,
        dentist: initialData.dentist._id || initialData.dentist
      });
    }
  }, [initialData]);

  // Fetch patients and dentists on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Fetch patients
        const patientsResponse = await fetch('/api/patients', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!patientsResponse.ok) {
          throw new Error('Failed to fetch patients');
        }
        
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
        
        // Fetch dentists (users with dentist role)
        const dentistsResponse = await fetch('/api/users?role=dentist', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!dentistsResponse.ok) {
          throw new Error('Failed to fetch dentists');
        }
        
        const dentistsData = await dentistsResponse.json();
        setDentists(dentistsData);
        
        // Set default dentist if user is a dentist
        if (user?.role === 'dentist' && !initialData) {
          setFormData(prev => ({
            ...prev,
            dentist: user.id
          }));
        }
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('payment.')) {
      const paymentField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          [paymentField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStartTimeChange = (date) => {
    // Update start time and automatically adjust end time to maintain duration
    const currentDuration = formData.endTime - formData.startTime;
    const newEndTime = new Date(date.getTime() + currentDuration);
    
    setFormData(prev => ({
      ...prev,
      startTime: date,
      endTime: newEndTime
    }));
  };

  const handleEndTimeChange = (date) => {
    if (date <= formData.startTime) {
      setMessage({ type: 'error', text: 'End time must be after start time' });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      endTime: date
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      colorCode: color.hex
    }));
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const diff = formData.endTime.getTime() - formData.startTime.getTime();
    return Math.round(diff / (60 * 1000)); // Convert ms to minutes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Validate times
      if (formData.endTime <= formData.startTime) {
        throw new Error('End time must be after start time');
      }
      
      // Prepare data for submission
      const appointmentData = {
        ...formData,
        // Ensure the createdBy field is set if this is a new appointment
        ...(mode === 'create' && { createdBy: user.id })
      };
      
      // Call the onSubmit handler passed from parent
      await onSubmit(appointmentData);
      
      // Reset form if creating new appointment
      if (mode === 'create') {
        setFormData({
          patient: '',
          dentist: user?.role === 'dentist' ? user?.id : '',
          startTime: new Date(),
          endTime: new Date(new Date().getTime() + 30 * 60000),
          type: 'checkup',
          notes: '',
          status: 'scheduled',
          colorCode: '#4287f5',
          payment: {
            amount: 0,
            status: 'pending',
            method: 'cash',
            notes: ''
          }
        });
      }
      
      setMessage({ type: 'success', text: `Appointment ${mode === 'create' ? 'created' : 'updated'} successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="alert alert-danger">Please log in to access this feature</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4>{mode === 'create' ? 'Schedule New Appointment' : 'Edit Appointment'}</h4>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="patient">Patient*</label>
                <select
                  className="form-select"
                  id="patient"
                  name="patient"
                  value={formData.patient}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.user?.name || 'Unknown'} ({patient.contactNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="dentist">Dentist*</label>
                <select
                  className="form-select"
                  id="dentist"
                  name="dentist"
                  value={formData.dentist}
                  onChange={handleInputChange}
                  required
                  disabled={loading || user?.role === 'dentist'}
                >
                  <option value="">Select Dentist</option>
                  {dentists.map(dentist => (
                    <option key={dentist._id} value={dentist._id}>
                      Dr. {dentist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="startTime">Start Time*</label>
                <DatePicker
                  selected={formData.startTime}
                  onChange={handleStartTimeChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="form-control"
                  minDate={new Date()}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="endTime">End Time*</label>
                <DatePicker
                  selected={formData.endTime}
                  onChange={handleEndTimeChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="form-control"
                  minDate={formData.startTime || new Date()}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-group">
                <label>Duration</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={`${calculateDuration()} minutes`}
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="type">Appointment Type*</label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="checkup">Check-up</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="filling">Filling</option>
                  <option value="extraction">Extraction</option>
                  <option value="root-canal">Root Canal</option>
                  <option value="crown">Crown</option>
                  <option value="consultation">Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="colorCode">Color Code</label>
                <div className="input-group">
                  <div 
                    className="color-preview" 
                    style={{
                      backgroundColor: formData.colorCode,
                      width: '40px',
                      height: '38px',
                      marginRight: '10px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={formData.colorCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                {showColorPicker && (
                  <div style={{ position: 'absolute', zIndex: 2 }}>
                    <div 
                      style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
                      onClick={() => setShowColorPicker(false)}
                    />
                    <SketchPicker 
                      color={formData.colorCode}
                      onChange={handleColorChange}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="payment.amount">Payment Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    id="payment.amount"
                    name="payment.amount"
                    value={formData.payment.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="payment.status">Payment Status</label>
                <select
                  className="form-select"
                  id="payment.status"
                  name="payment.status"
                  value={formData.payment.status}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="payment.method">Payment Method</label>
                <select
                  className="form-select"
                  id="payment.method"
                  name="payment.method"
                  value={formData.payment.method}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group mb-3">
            <label htmlFor="payment.notes">Payment Notes</label>
            <textarea
              className="form-control"
              id="payment.notes"
              name="payment.notes"
              value={formData.payment.notes}
              onChange={handleInputChange}
              disabled={loading}
              rows="2"
            />
          </div>
          
          <div className="form-group mb-3">
            <label htmlFor="notes">Appointment Notes</label>
            <textarea
              className="form-control"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={loading}
              rows="3"
            />
          </div>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="ms-2">Processing...</span>
                </>
              ) : (
                mode === 'create' ? 'Schedule Appointment' : 'Update Appointment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;