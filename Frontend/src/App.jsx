import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import StaffLoginPage from './pages/StaffLoginPage';
import AdminDoctorsPage from './pages/AdminDoctorsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<StaffLoginPage />} />
        <Route path="/staff/login" element={<StaffLoginPage />} />
        <Route path="/doctor" element={<DoctorDashboardPage />} />
        <Route path="/admin" element={<AdminDoctorsPage />} />
        <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
