// components/common/Layout.jsx
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';

  // If not authenticated and not loading, redirect to login
  React.useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Show minimal loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // If no session and not loading, don't render the protected content
  if (!session && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                {/* Replace with your actual logo or company name */}
                <span className="text-blue-600 font-bold text-xl">Mountain Care HR</span>
              </a>
            </Link>
          </div>
          
          <div className="flex items-center">
            {session && (
              <div className="flex items-center">
                <span className="mr-4 text-sm text-gray-700">
                  {session.user.name || session.user.email}
                </span>
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  {/* Display initials if no avatar */}
                  {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-5 px-2">
            <Link href="/">
              <a className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Dashboard
              </a>
            </Link>
            <Link href="/employees">
              <a className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Employees
              </a>
            </Link>
            <Link href="/attendance">
              <a className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Attendance
              </a>
            </Link>
            <Link href="/leave">
              <a className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Leave
              </a>
            </Link>
            <Link href="/compliance">
              <a className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Compliance
              </a>
            </Link>
            <Link href="/documents">
              <a className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Documents
              </a>
            </Link>
            <Link href="/settings">
              <a className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Settings
              </a>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;