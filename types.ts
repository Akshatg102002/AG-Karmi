export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface ServiceVariant {
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  variants: ServiceVariant[];
  assignedEmployees: string[];
  image: string;
  isActive: boolean;
  order: number;
}

export interface Break {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

export interface WorkingHoursDay {
  start?: string; // "HH:mm"
  end?: string;   // "HH:mm"
  breaks?: Break[];
  closed?: boolean;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeOff {
  date: string; // "YYYY-MM-DD"
  type: 'full-day' | 'partial';
  startTime?: string; // "HH:mm"
  endTime?: string; // "HH:mm"
  reason: string;
}

export interface Employee {
  id: string;
  userId?: string; // Link to the User account
  name: string;
  profileImage: string;
  specializations: string[]; // Category IDs
  assignedServices: string[];
  workingHours: Record<DayOfWeek, WorkingHoursDay>;
  rating: number;
  reviewCount: number;
  bio: string;
  isActive: boolean;
  timeOff?: TimeOff[];
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface CustomerInfo {
    fullName: string;
    email: string;
    phone: string;
    notes: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerInfo: CustomerInfo;
  serviceId: string;
  serviceName: string;
  variantName: string;
  employeeId: string;
  employeeName: string;
  appointmentDate: string; // "YYYY-MM-DD"
  appointmentTime: string; // "HH:mm"
  duration: number; // in minutes
  price: number;
  status: BookingStatus;
  paymentMethod: 'card' | 'cash';
  paymentStatus: 'pending' | 'paid';
  cancellationReason?: string;
}

export interface Settings {
    businessName: string;
    bookingBuffer: number; // minutes between appointments
    advanceBookingDays: number;
    taxRate: number; // as a percentage, e.g., 8.875
    currency: 'USD';
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'admin' | 'employee';
    password?: string;
    isActive: boolean;
}