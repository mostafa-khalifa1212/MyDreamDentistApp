import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const TreatmentsList = () => {
  const { user } = useApp();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Treatments</h1>
      <div className="bg-white rounded-lg shadow">
        {/* Add your treatments list content here */}
      </div>
    </div>
  );
};

export default TreatmentsList; 