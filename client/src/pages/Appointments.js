// client/src/pages/Appointments.js
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import AppointmentCalendar from '../components/calendar/AppointmentCalendar';
import { CustomEvent, CustomToolbar } from '../components/calendar/CustomComponents';
import { appointmentsAPI } from '../services/api';
import Spinner from '../components/common/Spinner';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf('week').toDate(),
    endDate: moment().endOf('week').toDate(),
    view: 'week'
  });
  
  // Get user's timezone or default to Cairo
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';
  
  // Fetch appointments based on date range
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      
      const start = moment(dateRange.startDate).toISOString();
      const end = moment(dateRange.endDate).toISOString();
      
      const response = await appointmentsAPI.getAppointments(start, end, timezone);
      
      setAppointments(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
      toast.error('Error loading appointments');
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate, timezone]);
  
  // Initialize and load appointments
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  // Handle date range change
  const handleDateRangeChange = (start, end, view) => {
    setDateRange({
      startDate: start,
      endDate: end,
      view
    });
  };
  
  // Add new appointment
  const handleAddAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      
      await appointmentsAPI.createAppointment({
        ...appointmentData,
        timezone
      });
      
      toast.success('Appointment created successfully');
      await fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };
  
  // Update existing appointment
  const handleUpdateAppointment = async (id, appointmentData) => {
    try {
      setLoading(true);
      
      await appointmentsAPI.updateAppointment(id, {
        ...appointmentData,
        timezone
      });
      
      toast.success('Appointment updated successfully');
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete appointment
  const handleDeleteAppointment = async (id) => {
    try {
      setLoading(true);
      
      await appointmentsAPI.deleteAppointment(id);
      
      toast.success('Appointment deleted successfully');
      await fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="mt-1 text-[#8E7C93]">
          Manage patient appointments and schedule
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                {error}
              </p>
              <button
                onClick={fetchAppointments}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 dark:text-red-200 dark:hover:text-red-100"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        <AppointmentCalendar
          appointments={appointments}
          loading={loading}
          onAddAppointment={handleAddAppointment}
          onUpdateAppointment={handleUpdateAppointment}
          onDeleteAppointment={handleDeleteAppointment}
          onDateRangeChange={handleDateRangeChange}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar
          }}
          timezone={timezone}
        />
      </div>
    </div>
  );
};

export default Appointments;