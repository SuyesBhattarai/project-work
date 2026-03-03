import { Navigate } from 'react-router-dom';

/**
 * Wraps any admin route.
 * If no accessToken exists in localStorage → redirect to /admin-login.
 */
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedAdminRoute;