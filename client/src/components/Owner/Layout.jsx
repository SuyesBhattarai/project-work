import React from 'react';
import { Home, PlusCircle, History, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../css/dashboard.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const fullName = user?.fullName || user?.full_name || 'User';
  const role = user?.role === 'hostel_owner' ? 'Owner' : (user?.role || 'Owner');
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const navItems = [
    { path: '/owner-dashboard/my-hostels', icon: Home, label: 'My Hostels' },
    { path: '/owner-dashboard/add-hostel', icon: PlusCircle, label: 'Add New Hostel' },
    { path: '/owner-dashboard/user-history', icon: History, label: 'User History' },
    { path: '/owner-dashboard/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="dashboard-sidebar-logo">
          <div className="dashboard-sidebar-logo-container">
            <div className="dashboard-sidebar-logo-icon">
              <Home />
            </div>
            <h1 className="dashboard-sidebar-title">HostelHub</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="dashboard-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`dashboard-nav-link ${active ? 'dashboard-nav-link-active' : ''}`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="dashboard-sidebar-user">
          <div className="dashboard-sidebar-user-container">
            <div className="dashboard-sidebar-user-avatar">
              <span>{initials}</span>
            </div>
            <div className="dashboard-sidebar-user-info">
              <p className="dashboard-sidebar-user-name">{fullName}</p>
              <p className="dashboard-sidebar-user-role">{role}</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="dashboard-sidebar-logout">
          <button onClick={handleLogout} className="dashboard-logout-button">
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
};

export default Layout;