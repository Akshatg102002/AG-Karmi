import React, { createContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { Service, Employee, Category, Booking, User } from '../types';
// FIX: Updated Firebase imports to v9+ modular syntax
import { db, auth, firebaseConfig } from '../firebaseConfig';
import { initializeApp, deleteApp } from "firebase/app";
// FIX: Corrected import path from 'firestore' to 'firebase/firestore'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, setDoc } from "firebase/firestore";
// FIX: Use named imports for Firebase v9 auth functions.
// FIX: Corrected Firebase Auth import path from "firebase/auth" to "@firebase/auth" to resolve module export errors.
import { getAuth, createUserWithEmailAndPassword, signOut } from '@firebase/auth';
import { getAvailableTimeSlots } from '../utils/timeUtils';
import { settings } from '../data/mockData';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/useToast';
import { sendEmail, createBookingConfirmationTemplate, createCancellationNotificationTemplate } from '../services/emailService';


interface DataContextType {
  services: Service[];
  employees: Employee[];
  categories: Category[];
  bookings: Booking[];
  users: User[];
  loading: boolean;
  reloading: boolean;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (updatedService: Service) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  addEmployeeAndUser: (employeeData: Omit<Employee, 'id'>, authData: { email: string; password; phone: string; }) => Promise<void>;
  updateEmployee: (updatedEmployee: Employee) => Promise<void>;
  deleteEmployeeAndUser: (employeeId: string, userId?: string) => Promise<void>;
  addBooking: (bookingData: Omit<Booking, 'id'>) => Promise<Booking | null>;
  updateBooking: (updatedBooking: Booking) => Promise<void>;
  addUser: (userData: Omit<User, 'id'>) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  deleteUserAndAuth: (userId: string) => Promise<void>;
  addCategory: (categoryData: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (updatedCategory: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  refetchData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const { user, loadingAuth } = useAuth();
  const toast = useToast();

  const fetchData = useCallback(async (isRefetch: boolean = false) => {
    if (isRefetch) {
      setReloading(true);
    } else {
      setLoading(true);
    }
    try {
      // Fetch collections that don't depend on user role first
      const [categoriesSnapshot, servicesSnapshot, employeesSnapshot] = await Promise.all([
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'employees')),
      ]);

      const fetchedCategories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      const fetchedServices = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      const fetchedEmployees = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));

      setCategories(fetchedCategories.sort((a,b) => a.order - b.order));
      setServices(fetchedServices);
      setEmployees(fetchedEmployees);

      // Now fetch user-dependent data once auth state is resolved
      if (!loadingAuth) {
        if (user) {
          if (user.role === 'admin') {
            const [usersSnapshot, bookingsSnapshot] = await Promise.all([
              getDocs(collection(db, 'users')),
              getDocs(collection(db, 'bookings')),
            ]);
            setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
            setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
          } else if (user.role === 'employee') {
            setUsers([user]);
            // Find the employee profile using the already fetched employees list
            const employeeProfile = fetchedEmployees.find(e => e.userId === user.id);
            if (employeeProfile) {
              const bookingsQuery = query(collection(db, 'bookings'), where('employeeId', '==', employeeProfile.id));
              const bookingsSnapshot = await getDocs(bookingsQuery);
              setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
            } else {
              setBookings([]); // No employee profile found for this user
            }
          } else { // Customer
            setUsers([user]);
            const bookingsQuery = query(collection(db, 'bookings'), where('customerId', '==', user.id));
            const bookingsSnapshot = await getDocs(bookingsQuery);
            setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
          }
        } else {
          // Not logged in
          setUsers([]);
          setBookings([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      toast.error("Failed to load data.");
      // Reset states on error to avoid stale data
      setUsers([]);
      setBookings([]);
    } finally {
      if (isRefetch) {
        setReloading(false);
      } else {
        setLoading(false);
      }
    }
  }, [user, loadingAuth, toast]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refetchData = async () => {
    await fetchData(true);
    toast.success("Data refreshed!");
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    const newCategory = { id: docRef.id, ...categoryData };
    setCategories(prev => [...prev, newCategory].sort((a,b) => a.order - b.order));
    toast.success("Category added successfully.");
    return newCategory;
  };

  const updateCategory = async (updatedCategory: Category) => {
    const docRef = doc(db, 'categories', updatedCategory.id);
    await updateDoc(docRef, updatedCategory);
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c).sort((a,b) => a.order - b.order));
    toast.success("Category updated successfully.");
  };

  const deleteCategory = async (categoryId: string) => {
    // Prevent deletion if category is in use
    const isCategoryInUse = services.some(service => service.categoryId === categoryId);
    if (isCategoryInUse) {
      toast.error("Cannot delete category. It is currently assigned to one or more services.");
      return;
    }

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      toast.success("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
  };

  const addService = async (serviceData: Omit<Service, 'id'>) => {
    const docRef = await addDoc(collection(db, 'services'), serviceData);
    setServices(prev => [...prev, { id: docRef.id, ...serviceData }]);
    toast.success("Service added successfully.");
  };

  const updateService = async (updatedService: Service) => {
    const docRef = doc(db, 'services', updatedService.id);
    await updateDoc(docRef, updatedService);
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    toast.success("Service updated successfully.");
  };

  const deleteService = async (serviceId: string) => {
    try {
        await deleteDoc(doc(db, 'services', serviceId));
        setServices(prev => prev.filter(s => s.id !== serviceId));
        toast.success("Service deleted successfully.");
    } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete service.");
    }
  };
  
  const addEmployeeAndUser = async (employeeData: Omit<Employee, 'id'>, authData: { email: string; password; phone: string; }) => {
     const tempAppName = `temp-user-creation-${Date.now()}`;
     const tempApp = initializeApp(firebaseConfig, tempAppName);
     // FIX: Use named import for getAuth
     // FIX: Called getAuth directly instead of through a namespace.
     const tempAuth = getAuth(tempApp);

     try {
        // FIX: Use named import for createUserWithEmailAndPassword
        // FIX: Called createUserWithEmailAndPassword directly instead of through a namespace.
        const userCredential = await createUserWithEmailAndPassword(tempAuth, authData.email, authData.password);
        const uid = userCredential.user.uid;

        const newUser: User = {
            id: uid,
            name: employeeData.name,
            email: authData.email,
            phone: authData.phone,
            role: 'employee',
            isActive: true,
        };
        await setDoc(doc(db, "users", uid), newUser);
        setUsers(prev => [...prev, newUser]);

        const newEmployeeData = { ...employeeData, userId: uid };
        const employeeDocRef = await addDoc(collection(db, 'employees'), newEmployeeData);
        setEmployees(prev => [...prev, { id: employeeDocRef.id, ...newEmployeeData }]);
        
        toast.success(`Employee ${employeeData.name} created successfully.`);
     } catch (error) {
         console.error("Error creating employee and user:", error);
         throw error; 
     } finally {
        // FIX: Use named import for signOut
        // FIX: Called signOut directly instead of through a namespace.
        await signOut(tempAuth);
        await deleteApp(tempApp);
     }
  };
  
  const updateEmployee = async (updatedEmployee: Employee) => {
    const docRef = doc(db, 'employees', updatedEmployee.id);
    await updateDoc(docRef, updatedEmployee);
    setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
    toast.success("Employee updated successfully.");
  };

  const deleteEmployeeAndUser = async (employeeId: string, userId?: string) => {
    if (userId) {
      await deleteUserAndAuth(userId);
    }
    const docRef = doc(db, 'employees', employeeId);
    await deleteDoc(docRef);
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
    toast.success("Employee record deleted successfully.");
  };

  const addBooking = async (bookingData: Omit<Booking, 'id'>): Promise<Booking | null> => {
    const employee = employees.find(e => e.id === bookingData.employeeId);
    const service = services.find(s => s.id === bookingData.serviceId);
    const variant = service?.variants.find(v => v.name === bookingData.variantName);

    if (!employee || !variant) {
        toast.error("Employee or Service not found!");
        return null;
    }

    const date = new Date(bookingData.appointmentDate);
    const availableSlots = getAvailableTimeSlots(date, employee, variant, bookings, settings);
    
    if (!availableSlots.includes(bookingData.appointmentTime)) {
        toast.error("This time slot is no longer available.");
        return null;
    }

    try {
        const bookingsCollection = collection(db, "bookings");
        const docRef = await addDoc(bookingsCollection, bookingData);
        const newBooking = { id: docRef.id, ...bookingData };
        
        setBookings(prev => [...prev, newBooking]);
        
        try {
            const customer = users.find(u => u.id === newBooking.customerId);
            const employeeProfile = employees.find(e => e.id === newBooking.employeeId);
            const employeeUser = employeeProfile ? users.find(u => u.id === employeeProfile.userId) : null;
            const admins = users.filter(u => u.role === 'admin');

            if (customer) {
                const { subject, htmlBody } = createBookingConfirmationTemplate(newBooking, customer, 'customer');
                await sendEmail(customer.email, subject, htmlBody);
            }
            if (employeeUser) {
                const { subject, htmlBody } = createBookingConfirmationTemplate(newBooking, employeeUser, 'employee');
                await sendEmail(employeeUser.email, subject, htmlBody);
            }
            for (const admin of admins) {
                const { subject, htmlBody } = createBookingConfirmationTemplate(newBooking, admin, 'admin');
                await sendEmail(admin.email, subject, htmlBody);
            }
        } catch (emailError) {
            console.error("Failed to send booking notification emails:", emailError);
        }
        
        return newBooking;

    } catch (e: any) {
        console.error("Booking failed: ", e);
        toast.error("An error occurred while creating the booking.");
        return null;
    }
  };

  const updateBooking = async (updatedBooking: Booking) => {
    const docRef = doc(db, 'bookings', updatedBooking.id);
    await updateDoc(docRef, updatedBooking);
    
    if (updatedBooking.status === 'cancelled') {
        try {
            const customer = users.find(u => u.id === updatedBooking.customerId);
            const employeeProfile = employees.find(e => e.id === updatedBooking.employeeId);
            const employeeUser = employeeProfile ? users.find(u => u.id === employeeProfile.userId) : null;
            const admins = users.filter(u => u.role === 'admin');

            if (customer) {
                const { subject, htmlBody } = createCancellationNotificationTemplate(updatedBooking, customer, 'customer');
                await sendEmail(customer.email, subject, htmlBody);
            }
            if (employeeUser) {
                const { subject, htmlBody } = createCancellationNotificationTemplate(updatedBooking, employeeUser, 'employee');
                await sendEmail(employeeUser.email, subject, htmlBody);
            }
            for (const admin of admins) {
                const { subject, htmlBody } = createCancellationNotificationTemplate(updatedBooking, admin, 'admin');
                await sendEmail(admin.email, subject, htmlBody);
            }
        } catch (emailError) {
            console.error("Failed to send cancellation notification emails:", emailError);
        }
    }
    
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    toast.success(`Booking ${updatedBooking.status}.`);
  };
  
  const addUser = async (userData: Omit<User, 'id'>) => {
    if (!userData.password) {
      throw new Error("Password is required to create a new user.");
    }
    
    try {
        // FIX: Use named import for createUserWithEmailAndPassword
        // FIX: Called createUserWithEmailAndPassword directly instead of through a namespace.
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        if (!userCredential.user) {
            throw new Error("Could not create user account.");
        }
        const uid = userCredential.user.uid;
        
        const { password, ...userDataWithoutPassword } = userData; 

        const newUser: User = {
            id: uid,
            ...userDataWithoutPassword,
            isActive: true,
        };
        
        await setDoc(doc(db, "users", uid), newUser);
        setUsers(prev => [...prev, newUser]);
        
        toast.success(`User ${newUser.name} created. Admin will be logged out.`);

    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
  };

  const updateUser = async (updatedUser: User) => {
    const docRef = doc(db, 'users', updatedUser.id);
    const { id, ...userData } = updatedUser;
    await updateDoc(docRef, userData);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast.success("User updated successfully.");
  };
  
  const deleteUserAndAuth = async (userId: string) => {
    // Find the employee record associated with this user ID before any action
    const employeeToDelete = employees.find(e => e.userId === userId);

    try {
        const response = await fetch('/api/delete-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: userId }),
        });

        // Detailed error handling
        if (!response.ok) {
            let errorMessage = 'Failed to delete user from authentication service.';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Ignore if response is not json
            }
            throw new Error(errorMessage);
        }

        // Update local state after successful backend deletion
        setUsers(prev => prev.filter(u => u.id !== userId));
        if (employeeToDelete) {
            setEmployees(prev => prev.filter(e => e.id !== employeeToDelete.id));
        }
        toast.success("User and all associated records deleted successfully.");

    } catch (error) {
        console.error("Error during user hard delete:", error);
        toast.error(`Could not delete user: ${(error as Error).message}. Attempting to clean up database records.`);
        
        // Fallback: try to delete just the Firestore records if the backend function fails.
        // This is not ideal as the Auth record will remain, but it's better than nothing.
        try {
            // Delete user record
            await deleteDoc(doc(db, 'users', userId));
            setUsers(prev => prev.filter(u => u.id !== userId));
            
            // Delete associated employee record if it exists
            if (employeeToDelete) {
                await deleteDoc(doc(db, 'employees', employeeToDelete.id));
                setEmployees(prev => prev.filter(e => e.id !== employeeToDelete.id));
            }
            toast.info("Deleted user record(s) from database, but authentication record may still exist.");
        } catch (dbError) {
            console.error("Error deleting user Firestore record during fallback:", dbError);
            toast.error("Failed to clean up database records.");
        }
    }
  };

  const dataContextValue = useMemo(() => ({
    services,
    employees,
    categories,
    bookings,
    users,
    loading,
    reloading,
    addService,
    updateService,
    deleteService,
    addEmployeeAndUser,
    updateEmployee,
    deleteEmployeeAndUser,
    addBooking,
    updateBooking,
    addUser,
    updateUser,
    deleteUserAndAuth,
    addCategory,
    updateCategory,
    deleteCategory,
    refetchData,
  }), [services, employees, categories, bookings, users, loading, reloading, fetchData]);

  return (
    <DataContext.Provider value={dataContextValue}>
      {children}
    </DataContext.Provider>
  );
};
