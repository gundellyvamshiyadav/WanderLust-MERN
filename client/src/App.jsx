import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import './assets/css/style.css';
import './assets/css/rating.css';
import './assets/css/auth.css';
import './assets/css/footer.css';

import ListingsIndexPage from './pages/ListingsIndexPage';
import ShowListingPage from './pages/ShowListingPage';
import NewListingPage from './pages/NewListingPage';
import EditListingPage from './pages/EditListingPage';
import SupportPage from './pages/SupportPage';
import ContactHostPage from './pages/ContactHostPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingStatusPage from './pages/BookingStatusPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PaymentStatusPage from './components/PaymentStatusPage';
import BookingForm from './components/BookingForm';

import Layout from './components/Layout';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div style={{textAlign: 'center', marginTop: '5rem'}}>Loading Application...</div>;
  }

  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ListingsIndexPage />} />
          <Route path="/listings" element={<ListingsIndexPage />} />
          <Route path="/listings/new" element={<NewListingPage />} />
          <Route path="/listings/:id/edit" element={<EditListingPage />} />
          <Route path="/listings/:id" element={<ShowListingPage />} />
          <Route path="support" element={<SupportPage />} /> 
          <Route path="/listings/:id/contact" element={<ContactHostPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bookings/:id/book" element={<BookingPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/booking/status/:bookingId" element={<BookingStatusPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
  );
}

export default App;