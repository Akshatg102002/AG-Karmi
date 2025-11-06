import React, { createContext, useState, ReactNode, useMemo, useEffect, useContext } from 'react';
import { User } from '../types';
// FIX: Use named imports for Firebase v9 auth functions.
// FIX: Corrected Firebase Auth import path from "firebase/auth" to "@firebase/auth" to resolve module export errors.
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from "@firebase/auth";
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useToast } from '../hooks/useToast';
import { sendEmail, createWelcomeEmailTemplate } from '../services/emailService';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  loadingAuth: boolean;
  login: (email: string, password?: string) => Promise<User>;
  signup: (userData: Omit<User, 'id' | 'role' | 'isActive'>, role?: User['role']) => Promise<void>;
  logout: () => void;
  sendResetEmail: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    // FIX: Use v9 modular syntax and direct function call from named import.
    // FIX: Use named import for onAuthStateChanged
    // FIX: Called onAuthStateChanged directly instead of through a namespace.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // FIX: Use v9 Firestore syntax
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const appUser = { id: userDocSnap.id, ...userDocSnap.data() } as User;
                setUser(appUser);
            } else {
                // User exists in Auth but not Firestore DB, treat as logged out
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoadingAuth(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const login = async (email: string, password?: string): Promise<User> => {
    if (!password) throw new Error("Password is required for login.");
    try {
        // FIX: Use v9 modular syntax and direct function call from named import.
        // FIX: Use named import for signInWithEmailAndPassword
        // FIX: Called signInWithEmailAndPassword directly instead of through a namespace.
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user) {
            throw new Error("User authentication failed.");
        }
        // FIX: Use v9 Firestore syntax
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const appUser = { id: userDocSnap.id, ...userDocSnap.data() } as User;
            setUser(appUser); // For faster UI update before onAuthStateChanged fires
            toast.success(`Welcome back, ${appUser.name}!`);
            return appUser;
        } else {
            // FIX: Use v9 modular syntax and direct function call from named import.
            // FIX: Use named import for signOut
            // FIX: Called signOut directly instead of through a namespace.
            await signOut(auth); // Log out from Firebase Auth if no DB record
            throw new Error("User data not found in Firestore.");
        }
    } catch (error) {
        toast.error("Invalid email or password.");
        console.error("Firebase login error:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
  };
  
  const signup = async (userData: Omit<User, 'id' | 'role' | 'isActive'>, role: User['role'] = 'customer') => {
      if (!userData.password) throw new Error("Password is required for signup.");
      
      // NOTE: Client-side check for duplicate phone numbers was removed. 
      // This is because it requires public read access to the entire 'users' collection,
      // which is a security risk and was causing Firestore permission errors. 
      // This check should be handled by a backend function (e.g., Firebase Cloud Function) 
      // for security and data integrity. Firebase Auth already prevents duplicate emails.

      // FIX: Use v9 modular syntax and direct function call from named import.
      // FIX: Use named import for createUserWithEmailAndPassword
      // FIX: Called createUserWithEmailAndPassword directly instead of through a namespace.
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      if (!userCredential.user) {
          throw new Error("Could not create user.");
      }
      const uid = userCredential.user.uid;
      
      const { password, ...userDataWithoutPassword } = userData;

      const newUser: User = {
        ...userDataWithoutPassword,
        id: uid, // Use the Firebase Auth UID as the document ID
        role: role,
        isActive: true,
      }
      // Add user to our Firestore 'users' collection
      // FIX: Use v9 Firestore syntax
      await setDoc(doc(db, "users", uid), newUser);

      // Send welcome email
      try {
        const { subject, htmlBody } = createWelcomeEmailTemplate(newUser.name);
        await sendEmail(newUser.email, subject, htmlBody);
      } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
      }

      toast.success("Account created successfully!");
  }
  
  const sendResetEmail = async (email: string) => {
      try {
          // FIX: Use v9 modular syntax and direct function call from named import.
          // FIX: Use named import for sendPasswordResetEmail
          // FIX: Called sendPasswordResetEmail directly instead of through a namespace.
          await sendPasswordResetEmail(auth, email);
          toast.success("Password reset email sent. Please check your inbox.");
      } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
              toast.error("No user found with this email address.");
          } else {
              toast.error("Failed to send password reset email.");
          }
          console.error("Password reset error:", error);
          throw error;
      }
  };

  const logout = () => {
      // FIX: Use v9 modular syntax and direct function call from named import.
      // FIX: Use named import for signOut
      // FIX: Called signOut directly instead of through a namespace.
      signOut(auth);
      setUser(null);
      toast.success("You have been logged out.");
  };

  const authState = useMemo(() => ({
    user,
    isAuthenticated: user !== null && user.isActive, // Also check if user is active
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    loadingAuth,
    login,
    signup,
    logout,
    sendResetEmail,
  }), [user, loadingAuth]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
