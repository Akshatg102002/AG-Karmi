import React, { useState, useEffect } from 'react';
import { useBooking } from '../../hooks/useBooking';
import { settings } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

interface Step6_ReviewProps {
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const Step6_Review: React.FC<Step6_ReviewProps> = ({ onConfirm, onBack, isSubmitting }) => {
  const { bookingState, selectPaymentMethod } = useBooking();
  const { isAuthenticated } = useAuth();
  const { service, variant, employee, date, time, customerInfo, paymentMethod } = bookingState;
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    // Default to 'card' payment if not set
    if (!paymentMethod) {
      selectPaymentMethod('card');
    }
  }, [paymentMethod, selectPaymentMethod]);

  if (!service || !variant || !date || !time || !customerInfo) {
    return <p>Loading booking details...</p>;
  }
  
  const subtotal = variant.price;
  const tax = (subtotal * settings.taxRate) / 100;
  const total = subtotal + tax;
  const isConfirmDisabled = !termsAccepted || !paymentMethod || !isAuthenticated || isSubmitting;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Review & Confirm</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Your Appointment</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Service:</span> <span className="font-semibold text-right">{service.name} ({variant.name})</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Stylist:</span> <span className="font-semibold">{employee ? employee.name : 'Any Available'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date:</span> <span className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time:</span> <span className="font-semibold">{time}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Duration:</span> <span className="font-semibold">{variant.duration} minutes</span></div>
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span> <span className="font-semibold">{subtotal.toLocaleString('en-US', { style: 'currency', currency: settings.currency })}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Taxes ({settings.taxRate}%):</span> <span className="font-semibold">{tax.toLocaleString('en-US', { style: 'currency', currency: settings.currency })}</span></div>
            <div className="flex justify-between text-base font-bold text-brand-dark mt-2 pt-2 border-t"><span >Total:</span> <span>{total.toLocaleString('en-US', { style: 'currency', currency: settings.currency })}</span></div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-brand-dark mb-4">Payment Method</h3>
          <fieldset className="space-y-4">
            <div className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-brand-primary bg-brand-light' : 'border-gray-300'}`} onClick={() => selectPaymentMethod('card')}>
                <input type="radio" name="payment-method" value="card" className="h-4 w-4 text-brand-primary border-gray-300 focus:ring-brand-primary" checked={paymentMethod === 'card'} readOnly/>
                <label className="ml-3 block text-sm font-medium text-gray-700">Pay with Card</label>
            </div>
            <div className={`relative flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cash' ? 'border-brand-primary bg-brand-light' : 'border-gray-300'}`} onClick={() => selectPaymentMethod('cash')}>
                <input type="radio" name="payment-method" value="cash" className="h-4 w-4 text-brand-primary border-gray-300 focus:ring-brand-primary" checked={paymentMethod === 'cash'} readOnly/>
                <label className="ml-3 block text-sm font-medium text-gray-700">Pay with Cash at Salon</label>
            </div>
          </fieldset>
          
          <div className="mt-6 text-xs text-gray-500">
              <p>Cancellation Policy: Free cancellation up to 24 hours before your appointment. A fee may apply for late cancellations.</p>
          </div>
          <div className="mt-4 flex items-start">
              <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="text-gray-700">I agree to the terms and conditions and cancellation policy.</label>
              </div>
          </div>
        </div>
      </div>
      
      {!isAuthenticated && (
          <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-md text-center text-sm">
              Please log in or sign up to complete your booking.
          </div>
      )}

      <div className="mt-8 pt-6 border-t flex justify-between">
        <button onClick={onBack} className="bg-gray-200 text-brand-text px-6 py-3 rounded-md font-semibold hover:bg-gray-300">Back</button>
        <button onClick={onConfirm} disabled={isConfirmDisabled} className="bg-brand-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-dark shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed">
          {isSubmitting ? 'Confirming...' : (paymentMethod === 'cash' ? 'Confirm Booking' : 'Confirm & Pay')}
        </button>
      </div>
    </div>
  );
};

export default Step6_Review;