import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const accessToken = localStorage.getItem('accessToken');

  // If user is not authenticated, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access to private routes
  return <Outlet />;
};

export default PrivateRoutes;