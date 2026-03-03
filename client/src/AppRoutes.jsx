import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Public/Login";
import Register from "./pages/Public/Register";
import ForgetPassword from "./pages/Public/ForgetPassword";
import OwnerDashboard from './pages/Private/OwnerDashboard.jsx';
import UserHome from "./components/User/UserHome";
import UserBookings from "./components/User/UserBooking";
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/Private/AdminDashboard';
import UsersOwners from './components/admin/UsersOwners';
import PublicRoutes from './Routes/PublicRoutes';
import PrivateRoutes from './Routes/PrivateRoutes';
import ProtectedAdminRoute from './Routes/ProtectedAdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Route>

      {/* Admin Login — always public */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin Dashboard — protected: redirects to /admin-login if no token */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users-owners" element={<UsersOwners />} />
      </Route>

      {/* Private Routes — User & Owner */}
      <Route element={<PrivateRoutes />}>
        <Route path="/owner-dashboard/*" element={<OwnerDashboard />} />
        <Route path="/dashboard" element={<UserHome />} />
        <Route path="/user-bookings" element={<UserBookings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;