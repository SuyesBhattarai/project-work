import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, MapPin, Star, Edit, Trash2 } from 'lucide-react';
import useApi from '../../hooks/useApi';
import '../../css/dashboard.css';
import '../../css/my-hostel.css';

const MyHostels = () => {
  const { get, del, loading } = useApi();
  const [hostels, setHostels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchHostels();
    // Close menu when clicking anywhere else
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const fetchHostels = async () => {
    const { data } = await get('/hostels/my-hostels');
    if (data?.success) setHostels(data.data || []);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent closing menu immediately
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      const { data } = await del(`/hostels/${id}`);
      if (data?.success) {
        setHostels(prev => prev.filter(h => h.id !== id));
      }
    }
  };

  const filteredHostels = hostels.filter(hostel =>
    hostel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <h1 className="dashboard-header-title">My Hostels</h1>
          <div className="dashboard-header-actions">
            <div className="dashboard-search-wrapper">
              <Search className="dashboard-search-icon" />
              <input
                type="text"
                placeholder="Search hostels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dashboard-search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="dashboard-empty-state"><p>Loading hostels...</p></div>
        ) : filteredHostels.length > 0 ? (
          <div className="hostels-grid">
            {filteredHostels.map((hostel) => (
              <div key={hostel.id} className="hostel-card">
                <div className="hostel-image">
                  {hostel.images?.[0] && <img src={hostel.images[0]} alt={hostel.name} className="w-full h-full object-cover" />}
                </div>
                
                <div className="hostel-content">
                  <div className="hostel-header">
                    <div className="hostel-info">
                      <h3 className="hostel-name">{hostel.name}</h3>
                      <div className="hostel-location"><MapPin size={14} />{hostel.city}</div>
                    </div>

                    <div className="menu-container">
                      <button 
                        className="hostel-menu-button"
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === hostel.id ? null : hostel.id); }}
                      >
                        <MoreVertical />
                      </button>

                      {activeMenu === hostel.id && (
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={() => console.log("Edit", hostel.id)}>
                            <Edit size={14} /> Edit
                          </button>
                          <button className="dropdown-item dropdown-item-delete" onClick={(e) => handleDelete(e, hostel.id)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hostel-stats">
                    <div className="hostel-stat-box">
                      <p className="hostel-stat-label">Price</p>
                      <p className="hostel-stat-value">₹{hostel.price}</p>
                    </div>
                    <div className="hostel-stat-box">
                      <p className="hostel-stat-label">Beds</p>
                      <p className="hostel-stat-value">{hostel.totalBeds}</p>
                    </div>
                    <div className="hostel-stat-box">
                      <p className="hostel-stat-label">Occupancy</p>
                      <p className="hostel-stat-value">{hostel.occupancy || 0}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-state"><p>No hostels found.</p></div>
        )}
      </div>
    </>
  );
};

export default MyHostels;