// client/src/pages/Dashboard.js
import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-primary-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your dental practice dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary-900">Today's Appointments</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">0</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary-900">Pending Tasks</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">0</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary-900">Revenue Today</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">$0</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-primary-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-600">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
