// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile, // Import updateProfile
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSuccessType, setAuthSuccessType] = useState(null);
  const [isRegisteringFlow, setIsRegisteringFlow] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    // Let App.js handle state change based on currentUser
  };

  const googleSignIn = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
     // Let App.js handle state change based on currentUser
  };

  const signUp = async (email, password) => {
    setIsRegisteringFlow(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      setAuthSuccessType('register');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAuthSuccessType(null);
  };

  const passwordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  const finishAuthSuccess = async () => {
      if (authSuccessType === "register") {
        await signOut(auth); 
      }
      setAuthSuccessType(null);
      setIsRegisteringFlow(false);
  };

  // New function to update user profile
  const setupProfile = async (displayName) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
      // To get the updated user info immediately, we need to re-fetch it.
      // Easiest way is to update our state directly.
      setCurrentUser({ ...auth.currentUser, displayName });
    }
  };

  return {
    currentUser,
    authLoading,
    authSuccessType,
    login,
    googleSignIn,
    signUp,
    logout,
    passwordReset,
    finishAuthSuccess,
    setupProfile, // Export the new function
  };
};
