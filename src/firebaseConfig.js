// src/firebaseConfig.js
// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Thêm dòng này

// Cấu hình Firebase cho ứng dụng web của bạn
// Thông tin này được lấy từ bảng điều khiển dự án Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyDS_gnny0gbq03-tG4BCvVFwXdCzw5RAJs",
  authDomain: "it-inventory-108a0.firebaseapp.com",
  projectId: "it-inventory-108a0",
  storageBucket: "it-inventory-108a0.firebasestorage.app",
  messagingSenderId: "1059190129623",
  appId: "1:1059190129623:web:431d2da202c0a0ddbf4192",
  measurementId: "G-T2PHS60NGS",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Authentication và Google Auth Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // Thêm dòng này và export
