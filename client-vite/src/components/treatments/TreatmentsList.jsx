import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const TreatmentsList = () => {
  const { user } = useAuth();

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