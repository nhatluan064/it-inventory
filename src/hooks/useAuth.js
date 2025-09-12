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
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSuccessType, setAuthSuccessType] = useState(null);
  const [isRegisteringFlow, setIsRegisteringFlow] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !isRegisteringFlow) {
        setCurrentUser(user);
      } else if (!user) {
        setCurrentUser(null);
        if (isRegisteringFlow) setIsRegisteringFlow(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [isRegisteringFlow]);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    setAuthSuccessType('login');
  };

  const googleSignIn = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    setAuthSuccessType('login');
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
    setAuthSuccessType(null); // Reset after logout
  };

  const passwordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  const finishAuthSuccess = async () => {
      if (authSuccessType === "register") {
        await signOut(auth); // Sign out user to force login after registration
      }
      setAuthSuccessType(null);
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
    finishAuthSuccess
  };
};