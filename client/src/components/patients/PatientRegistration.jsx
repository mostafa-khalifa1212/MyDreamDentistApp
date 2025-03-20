import React, { useState } from 'react';
import { useApp } from '../../App';

const PatientRegistration = () => {
  const { isAuthenticated } = useApp();
  const [formData, setFormData] = useState({
    userId: '',
    dateOfBirth: '',
    contactNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    allergies: '',
    conditions: '',
    medications: '',
    medicalNotes: '',
    provider: '',
    policyNumber: '',
    groupNumber: '',
    coverageDetails: '',
    lastCheckup: '',
    dentalNotes: ''
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Format data for API
      const patientData = {
        userId: formData.userId,
        dateOfBirth: formData.dateOfBirth,
        contactNumber: formData.contactNumber,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        medicalHistory: {
          allergies: formData.allergies.split(',').map(item => item.trim()).filter(item => item),
          conditions: formData.conditions.split(',').map(item => item.trim()).filter(item => item),
          medications: formData.medications.split(',').map(item => item.trim()).filter(item => item),
          notes: formData.medicalNotes
        },
        insuranceInfo: {
          provider: formData.provider,
          policyNumber: formData.policyNumber,
          groupNumber: formData.groupNumber,
          coverageDetails: formData.coverageDetails
        },
        dentalHistory: {
          lastCheckup: formData.lastCheckup || null,
          notes: formData.dentalNotes
        }
      };

      const token = localStorage.getItem('token');
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register patient');
      }

      setMessage({ type: 'success', text: 'Patient registered successfully!' });
      
      // Reset form
      setFormData({
        userId: '',
        dateOfBirth: '',
        contactNumber: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        allergies: '',
        conditions: '',
        medications: '',
        medicalNotes: '',
        provider: '',
        policyNumber: '',
        groupNumber: '',
        coverageDetails: '',
        lastCheckup: '',
        dentalNotes: ''
      });
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
    <div className="container mt-4">
      <h2>Register New Patient</h2>
      
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">
            <h4>Basic Information</h4>
          </div>
          <div className="card-body">
            <div className="form-group mb-3">
              <label htmlFor="userId">User ID*</label>
              <input
                type="text"
                className="form-control"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
              <small className="form-text text-muted">
                Enter the user ID of a registered user to associate with this patient record
              </small>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="dateOfBirth">Date of Birth*</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="contactNumber">Contact Number*</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h4>Address</h4>
          </div>
          <div className="card-body">
            <div className="form-group mb-3">
              <label htmlFor="street">Street Address*</label>
              <input
                type="text"
                className="form-control"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="city">City*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="state">State*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="zipCode">ZIP Code*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="country">Country*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h4>Medical History</h4>
          </div>
          <div className="card-body">
            <div className="form-group mb-3">
              <label htmlFor="allergies">Allergies</label>
              <input
                type="text"
                className="form-control"
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Separate with commas"
              />
            </div>
            
            <div className="form-group mb-3">
              <label htmlFor="conditions">Medical Conditions</label>
              <input
                type="text"
                className="form-control"
                id="conditions"
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                placeholder="Separate with commas"
              />
            </div>
            
            <div className="form-group mb-3">
              <label htmlFor="medications">Current Medications</label>
              <input
                type="text"
                className="form-control"
                id="medications"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                placeholder="Separate with commas"
              />
            </div>
            
            <div className="form-group mb-3">
              <label htmlFor="medicalNotes">Additional Medical Notes</label>
              <textarea
                className="form-control"
                id="medicalNotes"
                name="medicalNotes"
                rows="3"
                value={formData.medicalNotes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h4>Insurance Information</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="provider">Insurance Provider</label>
                  <input
                    type="text"
                    className="form-control"
                    id="provider"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="policyNumber">Policy Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="policyNumber"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="groupNumber">Group Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="groupNumber"
                    name="groupNumber"
                    value={formData.groupNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="coverageDetails">Coverage Details</label>
                  <input
                    type="text"
                    className="form-control"
                    id="coverageDetails"
                    name="coverageDetails"
                    value={formData.coverageDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h4>Dental History</h4>
          </div>
          <div className="card-body">
            <div className="form-group mb-3">
              <label htmlFor="lastCheckup">Last Dental Checkup</label>
              <input
                type="date"
                className="form-control"
                id="lastCheckup"
                name="lastCheckup"
                value={formData.lastCheckup}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group mb-3">
              <label htmlFor="dentalNotes">Dental Notes</label>
              <textarea
                className="form-control"
                id="dentalNotes"
                name="dentalNotes"
                rows="3"
                value={formData.dentalNotes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;