import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Home, UserCheck, UserX, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';
import axios from 'axios';
import '../../css/admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalOwners: 0, activeUsers: 0, inactiveUsers: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No access token found.');
        setTimeout(() => navigate('/admin-login'), 2000);
        return;
      }
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/admin/recent-users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setRecentUsers(usersRes.data.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Redirecting...');
        setTimeout(() => navigate('/admin-login'), 2000);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      }
      setLoading(false);
    }
  };

  const activeRate = stats.totalUsers + stats.totalOwners > 0
    ? Math.min(((stats.activeUsers / (stats.totalUsers + stats.totalOwners)) * 100), 100).toFixed(0)
    : 0;

  if (error) {
    return (
      <div className="db-error-wrap">
        <div className="db-error-card">
          <span className="db-error-emoji">⚠️</span>
          <h3 className="db-error-title">Something went wrong</h3>
          <p className="db-error-msg">{error}</p>
          <div className="db-error-btns">
            <button onClick={fetchDashboardData} className="db-btn-retry">
              <RefreshCw size={14} /> Retry
            </button>
            <button onClick={() => navigate('/admin-login')} className="db-btn-back">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="db-page">

      {/* Header */}
      <div className="db-header">
        <div>
          <h1 className="db-title">Dashboard</h1>
          <p className="db-subtitle">Welcome back, Admin! Here's your platform overview.</p>
        </div>
        <button onClick={fetchDashboardData} className="db-refresh">
          <RefreshCw size={15} className={loading ? 'db-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="db-stats-grid">
        <div className="db-stat-card db-stat-blue">
          <div className="db-stat-icon db-icon-blue"><Users size={22} /></div>
          <div>
            <p className="db-stat-label">Total Users</p>
            {loading ? <div className="db-stat-skel" /> : <p className="db-stat-val">{stats.totalUsers}</p>}
          </div>
        </div>
        <div className="db-stat-card db-stat-purple">
          <div className="db-stat-icon db-icon-purple"><Home size={22} /></div>
          <div>
            <p className="db-stat-label">Hostel Owners</p>
            {loading ? <div className="db-stat-skel" /> : <p className="db-stat-val">{stats.totalOwners}</p>}
          </div>
        </div>
        <div className="db-stat-card db-stat-green">
          <div className="db-stat-icon db-icon-green"><UserCheck size={22} /></div>
          <div>
            <p className="db-stat-label">Active Members</p>
            {loading ? <div className="db-stat-skel" /> : <p className="db-stat-val">{stats.activeUsers}</p>}
          </div>
        </div>
        <div className="db-stat-card db-stat-red">
          <div className="db-stat-icon db-icon-red"><UserX size={22} /></div>
          <div>
            <p className="db-stat-label">Inactive</p>
            {loading ? <div className="db-stat-skel" /> : <p className="db-stat-val">{stats.inactiveUsers}</p>}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="db-grid">

        {/* Recent Users */}
        <div className="db-card">
          <div className="db-card-head">
            <div>
              <h2 className="db-card-title">Recent Users</h2>
              <p className="db-card-sub">Latest registered members</p>
            </div>
            <button onClick={() => navigate('/admin-dashboard/users-owners')} className="db-view-all">
              View All <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="db-skel-list">
              {[1,2,3,4].map(i => (
                <div key={i} className="db-skel-row">
                  <div className="db-skel-av" />
                  <div className="db-skel-lines">
                    <div className="db-skel-line db-skel-s" />
                    <div className="db-skel-line db-skel-l" />
                  </div>
                  <div className="db-skel-badge" />
                </div>
              ))}
            </div>
          ) : recentUsers.length > 0 ? (
            <div className="db-user-list">
              {recentUsers.map(user => (
                <div key={user.id} className="db-user-row">
                  <div className={`db-user-av ${user.role === 'hostel_owner' ? 'db-av-purple' : 'db-av-blue'}`}>
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="db-user-info">
                    <p className="db-user-name">{user.fullName}</p>
                    <p className="db-user-email">{user.email}</p>
                  </div>
                  <span className={`db-badge ${user.role === 'hostel_owner' ? 'db-badge-purple' : 'db-badge-blue'}`}>
                    {user.role === 'hostel_owner' ? 'Owner' : 'User'}
                  </span>
                  <span className="db-badge-active">Active</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="db-empty">
              <Users size={40} className="db-empty-icon" />
              <p>No users registered yet</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="db-summary">
          <h2 className="db-card-title">Quick Summary</h2>
          <p className="db-card-sub">Platform at a glance</p>

          <div className="db-sum-list">
            <div className="db-sum-row db-sum-blue">
              <div className="db-sum-icon db-sum-icon-blue"><Users size={17} /></div>
              <div className="db-sum-text">
                <p className="db-sum-label">Total Users</p>
                <p className="db-sum-val">{loading ? '—' : stats.totalUsers}</p>
              </div>
              <TrendingUp size={15} className="db-sum-trend" />
            </div>

            <div className="db-sum-row db-sum-purple">
              <div className="db-sum-icon db-sum-icon-purple"><Home size={17} /></div>
              <div className="db-sum-text">
                <p className="db-sum-label">Hostel Owners</p>
                <p className="db-sum-val">{loading ? '—' : stats.totalOwners}</p>
              </div>
              <TrendingUp size={15} className="db-sum-trend" />
            </div>

            <div className="db-sum-row db-sum-green">
              <div className="db-sum-icon db-sum-icon-green"><UserCheck size={17} /></div>
              <div className="db-sum-text">
                <p className="db-sum-label">Active Rate</p>
                <p className="db-sum-val">{loading ? '—' : `${activeRate}%`}</p>
              </div>
              <span className="db-live">LIVE</span>
            </div>
          </div>

          {!loading && (
            <div className="db-progress">
              <div className="db-progress-head">
                <span className="db-progress-label">Platform Utilization</span>
                <span className="db-progress-val">{activeRate}%</span>
              </div>
              <div className="db-progress-track">
                <div className="db-progress-fill" style={{ width: `${activeRate}%` }} />
              </div>
            </div>
          )}

          <button onClick={() => navigate('/admin-dashboard/users-owners')} className="db-manage-btn">
            Manage Users & Owners <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;