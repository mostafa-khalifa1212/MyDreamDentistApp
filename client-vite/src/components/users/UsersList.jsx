import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const UsersList = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="bg-white rounded-lg shadow">
        {/* Add your users list content here */}
      </div>
    </div>
  );
};

export default UsersList; 