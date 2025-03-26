import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';

  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Show minimal loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no session and not loading, don't render the protected content
  if (!session && !isLoading) {
    return null;
  }

  // Handle signout
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Mountain Care HR Platform</title>
        <meta name="description" content="Mountain Care HR Management Platform" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-primary font-bold text-xl cursor-pointer">Mountain Care HR</span>
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
                <button 
                  onClick={handleSignOut}
                  className="ml-4 text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-5 px-2">
            <Link href="/">
              <div className={`group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-home mr-3"></i>
                Dashboard
              </div>
            </Link>
            <Link href="/employees">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/employees') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-users mr-3"></i>
                Employees
              </div>
            </Link>
            <Link href="/attendance">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/attendance') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-calendar-alt mr-3"></i>
                Attendance
              </div>
            </Link>
            <Link href="/leave">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/leave') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-calendar-check mr-3"></i>
                Leave
              </div>
            </Link>
            <Link href="/compliance">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/compliance') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-shield-alt mr-3"></i>
                Compliance
              </div>
            </Link>
            <Link href="/documents">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/documents') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-file-alt mr-3"></i>
                Documents
              </div>
            </Link>
            <Link href="/onboarding">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/onboarding') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-clipboard-list mr-3"></i>
                Onboarding
              </div>
            </Link>
            <Link href="/offboarding">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/offboarding') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-user-minus mr-3"></i>
                Offboarding
              </div>
            </Link>
            <Link href="/reports">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/reports') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-chart-bar mr-3"></i>
                Reports
              </div>
            </Link>
            <Link href="/settings">
              <div className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer ${
                router.pathname.startsWith('/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <i className="fas fa-cog mr-3"></i>
                Settings
              </div>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;