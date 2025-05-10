import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const PatientDetails = () => {
  const { user } = useApp();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Add your patient details content here */}
      </div>
    </div>
  );
};

export default PatientDetails; 