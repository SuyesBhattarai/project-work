import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../components/Owner/Layout';
import MyHostels from '../../components/Owner/MyHostels';
import AddNewHostel from '../../components/Owner/AddNewHostel';
import UserHistory from '../../components/Owner/UserHistory';
import Profile from '../../components/Owner/Profile';

const OwnerDashboard = () => {
  console.log('🏨 OwnerDashboard loaded');
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="my-hostels" replace />} />
        <Route path="my-hostels" element={<MyHostels />} />
        <Route path="add-hostel" element={<AddNewHostel />} />
        <Route path="user-history" element={<UserHistory />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
};

export default OwnerDashboard;