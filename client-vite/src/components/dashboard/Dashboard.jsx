import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard; 