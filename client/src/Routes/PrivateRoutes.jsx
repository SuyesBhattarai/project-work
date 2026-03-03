import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const accessToken = localStorage.getItem('accessToken');
  const userString = localStorage.getItem('user');
  
  console.log('PrivateRoutes - Token:', accessToken);
  console.log('PrivateRoutes - User String:', userString);

  if (!accessToken) {
    console.log('No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Parse user data to get role
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
    console.log('PrivateRoutes - Parsed User:', user);
  } catch (error) {
    console.error('Error parsing user data:', error);
    // If user data is corrupted, clear and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // Allow access to protected routes
  return <Outlet />;
};

export default PrivateRoutes;