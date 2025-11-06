import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// FIX: Use named import for getAuth from Firebase v9.
// FIX: Corrected Firebase Auth import path from "firebase/auth" to "@firebase/auth" to resolve module export errors.
import { getAuth } from "@firebase/auth";

// User-provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDBDITKintbie7mY6nASDzsj78UJ30AhD0",
  authDomain: "karmi-beauty-5fcc5.firebaseapp.com",
  projectId: "karmi-beauty-5fcc5",
  storageBucket: "karmi-beauty-5fcc5.appspot.com",
  messagingSenderId: "829879683899",
  appId: "1:829879683899:web:cadc8c6103b83e6521051e",
  measurementId: "G-JL17613KVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
// FIX: Use direct function call for getAuth.
export const auth = getAuth(app);
