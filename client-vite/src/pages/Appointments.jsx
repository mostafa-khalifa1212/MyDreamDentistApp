// client/src/pages/Appointments.js
import React from 'react';

const Appointments = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-900">Appointments</h1>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-primary-900">Calendar</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
              Today
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
              Week
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
              Month
            </button>
          </div>
        </div>
        <div className="h-[600px] bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Calendar will be implemented here</p>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-primary-900 mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          <p className="text-gray-600">No upcoming appointments to display.</p>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
