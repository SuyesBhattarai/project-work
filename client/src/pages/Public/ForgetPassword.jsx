import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, Loader2, Home } from 'lucide-react';
import forgetPasswordSchema from '../../schema/forgetpassword.schema';
import useApi from '../../hooks/useApi';
import '../../css/forgetPassword.css';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { post, loading } = useApi();
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
    resolver: zodResolver(forgetPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (formData) => {
    setApiError('');
    setSuccessMessage('');

    console.log('Submitting password reset:', formData);

    const result = await post('/auth/forgot-password', {
      email: formData.email,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    console.log('Forgot password result:', result);

    if (result.error) {
      setApiError(result.error);
      return;
    }

    setSuccessMessage('Password reset successful! Redirecting to login...');
    reset();

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-card">
        {/* Logo */}
        <div className="forget-password-logo">
          <div className="forget-password-logo-icon">
            <Home size={32} />
          </div>
        </div>

        {/* Title */}
        <h1 className="forget-password-title">Reset Password</h1>
        <p className="forget-password-subtitle">
          Enter your email and create a new password
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="alert-success">{successMessage}</div>
        )}

        {/* Error Message */}
        {apiError && <div className="alert-error">{apiError}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="forget-password-form">
          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className="form-input"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('newPassword')}
                placeholder="••••••••"
                className="form-input-with-toggle"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="password-toggle-icon" />
                ) : (
                  <Eye className="password-toggle-icon" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="form-error">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="form-input-with-toggle"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle-btn"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="password-toggle-icon" />
                ) : (
                  <Eye className="password-toggle-icon" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="form-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="submit-btn"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                <span>Resetting Password...</span>
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="back-link-wrapper">
          <span>Remember your password? </span>
          <Link to="/login" className="back-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;