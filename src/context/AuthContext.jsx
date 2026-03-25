import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Login popup was closed. Please try again.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Google Sign-In is not enabled in your Firebase Console.");
      } else {
        setError(err.message);
      }
    }
  };

  const loginWithEmail = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Email Login Error:", err);
      setError(err.message);
      throw err;
    }
  };

  const registerWithEmail = async (email, password, displayName) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
    } catch (err) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password accounts are not enabled in the Firebase Console. Please enable them in Authentication > Sign-in method.");
      } else {
        setError(err.message);
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: loginWithGoogle, // Keep for backward compatibility
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      logout, 
      loading,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
