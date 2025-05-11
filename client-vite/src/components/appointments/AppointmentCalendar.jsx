import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import Modal from '../common/Modal';
import AppointmentForm from './AppointmentForm';
import AppointmentDetails from './AppointmentDetails';
import { useAuth } from '../../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AppointmentCalendar(props) {
  const { isAuthenticated, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [calendarView, setCalendarView] = useState('timeGridWeek');
  const calendarRef = useRef(null);
  
  // Fetch appointments
  const fetchAppointments = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const startDate = new Date('2025-01-01');
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month ahead

      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo'
      });
      const response = await fetch(`${API_URL}/appointments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch appointments on mount and when auth changes
  useEffect(() => {
    fetchAppointments();
  }, [isAuthenticated]);
  
  // Transform appointments for FullCalendar
  const getCalendarEvents = () => {
    return appointments.map(appointment => ({
      id: appointment._id,
      title: `${appointment.patient?.user?.name || 'Unknown'} - ${appointment.type}`,
      start: new Date(appointment.startTime),
      end: new Date(appointment.endTime),
      backgroundColor: appointment.colorCode,
      borderColor: appointment.colorCode,
      textColor: getContrastYIQ(appointment.colorCode),
      extendedProps: { appointment }
    }));
  };
  
  // Determine text color based on background for readability
  const getContrastYIQ = (hexcolor) => {
    // If no color or invalid format, return black
    if (!hexcolor || !hexcolor.startsWith('#')) return '#000000';
    
    hexcolor = hexcolor.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    
    // Calculate YIQ ratio
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // Return black or white depending on brightness
    return (yiq >= 128) ? '#000000' : '#ffffff';
  };
  
  // Handler for clicking on a date/time slot
  const handleDateSelect = (selectInfo) => {
    if (!isAuthenticated) return;
    
    // Only staff can create appointments
    if (user?.role !== 'admin' && user?.role !== 'dentist' && user?.role !== 'receptionist') {
      return;
    }
    
    const startTime = selectInfo.start;
    const endTime = selectInfo.end;
    
    // Create appointment starting data
    setCurrentAppointment({
      startTime,
      endTime,
      dentist: user?.role === 'dentist' ? user?.id : '',
      type: 'checkup',
      colorCode: '#4287f5'
    });
    
    setShowForm(true);
  };
  
  // Handler for clicking on an existing event
  const handleEventClick = (clickInfo) => {
    if (!isAuthenticated) return;
    
    setCurrentAppointment(clickInfo.event.extendedProps.appointment);
    setShowDetails(true);
  };
  
  // Handle appointment creation
  const handleCreateAppointment = async (appointmentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }
      
      // Refresh appointments
      fetchAppointments();
      
      // Close form
      setShowForm(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Handle appointment update
  const handleUpdateAppointment = async (appointmentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments/${appointmentData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appointment');
      }
      
      // Refresh appointments
      fetchAppointments();
      
      // Close form and details
      setShowForm(false);
      setShowDetails(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating appointment:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Handle appointment deletion
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return { success: false };
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete appointment');
      }
      
      // Refresh appointments
      fetchAppointments();
      
      // Close details
      setShowDetails(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Handle calendar view change
  const handleViewChange = (view) => {
    setCalendarView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };
  
  // Open edit form from details
  const handleEditAppointment = () => {
    setShowDetails(false);
    setShowForm(true);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="alert alert-info">
        Please log in to view the appointment calendar.
      </div>
    );
  }
  
  try {
    return (
      <div className="appointment-calendar">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h3>Appointment Calendar</h3>
              <div className="btn-group">
                <button 
                  className={`btn btn-sm ${calendarView === 'dayGridMonth' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('dayGridMonth')}
                >
                  Month
                </button>
                <button 
                  className={`btn btn-sm ${calendarView === 'timeGridWeek' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('timeGridWeek')}
                >
                  Week
                </button>
                <button 
                  className={`btn btn-sm ${calendarView === 'timeGridDay' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('timeGridDay')}
                >
                  Day
                </button>
                <button 
                  className={`btn btn-sm ${calendarView === 'listWeek' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewChange('listWeek')}
                >
                  List
                </button>
              </div>
              
              {/* Show button only for staff */}
              {(user?.role === 'admin' || user?.role === 'dentist' || user?.role === 'receptionist') && (
                <button 
                  className="btn btn-success" 
                  onClick={() => {
                    setCurrentAppointment({
                      startTime: new Date(),
                      endTime: new Date(new Date().getTime() + 30 * 60000),
                      dentist: user?.role === 'dentist' ? user?.id : '',
                      type: 'checkup',
                      colorCode: '#4287f5'
                    });
                    setShowForm(true);
                  }}
                >
                  <i className="fas fa-plus me-2"></i>
                  New Appointment
                </button>
              )}
            </div>
          </div>
          
          <div className="card-body">
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            
            {loading && appointments.length === 0 ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, bootstrap5Plugin]}
                initialView={calendarView}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: ''
                }}
                events={getCalendarEvents()}
                selectable={user?.role === 'admin' || user?.role === 'dentist' || user?.role === 'receptionist'}
                select={handleDateSelect}
                eventClick={handleEventClick}
                height="auto"
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="18:00:00"
                slotDuration="00:15:00"
                slotLabelInterval="01:00:00"
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: '09:00',
                  endTime: '17:00'
                }}
                nowIndicator={true}
                dayMaxEvents={true}
                eventTimeFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                themeSystem="bootstrap5"
              />
            )}
          </div>
        </div>
        
        {/* Appointment Form Modal */}
        <Modal
          show={showForm}
          onClose={() => setShowForm(false)}
          title={currentAppointment?._id ? "Edit Appointment" : "New Appointment"}
          size="lg"
        >
          <AppointmentForm
            initialData={currentAppointment}
            onSubmit={currentAppointment?._id ? handleUpdateAppointment : handleCreateAppointment}
            mode={currentAppointment?._id ? "edit" : "create"}
          />
        </Modal>
        
        {/* Appointment Details Modal */}
        <Modal
          show={showDetails}
          onClose={() => setShowDetails(false)}
          title="Appointment Details"
          size="lg"
        >
          <AppointmentDetails
            appointment={currentAppointment}
            onEdit={handleEditAppointment}
            onDelete={() => handleDeleteAppointment(currentAppointment?._id)}
            canEdit={user?.role === 'admin' || user?.role === 'dentist' || user?.role === 'receptionist'}
          />
        </Modal>
      </div>
    );
  } catch (err) {
    console.error('Error in AppointmentCalendar:', err);
    return <div style={{color: 'red'}}>Error: {err.message}</div>;
  }
}