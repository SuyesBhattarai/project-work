import React, { useState, useEffect } from 'react';
import { Search, Trash2, Users, Home, RefreshCw, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import '../../css/users-owners.css';

const UsersOwners = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      if (!token) { setError('No access token found.'); setLoading(false); return; }
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        setError('Failed to fetch users');
      }
      setLoading(false);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') setError('Cannot connect to server.');
      else if (err.response?.status === 401) {
        setError('Session expired.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setTimeout(() => { window.location.href = '/admin-login'; }, 2000);
      } else if (err.response?.status === 403) setError('No admin access.');
      else setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      setDeletingId(userId);
      const token = localStorage.getItem('accessToken');
      const res = await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = !searchTerm ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterType === 'all' ||
      (filterType === 'user' && user.role === 'user') ||
      (filterType === 'owner' && user.role === 'hostel_owner');
    return matchSearch && matchFilter;
  });

  const userCount  = users.filter(u => u.role === 'user').length;
  const ownerCount = users.filter(u => u.role === 'hostel_owner').length;

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (error) {
    return (
      <div className="uo-error-wrap">
        <div className="uo-error-card">
          <AlertTriangle size={30} className="uo-error-icon" />
          <h3 className="uo-error-title">Error Loading Users</h3>
          <p className="uo-error-msg">{error}</p>
          <button onClick={fetchUsers} className="uo-retry-btn">
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="uo-page">

      {/* Header */}
      <div className="uo-header">
        <div>
          <h1 className="uo-title">Users & Owners</h1>
          <p className="uo-subtitle">Manage all registered members on the platform</p>
        </div>
        <div className="uo-header-right">
          <div className="uo-count uo-count-blue">
            <Users size={14} />
            <span>{userCount} Users</span>
          </div>
          <div className="uo-count uo-count-purple">
            <Home size={14} />
            <span>{ownerCount} Owners</span>
          </div>
          <button onClick={fetchUsers} className="uo-icon-btn" title="Refresh">
            <RefreshCw size={16} className={loading ? 'uo-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="uo-card">

        {/* Toolbar */}
        <div className="uo-toolbar">
          <div>
            <h2 className="uo-card-title">All Members</h2>
            <p className="uo-card-sub">Total: {users.length} ({userCount} users, {ownerCount} owners)</p>
          </div>
          <div className="uo-controls">
            <div className="uo-search-wrap">
              <Search size={15} className="uo-search-icon" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="uo-search"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="uo-select"
            >
              <option value="all">All ({users.length})</option>
              <option value="user">Users ({userCount})</option>
              <option value="owner">Owners ({ownerCount})</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="uo-skel-wrap">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="uo-skel-row">
                <div className="uo-sk uo-sk-av" />
                <div className="uo-sk-lines">
                  <div className="uo-sk uo-sk-s" />
                  <div className="uo-sk uo-sk-l" />
                </div>
                <div className="uo-sk uo-sk-badge" />
                <div className="uo-sk uo-sk-badge" />
                <div className="uo-sk uo-sk-btn" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="uo-table-wrap">
            <table className="uo-table">
              <thead>
                <tr className="uo-thead-row">
                  <th className="uo-th">Member</th>
                  <th className="uo-th">Email</th>
                  <th className="uo-th">Phone</th>
                  <th className="uo-th">Type</th>
                  <th className="uo-th">Joined</th>
                  <th className="uo-th">Status</th>
                  <th className="uo-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="uo-tr">
                    <td className="uo-td">
                      <div className="uo-member">
                        <div className={`uo-av ${user.role === 'hostel_owner' ? 'uo-av-purple' : 'uo-av-blue'}`}>
                          {user.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="uo-name">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="uo-td uo-muted">{user.email}</td>
                    <td className="uo-td uo-muted">{user.phoneNumber || 'N/A'}</td>
                    <td className="uo-td">
                      <span className={`uo-type ${user.role === 'hostel_owner' ? 'uo-type-purple' : 'uo-type-blue'}`}>
                        {user.role === 'hostel_owner' ? 'Owner' : 'User'}
                      </span>
                    </td>
                    <td className="uo-td uo-muted">{formatDate(user.createdAt)}</td>
                    <td className="uo-td">
                      <span className="uo-status">
                        <span className="uo-status-dot" /> Active
                      </span>
                    </td>
                    <td className="uo-td">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={user.role === 'admin' || deletingId === user.id}
                        className={`uo-del ${user.role === 'admin' ? 'uo-del-disabled' : ''}`}
                      >
                        {deletingId === user.id
                          ? <RefreshCw size={13} className="uo-spin" />
                          : <Trash2 size={13} />}
                        {deletingId === user.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="uo-empty">
            <Users size={44} className="uo-empty-icon" />
            <p className="uo-empty-text">
              {searchTerm || filterType !== 'all' ? 'No members match your filters' : 'No users registered yet'}
            </p>
            {(searchTerm || filterType !== 'all') && (
              <button onClick={() => { setSearchTerm(''); setFilterType('all'); }} className="uo-clear">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        {!loading && filteredUsers.length > 0 && (
          <div className="uo-footer">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> members
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersOwners;