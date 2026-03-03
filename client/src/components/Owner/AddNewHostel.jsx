import React, { useState } from 'react';
import { Search, Upload, Wifi, Car, Coffee, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import '../../css/dashboard.css';
import '../../css/add-hostel.css';

const AddNewHostel = () => {
  const navigate = useNavigate();
  const { post, loading } = useApi();
  
  const [formData, setFormData] = useState({
    hostelName: '',
    city: '',
    price: '',
    address: '',
    description: '',
    totalBeds: '',
    amenities: {
      wifi: false,
      parking: false,
      breakfast: false
    },
    photos: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('📸 Photos selected:', files.length);
    setFormData(prev => ({
      ...prev,
      photos: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Submitting hostel form...');

    // Validation
    if (!formData.hostelName || !formData.city || !formData.price || !formData.address) {
      alert('Please fill all required fields');
      return;
    }

    try {
      // Create FormData for file upload
      const form = new FormData();
      
      form.append('name', formData.hostelName);
      form.append('city', formData.city);
      form.append('price', formData.price);
      form.append('address', formData.address);
      form.append('description', formData.description || '');
      form.append('amenities', JSON.stringify(formData.amenities));
      form.append('totalBeds', formData.totalBeds || '10');

      // Append images
      formData.photos.forEach((photo) => {
        form.append('images', photo);
      });

      console.log('📤 Sending to API...');

      const { data, error } = await post('/hostels/create', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (error) {
        console.error('❌ Error:', error);
        alert('Failed to add hostel: ' + error);
        return;
      }

      if (data && data.success) {
        console.log('✅ Hostel created:', data.data);
        alert('Hostel added successfully!');
        
        // Reset form
        setFormData({
          hostelName: '',
          city: '',
          price: '',
          address: '',
          description: '',
          totalBeds: '',
          amenities: { wifi: false, parking: false, breakfast: false },
          photos: []
        });
        
        // Navigate to my hostels
        navigate('/owner-dashboard/my-hostels');
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
      alert('Failed to add hostel');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <h1 className="dashboard-header-title">Add New Hostel</h1>
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

      {/* Form Container */}
      <div className="add-hostel-container">
        <div className="add-hostel-card">
          <h2 className="add-hostel-title">Hostel Details</h2>
          
          <form onSubmit={handleSubmit} className="add-hostel-form">
            {/* Hostel Name */}
            <div className="add-hostel-form-group">
              <label className="add-hostel-label">Hostel Name *</label>
              <input
                type="text"
                name="hostelName"
                value={formData.hostelName}
                onChange={handleInputChange}
                placeholder="Enter hostel name"
                className="add-hostel-input"
                required
              />
            </div>

            {/* City and Price */}
            <div className="add-hostel-grid">
              <div className="add-hostel-form-group">
                <label className="add-hostel-label">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="add-hostel-input"
                  required
                />
              </div>
              <div className="add-hostel-form-group">
                <label className="add-hostel-label">Price / Night (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="500"
                  className="add-hostel-input"
                  required
                />
              </div>
            </div>

            {/* Total Beds */}
            <div className="add-hostel-form-group">
              <label className="add-hostel-label">Total Beds</label>
              <input
                type="number"
                name="totalBeds"
                value={formData.totalBeds}
                onChange={handleInputChange}
                placeholder="10"
                className="add-hostel-input"
              />
            </div>

            {/* Address */}
            <div className="add-hostel-form-group">
              <label className="add-hostel-label">Address *</label>
              <div className="add-hostel-icon-wrapper">
                <MapPin className="add-hostel-icon" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full address"
                  className="add-hostel-input add-hostel-input-with-icon"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="add-hostel-form-group">
              <label className="add-hostel-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your hostel..."
                rows="4"
                className="add-hostel-textarea"
              />
            </div>

            {/* Amenities */}
            <div className="add-hostel-form-group">
              <label className="add-hostel-amenities-label">Amenities</label>
              <div className="add-hostel-amenities-grid">
                <button
                  type="button"
                  onClick={() => handleAmenityToggle('wifi')}
                  className={`add-hostel-amenity-button ${
                    formData.amenities.wifi
                      ? 'add-hostel-amenity-button-active'
                      : 'add-hostel-amenity-button-default'
                  }`}
                >
                  <Wifi />
                  <span>WiFi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAmenityToggle('parking')}
                  className={`add-hostel-amenity-button ${
                    formData.amenities.parking
                      ? 'add-hostel-amenity-button-active'
                      : 'add-hostel-amenity-button-default'
                  }`}
                >
                  <Car />
                  <span>Parking</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAmenityToggle('breakfast')}
                  className={`add-hostel-amenity-button ${
                    formData.amenities.breakfast
                      ? 'add-hostel-amenity-button-active'
                      : 'add-hostel-amenity-button-default'
                  }`}
                >
                  <Coffee />
                  <span>Breakfast</span>
                </button>
              </div>
            </div>

            {/* Photos */}
            <div className="add-hostel-form-group">
              <label className="add-hostel-upload-label">Photos</label>
              <div className="add-hostel-upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="add-hostel-upload-input"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" style={{ cursor: 'pointer', width: '100%', textAlign: 'center' }}>
                  <Upload className="add-hostel-upload-icon" />
                  <p className="add-hostel-upload-text">
                    {formData.photos.length > 0 
                      ? `${formData.photos.length} photo(s) selected` 
                      : 'Click to upload images'
                    }
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="add-hostel-submit"
              disabled={loading}
            >
              {loading ? 'Adding Hostel...' : 'Add Hostel'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewHostel;