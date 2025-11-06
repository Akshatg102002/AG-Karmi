
import React, { createContext, useState, ReactNode } from 'react';
import { Category, Service, ServiceVariant, Employee, CustomerInfo } from '../types';

interface BookingState {
  category: Category | null;
  service: Service | null;
  variant: ServiceVariant | null;
  employee: Employee | null;
  date: Date | null;
  time: string | null;
  customerInfo: CustomerInfo | null;
  paymentMethod: 'card' | 'cash' | null;
}

interface BookingContextType {
  bookingState: BookingState;
  selectCategory: (category: Category) => void;
  selectService: (service: Service, variant: ServiceVariant) => void;
  selectEmployee: (employee: Employee | null) => void;
  selectDateTime: (date: Date, time: string) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  selectPaymentMethod: (method: 'card' | 'cash') => void;
  resetBooking: () => void;
  // New methods for navigating back
  deselectService: () => void;
  deselectEmployee: () => void;
  deselectDateTime: () => void;
  deselectCustomerInfo: () => void;
}

const initialState: BookingState = {
  category: null,
  service: null,
  variant: null,
  employee: null,
  date: null,
  time: null,
  customerInfo: null,
  paymentMethod: null,
};

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingState, setBookingState] = useState<BookingState>(initialState);

  const selectCategory = (category: Category) => {
    setBookingState(prev => ({ ...initialState, category }));
  };

  const selectService = (service: Service, variant: ServiceVariant) => {
    setBookingState(prev => ({ ...prev, service, variant, employee: null, date: null, time: null }));
  };

  const selectEmployee = (employee: Employee | null) => {
    setBookingState(prev => ({ ...prev, employee, date: null, time: null }));
  };

  const selectDateTime = (date: Date, time: string) => {
    setBookingState(prev => ({ ...prev, date, time }));
  };
  
  const setCustomerInfo = (info: CustomerInfo) => {
    setBookingState(prev => ({ ...prev, customerInfo: info }));
  };

  const selectPaymentMethod = (method: 'card' | 'cash') => {
    setBookingState(prev => ({ ...prev, paymentMethod: method }));
  };

  const resetBooking = () => {
    setBookingState(initialState);
  };
  
  // State reset functions for "Back" button
  const deselectService = () => {
    setBookingState(prev => ({ ...prev, service: null, variant: null, employee: null, date: null, time: null }));
  };
  const deselectEmployee = () => {
    setBookingState(prev => ({ ...prev, employee: null, date: null, time: null }));
  };
  const deselectDateTime = () => {
    setBookingState(prev => ({ ...prev, date: null, time: null, customerInfo: null }));
  };
  const deselectCustomerInfo = () => {
    setBookingState(prev => ({ ...prev, customerInfo: null, paymentMethod: null }));
  };


  return (
    <BookingContext.Provider
      value={{
        bookingState,
        selectCategory,
        selectService,
        selectEmployee,
        selectDateTime,
        setCustomerInfo,
        selectPaymentMethod,
        resetBooking,
        deselectService,
        deselectEmployee,
        deselectDateTime,
        deselectCustomerInfo,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};