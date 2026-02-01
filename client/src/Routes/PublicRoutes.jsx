import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = () => {
  const accessToken = localStorage.getItem('accessToken');

  // If user is authenticated, redirect to dashboard
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, allow access to public routes
  return <Outlet />;
};

export default PublicRoutes;