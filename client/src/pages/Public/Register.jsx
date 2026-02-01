import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, Home } from 'lucide-react';
import registerSchema from '../../schema/register.schema';
import useApi from '../../hooks/useApi';
import '../../css/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { post, loading, error } = useApi();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setApiError('');
    setSuccessMessage('');

    const { confirmPassword, ...registerData } = data;

    const result = await post('/auth/register', registerData);

    if (result.error) {
      setApiError(result.error);
    } else {
      setSuccessMessage('Registration successful! Redirecting to login...');
      reset();
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-icon">
            <Home size={32} className="text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us and find your perfect stay</p>

        {/* Error/Success Messages */}
        {apiError && (
          <div className="error-message">
            {apiError}
          </div>
        )}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p className="error-text">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={20} />
              <input
                id="phoneNumber"
                type="tel"
                placeholder="+1 234 567 8900"
                className={`form-input ${errors.phoneNumber ? 'input-error' : ''}`}
                {...register('phoneNumber')}
              />
            </div>
            {errors.phoneNumber && (
              <p className="error-text">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Login Link */}
          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;