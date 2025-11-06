import React, { useEffect } from 'react';
// FIX: Updated react-router-dom imports for v6+ compatibility.
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { settings } from '../data/mockData';
import { Booking } from '../types';

// FIX: Define location state type for useLocation in v6+
interface LocationState {
  booking: Booking | undefined;
}

const ConfirmationPage: React.FC = () => {
  const { resetBooking } = useBooking();
  // FIX: Replaced useHistory with useNavigate for v6+.
  const navigate = useNavigate();
  const location = useLocation();
  const booking = (location.state as LocationState)?.booking;

  useEffect(() => {
    if (!booking) {
      // FIX: Use navigate for navigation.
      navigate('/book');
    }
    // Reset the booking context state after confirmation
    return () => {
        resetBooking();
    }
  }, [booking, navigate, resetBooking]);
  

  const handleNewBooking = () => {
      // The context is already reset by the cleanup effect, just navigate
      // FIX: Use navigate for navigation.
      navigate('/book');
  }

  if (!booking) {
    return (
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto text-center">
             <h2 className="mt-6 text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">Loading confirmation...</h2>
        </div>
    ); 
  }

  const { customerInfo, serviceName, variantName, employeeName, appointmentDate, appointmentTime } = booking;
  const subtotal = booking.price;
  const tax = (subtotal * settings.taxRate) / 100;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto text-center container my-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">Booking Confirmed!</h2>
      <p className="mt-2 text-gray-500">
        Thank you, {customerInfo.fullName}. Your appointment is set. A confirmation email has been sent to {customerInfo.email}.
      </p>
      
      <div className="mt-8 text-left border-t border-gray-200 pt-6">
        <div className="flex justify-between items-baseline">
            <h3 className="text-lg font-semibold text-brand-dark">Booking Summary</h3>
            <p className="text-sm text-gray-500">ID: {booking.id}</p>
        </div>
        
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="font-medium text-gray-600">Service:</span><span className="text-right">{serviceName} ({variantName})</span></div>
              <div className="flex justify-between"><span className="font-medium text-gray-600">Stylist:</span><span>{employeeName}</span></div>
              <div className="flex justify-between"><span className="font-medium text-gray-600">Date & Time:</span><span className="text-right">{new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })} at {appointmentTime}</span></div>
              <div className="flex justify-between border-t pt-3 mt-3"><span className="font-semibold text-brand-dark">Total:</span><span className="font-semibold text-brand-dark">{total.toLocaleString('en-US', { style: 'currency', currency: settings.currency })} ({booking.paymentMethod === 'cash' ? 'due at salon' : 'paid'})</span></div>
            </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={handleNewBooking} className="w-full inline-flex justify-center rounded-md border border-transparent bg-brand-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 sm:w-auto sm:text-sm">
          Book Another Service
        </button>
        <Link to="/profile" className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 sm:w-auto sm:text-sm">
          Manage My Bookings
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
