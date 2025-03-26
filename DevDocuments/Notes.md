 {/* Sidebar */}
        <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
          <div className="sidebar-logo">
            <img src="/images/logo.png" alt="Mountain Care Logo" />
            <span>Mountain Care</span>
          </div>
          <nav className="sidebar-menu">
            <Link href="/" className="menu-item active">
              <i className="fas fa-home"></i>
              Dashboard
            </Link>
            <Link href="/employees" className="menu-item">
              <i className="fas fa-users"></i>
              Employees
            </Link>
            <Link href="/attendance" className="menu-item">
              <i className="fas fa-calendar-alt"></i>
              Attendance
            </Link>
            <Link href="/leave" className="menu-item">
              <i className="fas fa-calendar-check"></i>
              Leave Management
            </Link>
            <Link href="/onboarding" className="menu-item">
              <i className="fas fa-clipboard-list"></i>
              Onboarding
            </Link>
            <Link href="/offboarding" className="menu-item">
              <i className="fas fa-user-minus"></i>
              Offboarding
            </Link>
            <Link href="/compliance" className="menu-item">
              <i className="fas fa-shield-alt"></i>
              Compliance
            </Link>
            <Link href="/documents" className="menu-item">
              <i className="fas fa-file-alt"></i>
              Documents
            </Link>
            <Link href="/settings" className="menu-item">
              <i className="fas fa-cog"></i>
              Settings
            </Link>
          </nav>
          <div className="sidebar-footer">
            <img src="/images/avatar.png" alt="User avatar" />
            <div className="user-info">
              <div className="user-name">Faith Calkins</div>
              <div className="user-role">HR Director</div>
            </div>
          </div>
        </aside>



import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };