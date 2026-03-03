import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, User, Mail, Phone,
  Lock, Mountain, ArrowRight, ChevronDown,
} from 'lucide-react';
import registerSchema from '../../schema/register.schema';
import useApi from '../../hooks/useApi';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { post, loading } = useApi();

  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError]                       = useState('');
  const [successMessage, setSuccessMessage]           = useState('');

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

    const result = await post('/auth/register', {
      fullName:        data.fullName,
      email:           data.email,
      phoneNumber:     data.phoneNumber,
      password:        data.password,
      confirmPassword: data.confirmPassword,
      role:            data.role || 'user',
    });

    if (result.error) {
      setApiError(result.error);
      return;
    }

    if (result.data) {
      const user = result.data.user;

      // ── Native browser alert popup ──────────────────────────────────────
      window.alert(
        `✅ Account Created Successfully!\n\n` +
        `Name:   ${user.fullName ?? data.fullName}\n` +
        `Email:  ${user.email}\n` +
        `Role:   ${user.role}`
      );
      // ────────────────────────────────────────────────────────────────────

      setSuccessMessage(
        `✅ Account Created!\nEmail: ${user.email}  |  Role: ${user.role}\n\nRedirecting to login...`
      );
      reset();
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  // Block non-digit keys on phone field
  const handlePhoneKeyDown = (e) => {
    const allowed = [
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End',
    ];
    if (allowed.includes(e.key)) return;
    if (/^\d$/.test(e.key)) return;
    e.preventDefault();
  };

  // Strip non-digits on paste
  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 10);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call(e.target, pasted);
    e.target.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <div className="register-card">

      {/* Logo — mobile only */}
      <div className="register-logo">
        <div className="register-logo-icon">
          <Mountain />
        </div>
      </div>

      {/* Title */}
      <h1 className="register-title">Create Account</h1>
      <p className="register-subtitle">Join Hamro Hostel and start your journey</p>

      {/* API Messages */}
      {apiError       && <div className="register-error-message">{apiError}</div>}
      {successMessage && <div className="register-success-message">{successMessage}</div>}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">

        {/* Full Name */}
        <div className="register-form-group">
          <label className="register-form-label">Full Name</label>
          <div className="register-input-wrapper">
            <User className="register-input-icon" size={16} />
            <input
              type="text"
              placeholder="Ram Sharma"
              className={`register-input ${errors.fullName ? 'register-input-error' : ''}`}
              {...register('fullName')}
              disabled={loading}
            />
          </div>
          {errors.fullName && (
            <p className="register-error-text">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="register-form-group">
          <label className="register-form-label">Email Address</label>
          <div className="register-input-wrapper">
            <Mail className="register-input-icon" size={16} />
            <input
              type="email"
              placeholder="ram@example.com"
              className={`register-input ${errors.email ? 'register-input-error' : ''}`}
              {...register('email')}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="register-error-text">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="register-form-group">
          <label className="register-form-label">Phone Number</label>
          <div className="register-input-wrapper">
            <Phone className="register-input-icon" size={16} />
            <input
              type="tel"
              placeholder="98XXXXXXXX"
              maxLength={10}
              className={`register-input ${errors.phoneNumber ? 'register-input-error' : ''}`}
              {...register('phoneNumber')}
              onKeyDown={handlePhoneKeyDown}
              onPaste={handlePhonePaste}
              disabled={loading}
            />
          </div>
          {errors.phoneNumber && (
            <p className="register-error-text">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Password + Confirm — side by side */}
        <div className="register-form-row">

          {/* Password */}
          <div className="register-form-group">
            <label className="register-form-label">Password</label>
            <div className="register-input-wrapper">
              <Lock className="register-input-icon" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`register-input register-input-password ${errors.password ? 'register-input-error' : ''}`}
                {...register('password')}
                disabled={loading}
              />
              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="register-error-text">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="register-form-group">
            <label className="register-form-label">Confirm</label>
            <div className="register-input-wrapper">
              <Lock className="register-input-icon" size={16} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`register-input register-input-password ${errors.confirmPassword ? 'register-input-error' : ''}`}
                {...register('confirmPassword')}
                disabled={loading}
              />
              <button
                type="button"
                className="register-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="register-error-text">{errors.confirmPassword.message}</p>
            )}
          </div>

        </div>

        {/* Role */}
        <div className="register-form-group">
          <label className="register-form-label">Register As</label>
          <div className="register-select-wrapper">
            <select
              className={`register-select ${errors.role ? 'register-select-error' : ''}`}
              {...register('role')}
              defaultValue=""
              disabled={loading}
            >
              <option value="" disabled>Select your role</option>
              <option value="user">🎒  User</option>
              <option value="hostel_owner">🏨  Hostel Owner</option>
            </select>
            <ChevronDown className="register-select-chevron" size={16} />
          </div>
          {errors.role && (
            <p className="register-error-text">{errors.role.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="register-submit-button"
          disabled={loading}
        >
          {loading ? (
            <><div className="register-spinner" /> Creating Account...</>
          ) : (
            <>Create Account <ArrowRight size={18} /></>
          )}
        </button>

      </form>

      {/* Divider */}
      <div className="register-divider">
        <div className="register-divider-line" />
        <span className="register-divider-text">or</span>
        <div className="register-divider-line" />
      </div>

      {/* Footer */}
      <p className="register-footer">
        Already have an account?{' '}
        <Link to="/login" className="register-link">Log in →</Link>
      </p>

    </div>
  );
};

export default RegisterForm;