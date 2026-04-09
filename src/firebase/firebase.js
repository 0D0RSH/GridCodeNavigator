import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXtwS-vddbdsS3nrX2ilQCVEduQ5uOYeU",
  authDomain: "indoor-navigator-50cf4.firebaseapp.com",
  projectId: "indoor-navigator-50cf4",
  storageBucket: "indoor-navigator-50cf4.firebasestorage.app",
  messagingSenderId: "911413655103",
  appId: "1:911413655103:web:2c228f8b365c9cbd51aa8a",
  measurementId: "G-GZXX2LV0HX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;