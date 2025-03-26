import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

const Layout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const [sidebarActive, setSidebarActive] = useState(false);

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

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
            <div className="spinner"></div>
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
    <div className="min-h-screen flex flex-col bg-gray-100">
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
            <Link href="/" legacyBehavior>
              <a className="text-primary font-bold text-xl">Mountain Care HR</a>
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
        <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
          <div className="sidebar-logo">
            <img src="/images/logo.png" alt="Mountain Care Logo" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2232%22 height%3D%2232%22 viewBox%3D%220 0 24 24%22 fill%3D%22none%22 stroke%3D%22%231D4ED8%22 stroke-width%3D%222%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22%3E%3Cpath d%3D%22M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z%22%2F%3E%3Cpolyline points%3D%229 22 9 12 15 12 15 22%22%2F%3E%3C%2Fsvg%3E'
              }}
            />
            <span>Mountain Care</span>
          </div>
          <nav className="sidebar-menu">
            <Link href="/" legacyBehavior>
              <a className={`menu-item ${router.pathname === '/' ? 'active' : ''}`}>
                <i className="fas fa-home"></i>
                Dashboard
              </a>
            </Link>
            <Link href="/employees" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/employees') ? 'active' : ''}`}>
                <i className="fas fa-users"></i>
                Employees
              </a>
            </Link>
            <Link href="/attendance" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/attendance') ? 'active' : ''}`}>
                <i className="fas fa-calendar-alt"></i>
                Attendance
              </a>
            </Link>
            <Link href="/leave" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/leave') ? 'active' : ''}`}>
                <i className="fas fa-calendar-check"></i>
                Leave
              </a>
            </Link>
            <Link href="/compliance" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/compliance') ? 'active' : ''}`}>
                <i className="fas fa-shield-alt"></i>
                Compliance
              </a>
            </Link>
            <Link href="/documents" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/documents') ? 'active' : ''}`}>
                <i className="fas fa-file-alt"></i>
                Documents
              </a>
            </Link>
            <Link href="/onboarding" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/onboarding') ? 'active' : ''}`}>
                <i className="fas fa-clipboard-list"></i>
                Onboarding
              </a>
            </Link>
            <Link href="/offboarding" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/offboarding') ? 'active' : ''}`}>
                <i className="fas fa-user-minus"></i>
                Offboarding
              </a>
            </Link>
            <Link href="/reports" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/reports') ? 'active' : ''}`}>
                <i className="fas fa-chart-bar"></i>
                Reports
              </a>
            </Link>
            <Link href="/settings" legacyBehavior>
              <a className={`menu-item ${router.pathname.startsWith('/settings') ? 'active' : ''}`}>
                <i className="fas fa-cog"></i>
                Settings
              </a>
            </Link>
          </nav>
          <div className="sidebar-footer">
            <img 
              src="/images/avatar.png" 
              alt="User avatar" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2232%22 height%3D%2232%22 viewBox%3D%220 0 24 24%22 fill%3D%22none%22 stroke%3D%22%23666666%22 stroke-width%3D%222%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22%3E%3Cpath d%3D%22M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2%22%2F%3E%3Ccircle cx%3D%2212%22 cy%3D%227%22 r%3D%224%22%2F%3E%3C%2Fsvg%3E'
              }}
            />
            <div className="user-info">
              <div className="user-name">{session?.user?.name || 'User'}</div>
              <div className="user-role">{session?.user?.role || 'Staff'}</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          <main className="p-6">{children}</main>
        </div>
      </div>

      {/* Mobile menu toggle button */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: '200',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer'
        }}
      >
        <i className={`fas ${sidebarActive ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
    </div>
  );
};

export default Layout;