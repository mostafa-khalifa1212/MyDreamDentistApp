import React, { useState, useEffect, useContext } from 'react';
import { getProfile, updateProfile } from '../services/api'; // Assuming api.js exports these
import { AuthContext } from '../context/AuthContext'; // To update user context if name changes

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phoneNumber: '',
  });
  const [initialData, setInitialData] = useState({}); // To compare for changes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser } = useContext(AuthContext); // Get setUser from AuthContext to update global state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        if (response.data.success) {
          const userData = response.data.user;
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            username: userData.username || '',
            phoneNumber: userData.phoneNumber || '',
          });
          setInitialData({ // Store initial fetched data
            name: userData.name || '',
            email: userData.email || '',
            username: userData.username || '',
            phoneNumber: userData.phoneNumber || '',
          });
        } else {
          setError('Failed to fetch profile data.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on change
    setSuccessMessage(''); // Clear success message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    // Create a payload with only changed fields
    const changedData = {};
    for (const key in formData) {
      if (formData[key] !== initialData[key]) {
        changedData[key] = formData[key];
      }
    }

    if (Object.keys(changedData).length === 0) {
      setSuccessMessage("No changes to save.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updateProfile(changedData);
      if (response.data.success) {
        const updatedUser = response.data.user;
        setSuccessMessage('Profile updated successfully!');
        setFormData({ // Update form with potentially sanitized/modified data from backend
            name: updatedUser.name || '',
            email: updatedUser.email || '',
            username: updatedUser.username || '',
            phoneNumber: updatedUser.phoneNumber || '',
        });
        setInitialData({ // Update initial data to reflect saved changes
            name: updatedUser.name || '',
            email: updatedUser.email || '',
            username: updatedUser.username || '',
            phoneNumber: updatedUser.phoneNumber || '',
        });
        // Update user in AuthContext if name or other relevant details changed
        if (setUser && (changedData.name || changedData.username)) {
            // Refetch user from context or update selectively
            // For simplicity, assuming getProfile in AuthContext or similar updates context
            // Or pass specific fields:
             setUser(prevUser => ({
                ...prevUser,
                name: updatedUser.name,
                username: updatedUser.username
                // any other fields stored in AuthContext's user object
            }));
        }
      } else {
        setError(response.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || err.message || 'An error occurred while updating profile.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-primary-900 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50">Profile</h1>
      </div>

      <div className="bg-white dark:bg-primary-900 shadow rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-8">
          <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-primary-800 flex items-center justify-center">
            <span className="text-3xl text-gray-500 dark:text-primary-300">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-50">{formData.name || 'User Name'}</h2>
            <p className="text-gray-600 dark:text-primary-300">{formData.email || 'user@example.com'}</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">{successMessage}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-primary-200">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-primary-200">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-primary-200">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-primary-200">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-4">Security (Password Change Not Implemented)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-primary-200">Current Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 opacity-50"
                  placeholder="Password change not available here"
                  disabled 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-primary-200">New Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 opacity-50"
                  placeholder="Password change not available here"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-primary-200">Confirm New Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-primary-700 dark:bg-primary-800 dark:text-primary-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 opacity-50"
                  placeholder="Password change not available here"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Profile;
