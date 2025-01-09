import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [notifications, setNotifications] = useState(5);
  const location = useLocation();

  const getActiveTabName = () => {
    const path = location.pathname.split('/')[2];
    switch (path) {
      case 'analytics':
        return 'Analytics';
      case 'service-providers':
        return 'Service Providers';
      case 'patients':
        return 'Patients';
      case 'admin-profile':
        return 'Admin Profile';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <nav className="sidebar">
        {/* Logo Section */}
        <div className="logo">
          <img
            src="/logo.png" // Replace with your logo file path
            alt="Admin Logo"
          />
          {/* <h2>Admin Dashboard</h2> */}
        </div>

        <ul>
          <li><NavLink to="analytics">Analytics</NavLink></li>
          <li><NavLink to="service-providers">Service Providers</NavLink></li>
          <li><NavLink to="patients">Patients</NavLink></li>
          <li><NavLink to="admin-profile">Admin Profile</NavLink></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h1>{getActiveTabName()}</h1>
          <button className="notification-btn">
            Notifications {notifications > 0 && <span className="badge">{notifications}</span>}
          </button>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
