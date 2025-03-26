// pages/leave.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/common/Layout';

export default function LeavePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  
  // If loading session, show simple loading indicator
  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading session...</p>
        </div>
      </Layout>
    );
  }

  // If no session and not loading, redirect to login
  if (!session && status !== 'loading') {
    return null; // Will redirect in useEffect
  }

  // Mock data for leave requests
  const leaveRequests = [
    {
      id: 1,
      employee: 'Sarah Johnson',
      department: 'Nursing',
      type: 'Sick Leave',
      startDate: '2025-04-01',
      endDate: '2025-04-03',
      status: 'pending',
      reason: 'Medical appointment and recovery'
    },
    {
      id: 2,
      employee: 'Michael Chen',
      department: 'Administration',
      type: 'Vacation',
      startDate: '2025-04-15',
      endDate: '2025-04-22',
      status: 'approved',
      reason: 'Family vacation'
    },
    {
      id: 3,
      employee: 'David Wilson',
      department: 'Radiology',
      type: 'Personal',
      startDate: '2025-04-10',
      endDate: '2025-04-10',
      status: 'denied',
      reason: 'Family event'
    },
    {
      id: 4,
      employee: 'Lisa Rodriguez',
      department: 'Pediatrics',
      type: 'Sick Leave',
      startDate: '2025-04-05',
      endDate: '2025-04-06',
      status: 'pending',
      reason: 'Not feeling well'
    }
  ];

  // Filter leave requests based on active tab
  const filteredRequests = leaveRequests.filter(request => 
    activeTab === 'all' || request.status === activeTab
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Request Leave
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 uppercase">Available Balance</h3>
            <p className="text-2xl font-bold text-blue-600">14 days</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 uppercase">Pending Requests</h3>
            <p className="text-2xl font-bold text-yellow-600">2</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 uppercase">Approved</h3>
            <p className="text-2xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500 uppercase">Used This Year</h3>
            <p className="text-2xl font-bold text-gray-600">6 days</p>
          </div>
        </div>

        {/* Tabs for filtering */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab('denied')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'denied'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Denied
            </button>
          </nav>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => {
                  // Calculate duration in days
                  const start = new Date(request.startDate);
                  const end = new Date(request.endDate);
                  const diffTime = Math.abs(end - start);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                  
                  // Status badge color
                  let statusBadgeClass = '';
                  if (request.status === 'approved') {
                    statusBadgeClass = 'bg-green-100 text-green-800';
                  } else if (request.status === 'denied') {
                    statusBadgeClass = 'bg-red-100 text-red-800';
                  } else {
                    statusBadgeClass = 'bg-yellow-100 text-yellow-800';
                  }
                  
                  return (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.employee}</div>
                            <div className="text-sm text-gray-500">{request.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {diffDays} day{diffDays !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        {request.status === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                            <button className="text-red-600 hover:text-red-900">Deny</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            This is a placeholder page. In the full implementation, you would be able to request leave, approve/deny requests, and view leave history.
          </p>
        </div>
      </div>
    </Layout>
  );
}