import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/common/Layout';
import { format } from 'date-fns';

export default function AttendanceDetailPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const { id } = router.query;
  
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    timeIn: '',
    timeOut: '',
    status: '',
    notes: ''
  });
  
  // Fetch the attendance record
  useEffect(() => {
    if (id && session) {
      fetchAttendanceRecord();
    }
  }, [id, session]);
  
  const fetchAttendanceRecord = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attendance/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendance record');
      }
      
      const data = await response.json();
      setAttendanceRecord(data);
      
      // Set form data
      setFormData({
        date: format(new Date(data.date), 'yyyy-MM-dd'),
        timeIn: data.timeIn || '',
        timeOut: data.timeOut || '',
        status: data.status || 'present',
        notes: data.notes || ''
      });
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/attendance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update attendance record');
      }
      
      // Redirect back to attendance page
      router.push('/attendance');
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Handle attendance record deletion
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      try {
        const response = await fetch(`/api/attendance/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete attendance record');
        }
        
        // Redirect back to attendance page
        router.push('/attendance');
      } catch (err) {
        setError(err.message);
      }
    }
  };
  
  // Handle loading state
  if (status === 'loading' || (loading && !attendanceRecord)) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => router.push('/attendance')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Attendance
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Edit Attendance Record
            </h1>
            {attendanceRecord?.employee && (
              <p className="text-gray-600">
                Employee: {attendanceRecord.employee.firstName} {attendanceRecord.employee.lastName}
              </p>
            )}
          </div>
          
          <button
            onClick={() => router.push('/attendance')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Back to Attendance
          </button>
        </div>
        
        {/* Edit Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time In
                </label>
                <input
                  type="time"
                  name="timeIn"
                  value={formData.timeIn}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Out
                </label>
                <input
                  type="time"
                  name="timeOut"
                  value={formData.timeOut}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <div>
                {(session.user.role === 'admin' || session.user.role === 'hr') && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete Record
                  </button>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/attendance')}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Record Details */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Record Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Record ID</p>
              <p className="font-medium">{attendanceRecord?.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">
                {attendanceRecord?.createdAt 
                  ? format(new Date(attendanceRecord.createdAt), 'MMM dd, yyyy h:mm a')
                  : 'N/A'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">
                {attendanceRecord?.updatedAt
                  ? format(new Date(attendanceRecord.updatedAt), 'MMM dd, yyyy h:mm a')
                  : 'N/A'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">
                {attendanceRecord?.employee?.department?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Add server-side authentication check
export async function getServerSideProps(context) {
  return {
    props: {}
  };
}