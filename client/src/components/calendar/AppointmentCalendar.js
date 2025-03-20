import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// Components
import AppointmentForm from './AppointmentForm';
import Spinner from '../common/Spinner';

// Custom calendar components
import CustomEvent from './CustomEvent';
import CustomToolbar from './CustomToolbar';

// Initialize localizer
const localizer = momentLocalizer(moment);

// Create drag and drop calendar
const DragAndDropCalendar = withDragAndDrop(Calendar);

const AppointmentCalendar = ({ 
  appointments, 
  loading, 
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  timezone = 'Africa/Cairo' 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Convert appointments to calendar events
  const events = useMemo(() => {
    return appointments.map(appointment => ({
      id: appointment._id,
      title: appointment.patientName,
      start: new Date(appointment.startTime),
      end: new Date(appointment.endTime),
      resource: appointment
    }));
  }, [appointments]);
  
  // Round time to nearest 5 minutes
  const roundTo5Minutes = useCallback((date) => {
    const minutes = date.getMinutes();
    const remainder = minutes % 5;
    if (remainder === 0) return date;
    
    const roundedMinutes = remainder < 3 
      ? minutes - remainder 
      : minutes + (5 - remainder);
    
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      roundedMinutes
    );
  }, []);
  
  // Event handlers
  const handleSelectSlot = useCallback(({ start, end }) => {
    // Round times to the nearest 5-minute increment
    const roundedStart = roundTo5Minutes(start);
    const roundedEnd = roundTo5Minutes(end);
    
    setSelectedSlot({
      start: roundedStart,
      end: roundedEnd
    });
    setSelectedAppointment(null);
    setShowForm(true);
  }, [roundTo5Minutes]);
  
  const handleSelectEvent = useCallback((event) => {
    setSelectedAppointment(event.resource);
    setSelectedSlot(null);
    setShowForm(true);
  }, []);
  
  const handleEventDrop = useCallback(({ event, start, end }) => {
    // Round times to the nearest 5-minute increment
    const roundedStart = roundTo5Minutes(start);
    const roundedEnd = roundTo5Minutes(end);
    
    // Check if the time has actually changed
    const originalStart = new Date(event.start).getTime();
    const originalEnd = new Date(event.end).getTime();
    const newStart = roundedStart.getTime();
    const newEnd = roundedEnd.getTime();
    
    if (originalStart === newStart && originalEnd === newEnd) {
      return; // No change, don't update
    }
    
    // Calculate duration
    const duration = originalEnd - originalStart;
    const adjustedEnd = new Date(newStart + duration);
    
    onUpdateAppointment(event.id, {
      startTime: roundedStart,
      endTime: adjustedEnd
    });
  }, [onUpdateAppointment, roundTo5Minutes]);
  
  const handleEventResize = useCallback(({ event, start, end }) => {
    // Round times to the nearest 5-minute increment
    const roundedStart = roundTo5Minutes(start);
    const roundedEnd = roundTo5Minutes(end);
    
    onUpdateAppointment(event.id, {
      startTime: roundedStart,
      endTime: roundedEnd
    });
  }, [onUpdateAppointment, roundTo5Minutes]);
  
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedAppointment(null);
    setSelectedSlot(null);
  };
  
  const handleSaveAppointment = (appointmentData) => {
    if (selectedAppointment) {
      // Update existing appointment
      onUpdateAppointment(selectedAppointment._id, appointmentData);
    } else {
      // Create new appointment
      onAddAppointment({
        ...appointmentData,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end
      });
    }
    
    handleCloseForm();
  };
  
  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      onDeleteAppointment(selectedAppointment._id);
      handleCloseForm();
    }
  };
  
  // Calendar format strings for displaying times
  const formats = {
    timeGutterFormat: (date, culture, localizer) => 
      localizer.format(date, 'HH:mm', culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
      return `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`;
    },
    selectRangeFormat: ({ start, end }, culture, localizer) => {
      return `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            defaultView="day"
            views={['day', 'week', 'month']}
            step={5} // 5 minute increments
            timeslots={12} // 12 slots per hour (5 minutes each)
            formats={formats}
            selectable
            resizable
            popup
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            components={{
              event: CustomEvent,
              toolbar: CustomToolbar
            }}
            style={{ height: 'calc(100vh - 200px)' }}
            className="bg-white rounded-lg shadow-md my-4"
          />
          
          {showForm && (
            <AppointmentForm
              appointment={selectedAppointment}
              onSave={handleSaveAppointment}
              onDelete={handleDeleteAppointment}
              onClose={handleCloseForm}
              timezone={timezone}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentCalendar;