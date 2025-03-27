// client/src/pages/CalendarDemo.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';

// Sample data demonstrating two appointments
const appointmentsData = [
  {
    id: 1,
    patientName: 'John Doe',
    startTime: '09:00 AM',
    endTime: '09:30 AM',
    color: '#FFCDD2' // A soft red pastel
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    startTime: '10:00 AM',
    endTime: '10:45 AM',
    color: '#C8E6C9' // A soft green pastel
  },
];

const CalendarDemo = () => {
  // This conversion is only a rough example; in production, you'd calculate proper positions.
  const getPositionForTime = (timeStr) => {
    const [hour] = timeStr.split(':');
    // For a calendar starting at 9AM, each hour equals about 60px in vertical space
    return (parseInt(hour, 10) - 9) * 60;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-darkText dark:text-cream">Calendar</h2>
      <div className="grid grid-cols-12 gap-2">
        {/* Timeline Column */}
        <div className="col-span-2">
          <div className="text-sm text-darkText dark:text-cream">09:00</div>
          <div className="text-sm mt-2 text-darkText dark:text-cream">09:30</div>
          <div className="text-sm mt-2 text-darkText dark:text-cream">10:00</div>
          {/* etc. */}
        </div>
        {/* Calendar Grid */}
        <div className="col-span-10 relative bg-cream dark:bg-night rounded shadow p-4" style={{ height: '480px' }}>
          {appointmentsData.map(app => (
            <div key={app.id} 
              className="absolute rounded p-2 text-xs font-semibold text-black flex items-center justify-between shadow hover:shadow-lg transition-all duration-200 cursor-pointer"
              style={{ 
                backgroundColor: app.color, 
                top: `${getPositionForTime(app.startTime)}px`, 
                height: '30px', 
                width: '150px' 
              }}
            >
              <span>{app.patientName}</span>
              <FaTimes className="cursor-pointer ml-2 text-gray-600 hover:text-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDemo;
