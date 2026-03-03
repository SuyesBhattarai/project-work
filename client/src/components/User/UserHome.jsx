import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, BedDouble, Wifi, Car, Coffee, LogOut, Compass, BookOpen } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import BookingModal from './BookingModel';
import '../../css/user-home.css';

const UserHome = () => {
  const navigate = useNavigate();
  const { get } = useApi();

  const [hostels, setHostels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchHostels(); }, []);

  const fetchHostels = async () => {
    const { data } = await get('/hostels/all');
    if (data && data.success) setHostels(data.data || []);
    setLoading(false);
  };

  const handleBookNow = (hostel) => {
    setSelectedHostel(hostel);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedHostel(null);
    alert('✅ Booking confirmed! Check "My Bookings" to view details.');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredHostels = hostels.filter(h =>
    h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAmenityIcon = (a) => {
    if (a.toLowerCase() === 'wifi') return <Wifi size={11} />;
    if (a.toLowerCase() === 'parking') return <Car size={11} />;
    if (a.toLowerCase() === 'breakfast') return <Coffee size={11} />;
    return null;
  };

  return (
    <div className="uh-layout">

      {/* ── Sidebar ── */}
      <aside className="uh-sidebar">

        {/* Brand */}
        <div className="uh-brand">
          <div className="uh-brand-icon">
            <BedDouble size={18} />
          </div>
          <div className="uh-brand-text">
            <p className="uh-brand-name">StayEasy</p>
            <p className="uh-brand-sub">Find your stay</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="uh-nav">
          <p className="uh-nav-section">Menu</p>

          <NavLink to="/dashboard" end
            className={({ isActive }) => `uh-link ${isActive ? 'uh-link-active' : 'uh-link-inactive'}`}>
            <Compass size={20} className="uh-link-icon" />
            <span>Discover</span>
          </NavLink>

          <NavLink to="/user-bookings"
            className={({ isActive }) => `uh-link ${isActive ? 'uh-link-active' : 'uh-link-inactive'}`}>
            <BookOpen size={20} className="uh-link-icon" />
            <span>My Bookings</span>
          </NavLink>
        </nav>

        {/* User Footer */}
        <div className="uh-footer">
          <div className="uh-user-row">
            <div className="uh-avatar">
              {user.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="uh-user-info">
              <p className="uh-user-name">{user.fullName || 'User'}</p>
              <p className="uh-user-email">{user.email || ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="uh-logout">
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="uh-main">

        {/* Topbar with Search */}
        <div className="uh-topbar">
          <div className="uh-search-wrap">
            <Search size={16} className="uh-search-icon" />
            <input
              type="text"
              placeholder="Search hostels by name or location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="uh-search-input"
            />
          </div>
        </div>

        {/* Content */}
        <main className="uh-content">
          <div className="uh-page-head">
            <h2 className="uh-page-title">Discover Hostels</h2>
            <p className="uh-page-sub">{filteredHostels.length} hostels available</p>
          </div>

          {loading ? (
            <div className="uh-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="uh-skel-card">
                  <div className="uh-skel-img" />
                  <div className="uh-skel-body">
                    <div className="uh-sk uh-sk-title" />
                    <div className="uh-sk uh-sk-line" />
                    <div className="uh-sk uh-sk-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHostels.length > 0 ? (
            <div className="uh-grid">
              {filteredHostels.map(hostel => {
                const amenitiesObj = typeof hostel.amenities === 'string'
                  ? JSON.parse(hostel.amenities) : hostel.amenities || {};
                const amenitiesList = Object.entries(amenitiesObj)
                  .filter(([_, v]) => v).map(([k]) => k);
                const images = hostel.images || [];

                return (
                  <div key={hostel.id} className="uh-card">
                    <div className="uh-card-img-wrap">
                      {images.length > 0 && images[0] ? (
                        <img src={images[0]} alt={hostel.name} className="uh-card-img" />
                      ) : (
                        <div className="uh-img-placeholder">
                          <BedDouble size={40} />
                        </div>
                      )}
                      <div className="uh-price-tag">₹{hostel.price}/night</div>
                    </div>

                    <div className="uh-card-body">
                      <h3 className="uh-card-title">{hostel.name}</h3>

                      <div className="uh-card-location">
                        <MapPin size={13} />
                        <span>{hostel.city}, <span className="uh-country">India</span></span>
                      </div>

                      <div className="uh-card-meta">
                        <div className="uh-rating">
                          <Star size={13} className="uh-star" />
                          <span>{parseFloat(hostel.rating || 0).toFixed(1)}</span>
                        </div>
                        <div className="uh-beds">
                          <BedDouble size={13} />
                          <span>{hostel.availableBeds || hostel.totalBeds} beds</span>
                        </div>
                      </div>

                      {amenitiesList.length > 0 && (
                        <div className="uh-amenities">
                          {amenitiesList.slice(0, 3).map((a, i) => (
                            <span key={i} className="uh-amenity">
                              {getAmenityIcon(a)} {a}
                            </span>
                          ))}
                          {amenitiesList.length > 3 && (
                            <span className="uh-amenity">+{amenitiesList.length - 3}</span>
                          )}
                        </div>
                      )}

                      <p className="uh-owner">Listed by {hostel.ownerName || 'Owner'}</p>

                      <button onClick={() => handleBookNow(hostel)} className="uh-book-btn">
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="uh-empty">
              <BedDouble size={48} className="uh-empty-icon" />
              <p>No hostels found</p>
            </div>
          )}
        </main>
      </div>

      {showBookingModal && selectedHostel && (
        <BookingModal
          hostel={selectedHostel}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default UserHome;