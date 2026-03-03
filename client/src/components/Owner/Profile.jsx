import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, MapPin } from 'lucide-react';
import useApi from '../../hooks/useApi';
import '../../css/dashboard.css';
import '../../css/profile.css';

const Profile = () => {
  const { put, loading } = useApi();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Get user data from localStorage
    const userString = localStorage.getItem('user');
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        console.log('👤 Loaded user:', user);
        
        const userData = {
          fullName: user.fullName || user.full_name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || user.phone_number || '',
          role: user.role || ''
        };
        
        setFormData(userData);
        setOriginalData(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    console.log('💾 Saving profile:', formData);
    
    try {
      // Update user in localStorage
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        const updatedUser = {
          ...user,
          fullName: formData.fullName,
          full_name: formData.fullName,
          phoneNumber: formData.phoneNumber,
          phone_number: formData.phoneNumber
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ Profile updated in localStorage');
        
        setOriginalData(formData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
      
      // TODO: Call API to update on server
      // const { data, error } = await put('/auth/update-profile', formData);
      
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  // Split fullName into first and last name
  const nameParts = formData.fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const handleFirstNameChange = (e) => {
    const newFirstName = e.target.value;
    setFormData(prev => ({
      ...prev,
      fullName: `${newFirstName} ${lastName}`.trim()
    }));
  };

  const handleLastNameChange = (e) => {
    const newLastName = e.target.value;
    setFormData(prev => ({
      ...prev,
      fullName: `${firstName} ${newLastName}`.trim()
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <h1 className="dashboard-header-title">Profile</h1>
          <div className="dashboard-header-actions">
            <div className="dashboard-search-wrapper">
              <Search className="dashboard-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="dashboard-search-input"
              />
            </div>
            <button className="dashboard-user-avatar">
              <span>👤</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-container">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <User size={40} />
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{formData.fullName || 'Owner Name'}</h2>
              <p className="profile-role">
                {formData.role === 'hostel_owner' ? 'Hostel Owner' : formData.role}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveChanges} className="profile-form">
            {/* Name Fields */}
            <div className="profile-grid">
              <div className="profile-form-group">
                <label className="profile-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  disabled={!isEditing}
                  className="profile-input"
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleLastNameChange}
                  disabled={!isEditing}
                  className="profile-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="profile-form-group">
              <label className="profile-label">Email</label>
              <div className="profile-input-wrapper">
                <Mail className="profile-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true}
                  className="profile-input profile-input-with-icon"
                  title="Email cannot be changed"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="profile-form-group">
              <label className="profile-label">Phone</label>
              <div className="profile-input-wrapper">
                <Phone className="profile-input-icon" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="profile-input profile-input-with-icon"
                />
              </div>
            </div>

            {/* Role (Read-only) */}
            <div className="profile-form-group">
              <label className="profile-label">Role</label>
              <div className="profile-input-wrapper">
                <User className="profile-input-icon" />
                <input
                  type="text"
                  value={formData.role === 'hostel_owner' ? 'Hostel Owner' : formData.role}
                  disabled={true}
                  className="profile-input profile-input-with-icon"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="profile-btn-edit"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="profile-btn-save"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="profile-btn-cancel"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;