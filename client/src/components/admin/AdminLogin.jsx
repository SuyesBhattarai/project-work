import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import axios from 'axios';
import '../../css/admin-login.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Call your backend /api/auth/login with admin credentials
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.accessToken && response.data.user.role === 'admin') {
        // Store admin token
        localStorage.setItem('accessToken', response.data.accessToken); // For auth
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('✅ Admin login successful');
        navigate('/admin-dashboard'); // ✅ CORRECT route
      } else {
        setError('You are not authorized as admin');
      }
    } catch (err) {
      console.error('❌ Admin login error:', err);
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {/* Logo/Header */}
        <div className="admin-login-header">
          <div className="admin-icon">
            <Lock size={32} />
          </div>
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">Management Dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="admin-form-group">
            <label>Admin Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@hostel.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="admin-form-group">
            <label>Admin Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="admin-submit-btn"
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        {/* Default Credentials Hint */}
        <div className="admin-hint">
          <p className="hint-title">Default Credentials:</p>
          <p className="hint-text">Email: admin@hostel.com</p>
          <p className="hint-text">Password: Admin@1234</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;