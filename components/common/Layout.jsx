import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useAuth } from '../auth/AuthProvider';

const Layout = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { user } = useAuth();
  const [sidebarActive, setSidebarActive] = useState(false);

  // Function to toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    setSidebarActive(false);
  }, [router.pathname]);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  // Check if a menu item is active
  const isActiveLink = (path) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="Mountain Care Logo" />
          <span>Mountain Care</span>
        </div>
        <nav className="sidebar-menu">
          <Link href="/" className={`menu-item ${isActiveLink('/') ? 'active' : ''}`}>
            <i className="fas fa-home"></i>
            Dashboard
          </Link>
          <Link href="/employees" className={`menu-item ${isActiveLink('/employees') ? 'active' : ''}`}>
            <i className="fas fa-users"></i>
            Employees
          </Link>
          <Link href="/attendance" className={`menu-item ${isActiveLink('/attendance') ? 'active' : ''}`}>
            <i className="fas fa-calendar-alt"></i>
            Attendance
          </Link>
          <Link href="/leave" className={`menu-item ${isActiveLink('/leave') ? 'active' : ''}`}>
            <i className="fas fa-calendar-check"></i>
            Leave Management
          </Link>
          <Link href="/onboarding" className={`menu-item ${isActiveLink('/onboarding') ? 'active' : ''}`}>
            <i className="fas fa-clipboard-list"></i>
            Onboarding
          </Link>
          <Link href="/offboarding" className={`menu-item ${isActiveLink('/offboarding') ? 'active' : ''}`}>
            <i className="fas fa-user-minus"></i>
            Offboarding
          </Link>
          
          {/* Only show compliance to appropriate roles */}
          {user && (user.role === 'admin' || user.role === 'hr_manager' || user.role === 'department_head') && (
            <Link href="/compliance" className={`menu-item ${isActiveLink('/compliance') ? 'active' : ''}`}>
              <i className="fas fa-shield-alt"></i>
              Compliance
            </Link>
          )}
          
          <Link href="/documents" className={`menu-item ${isActiveLink('/documents') ? 'active' : ''}`}>
            <i className="fas fa-file-alt"></i>
            Documents
          </Link>
          
          {/* Only show settings to admin */}
          {user && user.role === 'admin' && (
            <Link href="/settings" className={`menu-item ${isActiveLink('/settings') ? 'active' : ''}`}>
              <i className="fas fa-cog"></i>
              Settings
            </Link>
          )}
        </nav>
        <div className="sidebar-footer">
          {session?.user ? (
            <>
              <img src="/images/avatar.png" alt="User avatar" />
              <div className="user-info">
                <div className="user-name">{session.user.name}</div>
                <div className="user-role">{formatRole(session.user.role)}</div>
              </div>
              <button onClick={handleLogout} className="logout-button" title="Logout">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </>
          ) : (
            <Link href="/login" className="login-link">
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

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
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          '@media (max-width: 768px)': {
            display: 'flex'
          }
        }}
      >
        <i className={`fas ${sidebarActive ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
    </div>
  );
};

// Helper function to format user roles for display
const formatRole = (role) => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'hr_manager':
      return 'HR Manager';
    case 'department_head':
      return 'Department Head';
    case 'employee':
      return 'Employee';
    default:
      return role;
  }
};

export default Layout;