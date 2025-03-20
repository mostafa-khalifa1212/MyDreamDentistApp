// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { appointmentsAPI, financialAPI } from '../services/api';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    todayAppointments: [],
    totalToday: 0,
    completed: 0,
    upcoming: 0,
    financialSummary: {
      totalEarnings: 0,
      totalPaid: 0,
      totalPending: 0
    }
  });
  
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get today's date in the correct format
        const today = moment().format('YYYY-MM-DD');
        
        // Get appointments for today
        const startDate = moment().startOf('day').toISOString();
        const endDate = moment().endOf('day').toISOString();
        
        const appointmentsResponse = await appointmentsAPI.getAppointments(
          startDate,
          endDate,
          timezone
        );
        
        // Get financial summary for today
        const financialResponse = await financialAPI.getDailySummary(today, timezone);
        
        // Calculate stats
        const todayAppointments = appointmentsResponse.data || [];
        const completed = todayAppointments.filter(a => a.status === 'completed').length;
        const upcoming = todayAppointments.filter(a => a.status === 'scheduled').length;
        
        setStats({
          todayAppointments,
          totalToday: todayAppointments.length,
          completed,
          upcoming,
          financialSummary: {
            totalEarnings: financialResponse.netIncome || 0,
            totalPaid: todayAppointments.filter(a => a.payment?.status === 'paid').length,
            totalPending: todayAppointments.filter(a => a.payment?.status === 'pending').length
          }
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timezone]);
  
  // Format time for display
  const formatTime = (dateString) => {
    return moment(dateString).format('h:mm A');
  };
  
  // Get status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = '';
    
    switch (status) {
      case 'scheduled':
        badgeClass = 'bg-blue-100 text-blue-800';
        break;
      case 'completed':
        badgeClass = 'bg-green-100 text-green-800';
        break;
      case 'cancelled':
        badgeClass = 'bg-red-100 text-red-800';
        break;
      case 'no-show':
        badgeClass = 'bg-gray-100 text-gray-800';
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
  
  // Get payment status badge component
  const PaymentBadge = ({ status }) => {
    let badgeClass = '';
    
    switch (status) {
      case 'paid':
        badgeClass = 'bg-green-100 text-green-800';
        break;
      case 'partial':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'pending':
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#8E7C93] text-white rounded-md hover:bg-[#201A23] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Date display */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#8E7C93]">
          {moment().format('dddd, MMMM D, YYYY')}
        </h2>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Today's Appointments
          </h3>
          <div className="text-2xl font-bold">{stats.totalToday}</div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {stats.upcoming} upcoming
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Completed
          </h3>
          <div className="text-2xl font-bold">{stats.completed}</div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            out of {stats.totalToday} appointments
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Revenue Today
          </h3>
          <div className="text-2xl font-bold">
            ${stats.financialSummary.totalEarnings.toFixed(2)}
          </div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {stats.financialSummary.totalPaid} payments received
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Pending Payments
          </h3>
          <div className="text-2xl font-bold">{stats.financialSummary.totalPending}</div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            payments awaiting collection
          </div>
        </div>
      </div>
      
      {/* Today's appointments */}
      <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">Today's Schedule</h2>
          <Link
            to="/appointments"
            className="text-sm text-[#8E7C93] hover:text-[#201A23] dark:hover:text-white transition-colors"
          >
            View All
          </Link>
        </div>
        
        {stats.todayAppointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No appointments scheduled for today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Procedure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.todayAppointments
                  .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                  .map(appointment => (
                    <tr 
                      key={appointment._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {formatTime(appointment.startTime)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(appointment.endTime)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {appointment.patientName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {appointment.patientPhone}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm">{appointment.procedure}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <PaymentBadge status={appointment.payment?.status || 'pending'} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        ${appointment.payment?.amount?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
