import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Mail, Phone, BedDouble, LogOut, Compass, BookOpen } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import '../../css/user-booking.css';

const UserBookings = () => {
  const navigate = useNavigate();
  const { get, loading } = useApi();

  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const { data } = await get('/bookings/my-bookings');
    if (data && data.success) setBookings(data.data || []);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredBookings = bookings.filter(b =>
    b.hostelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="ub-layout">

      {/* ── Sidebar ── */}
      <aside className="ub-sidebar">

        <div className="ub-brand">
          <div className="ub-brand-icon"><BedDouble size={18} /></div>
          <div className="ub-brand-text">
            <p className="ub-brand-name">StayEasy</p>
            <p className="ub-brand-sub">Find your stay</p>
          </div>
        </div>

        <nav className="ub-nav">
          <p className="ub-nav-section">Menu</p>

          <NavLink to="/dashboard" end
            className={({ isActive }) => `ub-link ${isActive ? 'ub-link-active' : 'ub-link-inactive'}`}>
            <Compass size={20} className="ub-link-icon" />
            <span>Discover</span>
          </NavLink>

          <NavLink to="/user-bookings"
            className={({ isActive }) => `ub-link ${isActive ? 'ub-link-active' : 'ub-link-inactive'}`}>
            <BookOpen size={20} className="ub-link-icon" />
            <span>My Bookings</span>
          </NavLink>
        </nav>

        <div className="ub-footer">
          <div className="ub-user-row">
            <div className="ub-avatar">{user.fullName?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="ub-user-info">
              <p className="ub-user-name">{user.fullName || 'User'}</p>
              <p className="ub-user-email">{user.email || ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="ub-logout">
            <LogOut size={15} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="ub-main">

        {/* Topbar */}
        <div className="ub-topbar">
          <div className="ub-search-wrap">
            <Search size={16} className="ub-search-icon" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="ub-search-input"
            />
          </div>
        </div>

        {/* Content */}
        <main className="ub-content">
          <h2 className="ub-page-title">My Bookings</h2>

          {loading ? (
            <div className="ub-loading">
              {[1,2,3].map(i => (
                <div key={i} className="ub-skel-card">
                  <div className="ub-skel-img" />
                  <div className="ub-skel-body">
                    <div className="ub-sk ub-sk-title" />
                    <div className="ub-sk ub-sk-line" />
                    <div className="ub-sk ub-sk-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="ub-list">
              {filteredBookings.map(booking => {
                const images = booking.hostelImages || [];
                const status = booking.status || 'confirmed';

                return (
                  <div key={booking.id} className="ub-card">
                    {/* Image */}
                    <div className="ub-card-img-wrap">
                      {images.length > 0 && images[0] ? (
                        <img src={images[0]} alt={booking.hostelName} className="ub-card-img" />
                      ) : (
                        <div className="ub-img-placeholder"><BedDouble size={32} /></div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="ub-card-body">
                      <div className="ub-card-head">
                        <h3 className="ub-card-title">{booking.hostelName}</h3>
                        <span className={`ub-status ub-status-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </div>

                      <div className="ub-info-grid">
                        <div className="ub-info-item">
                          <Calendar size={15} className="ub-info-icon" />
                          <span>{formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}</span>
                        </div>
                        <div className="ub-info-item">
                          <Phone size={15} className="ub-info-icon" />
                          <span>{booking.phoneNumber}</span>
                        </div>
                        <div className="ub-info-item">
                          <Mail size={15} className="ub-info-icon" />
                          <span>{booking.email}</span>
                        </div>
                        <div className="ub-info-item">
                          <MapPin size={15} className="ub-info-icon" />
                          <span>{booking.address}</span>
                        </div>
                      </div>

                      <div className="ub-card-footer">
                        <div className="ub-detail">
                          <span className="ub-detail-label">Beds</span>
                          <span className="ub-detail-val">{booking.numberOfBeds}</span>
                        </div>
                        <div className="ub-detail">
                          <span className="ub-detail-label">Total</span>
                          <span className="ub-detail-val ub-total">₹{Number(booking.totalAmount).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ub-empty">
              <BookOpen size={48} className="ub-empty-icon" />
              <p className="ub-empty-text">No bookings yet</p>
              <button onClick={() => navigate('/dashboard')} className="ub-browse-btn">
                Browse Hostels
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserBookings;