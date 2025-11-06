
import React from 'react';
// FIX: Updated react-router-dom imports for v6+ compatibility.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';


import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminSignUpPage from './pages/AdminSignUpPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicy';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CalendarView from './pages/admin/CalendarView';
import ManageServices from './pages/admin/ManageServices';
import ManageCategories from './pages/admin/ManageCategories';
import ManageEmployees from './pages/admin/ManageEmployees';
import Revenue from './pages/admin/Revenue';
import EmployeePerformance from './pages/admin/EmployeePerformance';
import ManageUsers from './pages/admin/ManageClients';
import Appointments from './pages/admin/Appointments';

// Employee Pages
import EmployeeLayout from './components/employee/EmployeeLayout';
import EmployeeAppointments from './pages/employee/Appointments';
import EmployeeEarnings from './pages/employee/Earnings';
import EmployeeProfile from './pages/employee/Profile';
import LeaveManagement from './pages/employee/LeaveManagement';

const AppContent: React.FC = () => {
  const { loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-light">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans text-brand-text bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* FIX: Replaced Switch with Routes and updated Route syntax for v6 compatibility. */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/book" element={<ProtectedRoute allowedRoles={['customer']}><BookingPage /></ProtectedRoute>} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/setup-admin" element={<AdminSignUpPage />} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['customer']}><ProfilePage /></ProtectedRoute>} />
            
            {/* FIX: Restructured nested routes for v6 compatibility using Outlet */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="performance" element={<EmployeePerformance />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="employees" element={<ManageEmployees />} />
            </Route>

            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeLayout /></ProtectedRoute>}>
               <Route index element={<Navigate to="/dashboard/appointments" replace />} />
               <Route path="appointments" element={<EmployeeAppointments />} />
               <Route path="earnings" element={<EmployeeEarnings />} />
               <Route path="profile" element={<EmployeeProfile />} />
               <Route path="leave" element={<LeaveManagement />} />
            </Route>

          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </BrowserRouter>
  )
}


function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <BookingProvider>
            <AppContent />
          </BookingProvider>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;