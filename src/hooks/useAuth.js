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
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSuccessType, setAuthSuccessType] = useState(null);
  // CỜ HIỆU MỚI: Báo cho App.js biết đang trong luồng đăng ký
  const [isRegisteringFlow, setIsRegisteringFlow] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Chỉ cập nhật user nếu không phải đang trong quá trình đăng ký
      if (!isRegisteringFlow) {
        setCurrentUser(user);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [isRegisteringFlow]); // Thêm dependency

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error("EMAIL_NOT_VERIFIED");
    }
  };

  const googleSignIn = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signUp = async (email, password) => {
    // BƯỚC 1: Bật cờ hiệu lên
    setIsRegisteringFlow(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
    await signOut(auth);

    setAuthSuccessType("register");
  };

  const logout = async () => {
    await signOut(auth);
    setAuthSuccessType(null);
  };

  const passwordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const finishAuthSuccess = () => {
    setAuthSuccessType(null);
    // BƯỚC 2: Tắt cờ hiệu khi luồng đăng ký kết thúc
    setIsRegisteringFlow(false);
    // Cập nhật lại currentUser thành null để chắc chắn quay về trang login
    setCurrentUser(null);
  };

  const setupProfile = async (displayName) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
      setCurrentUser({ ...auth.currentUser, displayName });
    }
  };

  return {
    currentUser,
    authLoading,
    authSuccessType,
    isRegisteringFlow, // Export cờ hiệu ra ngoài
    login,
    googleSignIn,
    signUp,
    logout,
    passwordReset,
    finishAuthSuccess,
    setupProfile,
  };
};
