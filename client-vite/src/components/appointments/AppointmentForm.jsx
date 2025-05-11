import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SketchPicker } from 'react-color';
import { useAuth } from '../../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AppointmentForm = ({ onSubmit, initialData, mode = 'create' }) => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [lastVisit, setLastVisit] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    treatments: [],
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 30 * 60000), // Default 30 min appointment
    notes: '',
    status: 'pending',
    colorCode: '#4287f5', // Default blue
    payment: {
      total: 0,
      amountPaid: 0,
      amountRemaining: 0,
      status: 'pending',
      method: 'cash',
      notes: ''
    }
  });

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        startTime: new Date(initialData.startTime),
        endTime: new Date(initialData.endTime),
        treatments: initialData.treatments || [],
      });
    }
    // eslint-disable-next-line
  }, [initialData]);

  // Fetch patients and treatments on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        // Fetch patients
        const patientsResponse = await fetch(`${API_URL}/patients`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!patientsResponse.ok) throw new Error('Failed to fetch patients');
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
        // Fetch treatments
        const treatmentsResponse = await fetch(`${API_URL}/treatments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!treatmentsResponse.ok) throw new Error('Failed to fetch treatments');
        const treatmentsData = await treatmentsResponse.json();
        setTreatments(treatmentsData.data || []);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  // Fetch last clinic visit when patientName changes
  useEffect(() => {
    const fetchLastVisit = async () => {
      if (!formData.patientName) {
        setLastVisit('');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/appointments/last-visit/${encodeURIComponent(formData.patientName)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setLastVisit(data.lastVisit);
      } catch {
        setLastVisit('');
      }
    };
    fetchLastVisit();
  }, [formData.patientName]);

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

  const handleTreatmentsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      treatments: selected
    }));
    // Dynamically calculate total cost
    const total = treatments.filter(t => selected.includes(t._id)).reduce((sum, t) => sum + (t.cost || 0), 0);
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        total,
        amountRemaining: total - (prev.payment.amountPaid || 0)
      }
    }));
  };

  const handleAmountPaidChange = (e) => {
    const amountPaid = Number(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        amountPaid,
        amountRemaining: (prev.payment.total || 0) - amountPaid
      }
    }));
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
        treatments: formData.treatments,
        payment: formData.payment
      };
      
      // Call the onSubmit handler passed from parent
      await onSubmit(appointmentData);
      
      // Reset form if creating new appointment
      if (mode === 'create') {
        setFormData({
          patientName: '',
          patientPhone: '',
          treatments: [],
          startTime: new Date(),
          endTime: new Date(new Date().getTime() + 30 * 60000),
          notes: '',
          status: 'pending',
          colorCode: '#4287f5',
          payment: {
            total: 0,
            amountPaid: 0,
            amountRemaining: 0,
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
                <label htmlFor="patientName">Patient Name*</label>
                <input
                  type="text"
                  className="form-control"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="patientPhone">Patient Phone*</label>
                <input
                  type="text"
                  className="form-control"
                  id="patientPhone"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="treatments">Treatments*</label>
                <select
                  multiple
                  className="form-select"
                  id="treatments"
                  name="treatments"
                  value={formData.treatments}
                  onChange={handleTreatmentsChange}
                  required
                  disabled={loading}
                >
                  {treatments.map(treatment => (
                    <option key={treatment._id} value={treatment._id}>
                      {treatment.name} (${treatment.cost})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label>Last Clinic Visit</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastVisit ? (lastVisit === 'First time' ? 'First time' : new Date(lastVisit).toLocaleString()) : ''}
                  readOnly
                />
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
                <label htmlFor="status">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="in-clinic">In-Clinic</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                  <option value="no-show">No-Show</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="colorCode">Color Code</label>
                <div className="flex items-center gap-2 mt-2">
                  {[
                    '#ff4444', // Red
                    '#ff8800', // Orange
                    '#33b5e5', // Light Blue
                    '#4287f5', // Blue
                    '#a3e635', // Lime Green
                    '#00bcd4', // Cyan
                    '#e040fb', // Magenta
                    '#ffd600', // Yellow
                    '#00C851', // Green
                    '#ffbb33', // Amber
                  ].map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${formData.colorCode === color ? 'border-black' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, colorCode: color }))}
                      aria-label={`Pick color ${color}`}
                    />
                  ))}
                  <input
                    type="text"
                    className="form-control ml-2 w-24"
                    value={formData.colorCode}
                    onChange={e => setFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="payment.total">Total Cost</label>
                <input
                  type="number"
                  className="form-control"
                  id="payment.total"
                  name="payment.total"
                  value={formData.payment.total}
                  readOnly
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="payment.amountPaid">Amount Paid</label>
                <input
                  type="number"
                  className="form-control"
                  id="payment.amountPaid"
                  name="payment.amountPaid"
                  value={formData.payment.amountPaid}
                  onChange={handleAmountPaidChange}
                  min={0}
                  max={formData.payment.total}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="payment.amountRemaining">Amount Remaining</label>
                <input
                  type="number"
                  className="form-control"
                  id="payment.amountRemaining"
                  name="payment.amountRemaining"
                  value={formData.payment.amountRemaining}
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
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