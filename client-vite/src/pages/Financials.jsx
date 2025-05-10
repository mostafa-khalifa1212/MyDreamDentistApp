// client/src/pages/Financials.js
import React from 'react';

const Financials = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-primary-900">Financial Overview</h1>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary-900">Total Revenue</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">$0</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary-900">Outstanding</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">$0</p>
          <p className="text-sm text-gray-500">Pending payments</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary-900">Expenses</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">$0</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary-900">Net Income</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">$0</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-primary-900">Recent Transactions</h2>
          <button className="text-primary-600 hover:text-primary-700">
            View All
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">No recent transactions to display.</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-primary-900 mb-4">Payment Methods</h2>
        <div className="space-y-4">
          <p className="text-gray-600">No payment methods configured.</p>
        </div>
      </div>
    </div>
  );
};

export default Financials;
