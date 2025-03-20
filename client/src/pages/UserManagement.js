// client/src/pages/UserManagement.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import { userAPI } from '../services/api';
import Spinner from '../components/common/Spinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.users || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      toast.error('Error loading user data');
    } finally {
      setLoading(false);
    }
  };
  
  // Open modal to edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  // Close edit modal
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };
  
  // Update user status
  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      setLoading(true);
      await userAPI.updateUserStatus(userId, newStatus);
      
      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success(`User status updated to ${newStatus}`);
      
      // If we're in the modal, close it
      if (isModalOpen) {
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter and search users
  const filteredUsers = users.filter(user => {
    // Status filter
    if (filterStatus !== 'all' && user.status !== filterStatus) {
      return false;
    }
    
    // Search term filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      return (
        user.username.toLowerCase().includes(search) ||
        user.fullName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phoneNumber.toLowerCase().includes(search)
      );
    }
    
    return true;
  });
  
  // Get status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = '';
    
    switch (status) {
      case 'approved':
        badgeClass = 'bg-green-100 text-green-800';
        break;
      case 'pending':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'banned':
        badgeClass = 'bg-red-100 text-red-800';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {status}
      </span>
    );
  };
  
  // User detail modal
  const UserModal = ({ user, onClose, onStatusUpdate }) => {
    if (!user) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <StatusBadge status={user.status} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium">{moment(user.createdAt).format('MMM D, YYYY')}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="font-medium">
                {user.lastLogin 
                  ? moment(user.lastLogin).format('MMM D, YYYY h:mm A') 
                  : 'Never logged in'}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4 dark:border-gray-700">
            <h3 className="font-medium mb-2">Update Status</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onStatusUpdate(user._id, 'approved')}
                disabled={user.status === 'approved'}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  user.status === 'approved'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                    : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => onStatusUpdate(user._id, 'pending')}
                disabled={user.status === 'pending'}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  user.status === 'pending'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}
              >
                Set Pending
              </button>
              <button
                onClick={() => onStatusUpdate(user._id, 'banned')}
                disabled={user.status === 'banned'}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  user.status === 'banned'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                    : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                }`}
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="mt-1 text-[#8E7C93]">
          Manage users and account approvals
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filterStatus === 'all'
                ? 'bg-[#201A23] text-white'
                : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filterStatus === 'pending'
                ? 'bg-[#201A23] text-white'
                : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filterStatus === 'approved'
                ? 'bg-[#201A23] text-white'
                : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus('banned')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filterStatus === 'banned'
                ? 'bg-[#201A23] text-white'
                : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            Banned
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8E7C93] dark:bg-gray-800 dark:border-gray-700"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                {error}
              </p>
              <button
                onClick={fetchUsers}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 dark:text-red-200 dark:hover:text-red-100"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Users table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            {searchTerm || filterStatus !== 'all'
              ? 'No users match your search criteria'
              : 'No users found in the system'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.phoneNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium capitalize">
                        {user.role}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {moment(user.createdAt).format('MMM D, YYYY')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-[#8E7C93] hover:text-[#201A23] dark:hover:text-white"
                      >
                        Edit
                      </button>
                      {user.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(user._id, 'approved')}
                          className="ml-3 text-green-600 hover:text-green-800 dark:hover:text-green-400"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* User modal */}
      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onStatusUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default UserManagement;