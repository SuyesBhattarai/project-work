import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar } from 'lucide-react';
import useApi from '../../hooks/useApi';
import '../../css/dashboard.css';
import '../../css/user-history.css';

const UserHistory = () => {
  const { get, loading } = useApi();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    console.log('📡 Fetching bookings from API...');
    
    const { data, error } = await get('/bookings/owner-bookings');
    
    if (error) {
      console.error('❌ Error fetching bookings:', error);
      // Show empty state instead of error
      setBookings([]);
      return;
    }
    
    if (data && data.success) {
      console.log('✅ Bookings loaded:', data.data);
      setBookings(data.data || []);
    }
  };

  const totalBookings = bookings.length;
  const activeStays = bookings.filter(b => b.status === 'active').length;

  const filteredBookings = bookings.filter(booking =>
    booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.hostel_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'history-status-completed';
      case 'active':
      case 'confirmed':
        return 'history-status-active';
      case 'cancelled':
        return 'history-status-cancelled';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <h1 className="dashboard-header-title">User History</h1>
          <div className="dashboard-header-actions">
            <div className="dashboard-search-wrapper">
              <Search className="dashboard-search-icon" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dashboard-search-input"
              />
            </div>
            <button className="dashboard-user-avatar">
              <span>👤</span>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Summary Cards */}
        <div className="history-summary-grid">
          {/* Total Bookings */}
          <div className="history-summary-card">
            <div className="history-summary-content">
              <div className="history-summary-icon history-summary-icon-bookings">
                <FileText />
              </div>
              <div className="history-summary-info">
                <p className="history-summary-label">Total Bookings</p>
                <p className="history-summary-value">{totalBookings}</p>
              </div>
            </div>
          </div>

          {/* Active Stays */}
          <div className="history-summary-card">
            <div className="history-summary-content">
              <div className="history-summary-icon history-summary-icon-stays">
                <Calendar />
              </div>
              <div className="history-summary-info">
                <p className="history-summary-label">Active Stays</p>
                <p className="history-summary-value">{activeStays}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="history-empty">
            <p className="history-empty-text">Loading bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="history-table-container">
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Hostel</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div className="history-table-user">
                          {booking.user_name}
                        </div>
                      </td>
                      <td>
                        <div className="history-table-hostel">
                          {booking.hostel_name}
                        </div>
                      </td>
                      <td>
                        <div className="history-table-date">
                          {new Date(booking.check_in_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="history-table-date">
                          {new Date(booking.check_out_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="history-table-amount">
                          ₹{Number(booking.total_amount).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <span className={`history-status-badge ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="history-empty">
            <p className="history-empty-text">
              {searchTerm ? 'No bookings found matching your search' : 'No bookings yet'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserHistory;