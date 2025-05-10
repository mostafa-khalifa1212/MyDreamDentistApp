import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const PatientsList = () => {
  const { user } = useApp();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>
      <div className="bg-white rounded-lg shadow">
        {/* Add your patients list content here */}
      </div>
    </div>
  );
};

export default PatientsList; 