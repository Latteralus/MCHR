import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Sidebar from './Sidebar';

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
        {/* Sidebar Component */}
        <Sidebar isActive={sidebarActive} />

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