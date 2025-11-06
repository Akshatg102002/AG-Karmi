
import React, { useState, useEffect } from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';

interface Step5_CustomerInfoProps {
  onNext: () => void;
  onBack: () => void;
}

const Step5_CustomerInfo: React.FC<Step5_CustomerInfoProps> = ({ onNext, onBack }) => {
  const { bookingState, setCustomerInfo } = useBooking();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: bookingState.customerInfo?.fullName || '',
    email: bookingState.customerInfo?.email || '',
    phone: bookingState.customerInfo?.phone || '',
    notes: bookingState.customerInfo?.notes || '',
  });
  const [errors, setErrors] = useState({ fullName: '', email: '' });

  useEffect(() => {
    if (isAuthenticated && user) {
        setFormData(prev => ({
            ...prev,
            fullName: user.name,
            email: user.email,
            phone: user.phone,
        }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = { fullName: '', email: '' };
    let isValid = true;
    if (!formData.fullName) {
      tempErrors.fullName = 'Full name is required.';
      isValid = false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'A valid email is required.';
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCustomerInfo(formData);
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Your Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Special Instructions (Optional)</label>
          <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"></textarea>
        </div>

        <div className="pt-6 flex justify-between">
          <button type="button" onClick={onBack} className="bg-gray-200 text-brand-text px-6 py-2 rounded-md font-semibold hover:bg-gray-300">Back</button>
          <button type="submit" className="bg-brand-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-brand-dark">Next</button>
        </div>
      </form>
    </div>
  );
};

export default Step5_CustomerInfo;
