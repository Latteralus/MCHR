// pages/employee.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/common/Layout';

export default function EmployeePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeEmployee, setActiveEmployee] = useState(null);

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading session...</p>
        </div>
      </Layout>
    );
  }

  if (!session && status !== 'loading') {
    // Optionally, you could redirect to login here.
    return null;
  }

  // Dummy employee data – replace with real API data as needed.
  const employees = [
    { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'IT', hireDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', position: 'HR Manager', department: 'Human Resources', hireDate: '2022-07-22' },
    { id: 3, name: 'Alice Johnson', position: 'Marketing Specialist', department: 'Marketing', hireDate: '2024-02-10' },
  ];

  return (
    <Layout>
      <Head>
        <title>Mountain Care HR - Employees</title>
        <meta name="description" content="Mountain Care HR Employee Management" />
      </Head>
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <Link href="/employees/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Add New Employee
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left panel – Employee List */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-medium text-gray-800">Employees</h2>
            </div>
            <ul className="p-2">
              {employees.map(employee => (
                <li key={employee.id}>
                  <button
                    onClick={() => setActiveEmployee(employee)}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      activeEmployee?.id === employee.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-xs text-gray-500">{employee.position}</div>
                    <div className="text-xs text-gray-500">
                      Hired: {new Date(employee.hireDate).toLocaleDateString()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right panel – Employee Details */}
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            {activeEmployee ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeEmployee.name}</h2>
                <p className="text-gray-600 mb-2">
                  <strong>Position:</strong> {activeEmployee.position}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Department:</strong> {activeEmployee.department}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Hire Date:</strong>{' '}
                  {new Date(activeEmployee.hireDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  This is a placeholder for additional employee details. More information can be displayed here once integrated with a real data source.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Select an employee to view their profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
