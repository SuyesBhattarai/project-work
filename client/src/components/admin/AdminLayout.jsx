import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Menu, X, Shield } from 'lucide-react';
import '../../css/admin-layout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/admin-login');
  };

  return (
    <div className="adm-layout">

      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar-open' : 'adm-sidebar-closed'}`}>

        {/* Brand */}
        <div className="adm-brand">
          <div className="adm-brand-icon">
            <Shield size={18} />
          </div>
          {sidebarOpen && (
            <div className="adm-brand-text">
              <p className="adm-brand-name">Admin Panel</p>
              <p className="adm-brand-sub">Management</p>
            </div>
          )}
          <button className="adm-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          <NavLink
            to="/admin-dashboard"
            end
            className={({ isActive }) =>
              `adm-nav-link ${isActive ? 'adm-nav-active' : 'adm-nav-inactive'} ${!sidebarOpen ? 'adm-nav-icon-only' : ''}`
            }
          >
            <LayoutDashboard size={20} className="adm-nav-icon" />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/admin-dashboard/users-owners"
            className={({ isActive }) =>
              `adm-nav-link ${isActive ? 'adm-nav-active' : 'adm-nav-inactive'} ${!sidebarOpen ? 'adm-nav-icon-only' : ''}`
            }
          >
            <Users size={20} className="adm-nav-icon" />
            {sidebarOpen && <span>Users & Owners</span>}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="adm-footer">
          <div className={`adm-profile ${!sidebarOpen ? 'adm-profile-center' : ''}`}>
            <div className="adm-avatar">AD</div>
            {sidebarOpen && (
              <div className="adm-admin-info">
                <p className="adm-admin-name">Admin User</p>
                <p className="adm-admin-email">admin@hostel.com</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`adm-logout ${!sidebarOpen ? 'adm-logout-center' : ''}`}
          >
            <LogOut size={16} className="adm-nav-icon" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`adm-main ${sidebarOpen ? 'adm-main-open' : 'adm-main-closed'}`}>

        {/* Topbar */}
        <div className="adm-topbar">
          <div className="adm-topbar-left">
            <span className="adm-topbar-brand">Hostel Finder</span>
            <span className="adm-topbar-sep">›</span>
            <span className="adm-topbar-page">Admin</span>
          </div>
          <div className="adm-topbar-status">
            <span className="adm-status-dot"></span>
            System Online
          </div>
        </div>

        {/* Content */}
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;