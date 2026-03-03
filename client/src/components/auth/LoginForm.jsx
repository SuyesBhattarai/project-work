import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Mountain, ArrowRight, ShieldCheck } from 'lucide-react';
import loginSchema from '../../schema/login.schema';
import useApi from '../../hooks/useApi';

const LoginForm = () => {
  const navigate          = useNavigate();
  const { post, loading } = useApi();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError]         = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setApiError('');

    const result = await post('/auth/login', {
      email:    data.email,
      password: data.password,
    });

    // ── Debug: log full API response so you can see the exact structure ──
    console.log('🔍 Full API result:', result);
    console.log('🔍 result.data:', result.data);

    if (result.error) {
      setApiError(result.error);
      return;
    }

    if (result.data) {
      // ── Handle all common token key names backends return ──
      const token =
        result.data.token        ||
        result.data.accessToken  ||
        result.data.access_token ||
        result.data.authToken    ||
        result.data.jwt          ||
        result.data.data?.token  ||
        result.data.data?.accessToken ||
        null;

      // ── Handle all common user object locations ──
      const user =
        result.data.user         ||
        result.data.data?.user   ||
        result.data.userData     ||
        null;

      console.log('✅ Extracted token:', token);
      console.log('✅ Extracted user:', user);

      if (!token) {
        console.error('❌ No token in response. Full data:', result.data);
        setApiError('Login failed: server did not return a token. Check console.');
        return;
      }

      if (!user) {
        console.error('❌ No user in response. Full data:', result.data);
        setApiError('Login failed: server did not return user data.');
        return;
      }

      // ── Persist to localStorage ──
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('💾 authToken saved:', localStorage.getItem('authToken'));
      console.log('💾 user saved:', localStorage.getItem('user'));

      // ── Navigate based on role ──
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'hostel_owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="login-card">

      {/* Logo — mobile only */}
      <div className="login-logo">
        <div className="login-logo-icon">
          <Mountain />
        </div>
      </div>

      {/* Header */}
      <div className="login-card-header">
        <div className="login-card-header-icon">
          <ShieldCheck size={22} />
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Log in to access your account</p>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="login-error-message">{apiError}</div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">

        {/* Email */}
        <div className="login-form-group">
          <label className="login-form-label">Email Address</label>
          <div className="login-input-wrapper">
            <Mail className="login-input-icon" size={17} />
            <input
              type="email"
              placeholder="ram@example.com"
              className={`login-input ${errors.email ? 'login-input-error' : ''}`}
              {...register('email')}
              disabled={loading}
            />
          </div>
          {errors.email && <p className="login-error-text">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="login-form-group">
          <div className="login-label-row">
            <label className="login-form-label">Password</label>
            <Link to="/forget-password" className="login-forgot-link">
              Forgot Password?
            </Link>
          </div>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" size={17} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`login-input login-input-password ${errors.password ? 'login-input-error' : ''}`}
              {...register('password')}
              disabled={loading}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p className="login-error-text">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="login-submit-button" disabled={loading}>
          {loading ? (
            <><div className="login-spinner" /> Logging in...</>
          ) : (
            <>Log In <ArrowRight size={18} /></>
          )}
        </button>

      </form>

      {/* Divider */}
      <div className="login-divider">
        <div className="login-divider-line" />
        <span className="login-divider-text">or</span>
        <div className="login-divider-line" />
      </div>

      {/* Footer */}
      <p className="login-footer">
        Don't have an account?{' '}
        <Link to="/register" className="login-link">Sign up →</Link>
      </p>

      {/* Admin Login */}
      <div className="login-admin-link-wrapper">
        <div className="login-admin-divider" />
        <Link to="/admin-login" className="login-admin-link">Admin Login →</Link>
      </div>

    </div>
  );
};

export default LoginForm;