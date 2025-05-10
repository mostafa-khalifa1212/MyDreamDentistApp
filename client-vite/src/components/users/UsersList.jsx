import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const UsersList = () => {
  const { user } = useApp();

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