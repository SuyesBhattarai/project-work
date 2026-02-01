import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import useApi from '../../hooks/useApi';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import '../../css/Login.css';

// Login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { post, loading, error } = useApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    const result = await post('/auth/login', data);
    
    if (result.data) {
      // Store access token and refresh token
      localStorage.setItem('accessToken', result.data.accessToken);
      if (result.data.refreshToken) {
        localStorage.setItem('refreshToken', result.data.refreshToken);
      }
      
      // Store user data if provided
      if (result.data.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      {/* Animated background */}
      <div className="login-background">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {/* Login Card */}
      <div className="login-wrapper">
        <div className="login-card">
          {/* Logo */}
          <div className="login-logo">
            <div className="logo-container">
              <img 
                src="/hamro_hostel.png" 
                alt="Hamro Hostel" 
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="logo-fallback">
                <Lock size={40} />
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="login-header">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Enter your credentials to access your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-password-wrapper">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">or</span>
          </div>

          {/* Sign Up Link */}
          <div className="signup-section">
            <p className="signup-text">
              Don't have an account?{' '}
              <Link to="/register" className="signup-link">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="decorative-blob decorative-blob-1"></div>
        <div className="decorative-blob decorative-blob-2"></div>
      </div>
    </div>
  );
};

export default Login;