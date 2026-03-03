import React, { useState } from 'react';
import { X } from 'lucide-react';
import useApi from '../../hooks/useApi';
import '../../css/booking-model.css';

const BookingModal = ({ hostel, onClose, onSuccess }) => {
  const { post, loading } = useApi();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfBeds: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalAmount = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    const pricePerNight = hostel.price || 0;
    return nights * pricePerNight * formData.numberOfBeds;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Submitting booking...', formData);

    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.email || 
        !formData.address || !formData.checkInDate || !formData.checkOutDate) {
      alert('Please fill all fields');
      return;
    }

    const totalAmount = calculateTotalAmount();
    
    if (totalAmount <= 0) {
      alert('Please select valid check-in and check-out dates');
      return;
    }

    try {
      const bookingData = {
        hostelId: hostel.id,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfBeds: parseInt(formData.numberOfBeds),
        totalAmount: totalAmount
      };

      const { data, error } = await post('/bookings/create', bookingData);

      if (error) {
        console.error('❌ Booking error:', error);
        alert('Failed to create booking: ' + error);
        return;
      }

      if (data && data.success) {
        console.log('✅ Booking created:', data.data);
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
      alert('Error creating booking');
    }
  };

  const totalAmount = calculateTotalAmount();
  const pricePerNight = hostel.price || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Book {hostel.name}</h2>
            <p className="modal-subtitle">₹{pricePerNight}/night · {hostel.city}, India</p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Phone & Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="1234567890"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your address"
              required
            />
          </div>

          {/* Check-in & Check-out */}
          <div className="form-row">
            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Number of Beds */}
          <div className="form-group">
            <label>Number of Beds</label>
            <input
              type="number"
              name="numberOfBeds"
              value={formData.numberOfBeds}
              onChange={handleChange}
              min="1"
              max={hostel.availableBeds || hostel.totalBeds || 10}
              required
            />
          </div>

          {/* Total Amount */}
          {totalAmount > 0 && (
            <div className="total-amount">
              <span>Total Amount:</span>
              <strong>₹{totalAmount.toLocaleString()}</strong>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;