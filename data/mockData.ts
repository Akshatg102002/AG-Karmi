import { Category, Service, Employee, Booking, Settings, User } from '../types';

// USERS
export const mockUsers: User[] = [
    {
        id: 'user_001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        role: 'customer',
        password: 'password123',
        isActive: true,
    },
    {
        id: 'admin_001',
        name: 'Admin Ana',
        email: 'admin@karmisalon.com',
        phone: '987-654-3210',
        role: 'admin',
        password: 'password123',
        isActive: true,
    },
    {
        id: 'user_emp_001',
        name: 'Ana Pardo',
        email: 'ana.pardo@karmisalon.com',
        phone: '111-222-3333',
        role: 'employee',
        password: 'password123',
        isActive: true,
    }
];

// SETTINGS
export const settings: Settings = {
    businessName: "Karmi Beauty",
    bookingBuffer: 15,
    advanceBookingDays: 30,
    taxRate: 8.875,
    currency: "USD"
};

// CATEGORIES
export const categories: Category[] = [
  { id: 'cat_001', name: 'Hair Services', description: 'All hair styling services', image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', order: 1, isActive: true },
  { id: 'cat_002', name: 'Braiding Services', description: 'Intricate and stylish braids', image: 'https://images.unsplash.com/photo-1623722204544-4d8e78a69a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', order: 2, isActive: true },
  { id: 'cat_003', name: 'Nail Services', description: 'Manicures, pedicures, and more', image: 'https://images.unsplash.com/photo-1604654894610-df6444324f35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', order: 3, isActive: true },
  { id: 'cat_004', name: 'Makeup Services', description: 'Professional makeup for any occasion', image: 'https://images.unsplash.com/photo-1642899482129-a864989d3e38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', order: 4, isActive: true },
];

// SERVICES
export const services: Service[] = [
  {
    id: 'service_001', categoryId: 'cat_001', name: 'Wash & Blow Dry',
    variants: [
      { name: "Short Hair", price: 50, duration: 60 },
      { name: "Medium Hair", price: 55, duration: 90 },
      { name: "Long Hair", price: 60, duration: 135 }
    ],
    assignedEmployees: ["emp_001", "emp_002"], image: 'https://images.unsplash.com/photo-1615934526017-c5334c43315a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', isActive: true, order: 1
  },
  {
    id: 'service_002', categoryId: 'cat_001', name: 'Silk Press',
    variants: [{ name: "Standard", price: 80, duration: 120 }],
    assignedEmployees: ["emp_001", "emp_003"], image: 'https://images.unsplash.com/photo-1621202650503-689b7b9bbf7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', isActive: true, order: 2
  },
  {
    id: 'service_003', categoryId: 'cat_002', name: 'Box Braids',
    variants: [
      { name: "Medium", price: 150, duration: 240 },
      { name: "Small", price: 200, duration: 360 }
    ],
    assignedEmployees: ["emp_002"], image: 'https://images.unsplash.com/photo-1595484834241-c937194fee33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', isActive: true, order: 1
  },
  {
    id: 'service_004', categoryId: 'cat_003', name: 'Gel Manicure',
    variants: [{ name: "Standard", price: 45, duration: 60 }],
    assignedEmployees: ["emp_001", "emp_003"], image: 'https://images.unsplash.com/photo-1522338242287-a2411b51a4a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', isActive: true, order: 1
  },
   {
    id: 'service_005', categoryId: 'cat_004', name: 'Soft Glam Makeup',
    variants: [{ name: "Full Face", price: 75, duration: 75 }],
    assignedEmployees: ["emp_002"], image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', isActive: true, order: 1
  },
  {
    id: 'service_006', categoryId: 'cat_001', name: 'Haircut',
    variants: [
        { name: "Women's Cut", price: 65, duration: 60 },
        { name: "Men's Cut", price: 40, duration: 45 }
    ],
    assignedEmployees: ["emp_001", "emp_002", "emp_003"], image: 'https://images.unsplash.com/photo-1599331045939-5a4358a52994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', isActive: true, order: 3
  },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

const tomorrowStr = formatDate(tomorrow);
const todayStr = formatDate(today);
const nextWeekStr = formatDate(nextWeek);


// EMPLOYEES
const standardWeek = {
    monday: { start: "09:00", end: "18:00", breaks: [{start: "13:00", end: "14:00"}] },
    tuesday: { start: "09:00", end: "18:00", breaks: [{start: "13:00", end: "14:00"}] },
    wednesday: { start: "09:00", end: "18:00", breaks: [{start: "13:00", end: "14:00"}] },
    thursday: { start: "10:00", end: "19:00", breaks: [{start: "14:00", end: "15:00"}] },
    friday: { start: "10:00", end: "19:00", breaks: [{start: "14:00", end: "15:00"}] },
    saturday: { start: "09:00", end: "16:00" },
    sunday: { closed: true }
};

export const employees: Employee[] = [
  {
    id: 'emp_001', name: 'Ana Pardo', userId: 'user_emp_001', profileImage: 'https://images.unsplash.com/photo-1558507652-2d9626c4e67a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    specializations: ['cat_001', 'cat_003'],
    assignedServices: ['service_001', 'service_002', 'service_004', 'service_006'],
    workingHours: standardWeek,
    rating: 4.8, reviewCount: 125, bio: 'Experienced hair stylist and nail technician with a passion for creative designs.', isActive: true,
    timeOff: [
        { date: nextWeekStr, type: 'partial', startTime: '14:00', endTime: '18:00', reason: 'Personal Appointment' }
    ]
  },
  {
    id: 'emp_002', name: 'Jasmine Rae', profileImage: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    specializations: ['cat_001', 'cat_002', 'cat_004'],
    assignedServices: ['service_001', 'service_003', 'service_005', 'service_006'],
    workingHours: {
      ...standardWeek,
      monday: { closed: true },
      tuesday: { start: "10:00", end: "19:00", breaks: [{start: "14:00", end: "15:00"}] }
    },
    rating: 4.9, reviewCount: 150, bio: 'Expert in braiding and natural hair care, dedicated to making you feel beautiful.', isActive: true
  },
  {
    id: 'emp_003', name: 'Carlos Vega', profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    specializations: ['cat_001'],
    assignedServices: ['service_002', 'service_006'],
     workingHours: {
      ...standardWeek,
      saturday: { closed: true },
      sunday: { start: "10:00", end: "16:00" }
    },
    rating: 4.7, reviewCount: 98, bio: 'Master barber specializing in modern and classic cuts for all hair types.', isActive: true
  }
];

// BOOKINGS

export const bookings: Booking[] = [
    { 
        id: 'booking_001', 
        customerId: 'user_001', 
        customerInfo: { fullName: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', notes: '' },
        serviceId: 'service_001', 
        serviceName: 'Wash & Blow Dry',
        variantName: 'Medium Hair', 
        employeeId: 'emp_001', 
        employeeName: 'Ana Pardo',
        appointmentDate: todayStr, 
        appointmentTime: '10:00', 
        duration: 90, 
        price: 55, 
        status: 'confirmed',
        paymentMethod: 'card',
        paymentStatus: 'paid'
    },
    { 
        id: 'booking_002', 
        customerId: 'user_001', 
        customerInfo: { fullName: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', notes: 'Looking for a new style!' },
        serviceId: 'service_003',
        serviceName: 'Box Braids',
        variantName: 'Medium', 
        employeeId: 'emp_002', 
        employeeName: 'Jasmine Rae',
        appointmentDate: todayStr, 
        appointmentTime: '11:00', 
        duration: 240, 
        price: 150, 
        status: 'confirmed',
        paymentMethod: 'cash',
        paymentStatus: 'pending'
    },
     { 
        id: 'booking_003', 
        customerId: 'user_001', 
        customerInfo: { fullName: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-555-5555', notes: '' },
        serviceId: 'service_006', 
        serviceName: 'Haircut',
        variantName: "Women's Cut", 
        employeeId: 'emp_003', 
        employeeName: 'Carlos Vega',
        appointmentDate: todayStr, 
        appointmentTime: '14:00', 
        duration: 60, 
        price: 65, 
        status: 'completed',
        paymentMethod: 'card',
        paymentStatus: 'paid'
    },
];