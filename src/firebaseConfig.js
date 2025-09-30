// src/firebaseConfig.js
// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Thêm dòng này
import { getFunctions } from "firebase/functions";

// Cấu hình Firebase cho ứng dụng web của bạn
// Thông tin này được lấy từ environment variables để bảo mật
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Debug: Log configuration in production
// eslint-disable-next-line no-console
console.log('Environment:', process.env.NODE_ENV);
// eslint-disable-next-line no-console
console.log('Firebase Config Keys:', Object.keys(firebaseConfig));
// eslint-disable-next-line no-console
console.log('API Key exists:', !!firebaseConfig.apiKey);
// eslint-disable-next-line no-console
console.log('Auth Domain:', firebaseConfig.authDomain);
// eslint-disable-next-line no-console
console.log('Project ID:', firebaseConfig.projectId);

// Validate configuration in production
if (process.env.NODE_ENV === 'production') {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
  for (const key of requiredKeys) {
    if (!firebaseConfig[key]) {
      // eslint-disable-next-line no-console
      console.error(`Missing Firebase configuration: ${key}`);
      throw new Error(`Missing Firebase configuration: ${key}`);
    }
  }
}

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Authentication và Google Auth Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // Thêm dòng này và export
export const functions = getFunctions(app);
