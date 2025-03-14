// client/src/pages/Profile.js
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      {user ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Full Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
