import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPye6zAixH9TP3wdMDIG3XHZAGaGBdHeQ",
  authDomain: "route-9673c.firebaseapp.com",
  projectId: "route-9673c",
  storageBucket: "route-9673c.firebasestorage.app",
  messagingSenderId: "296051896254",
  appId: "1:296051896254:web:2169804f9a5fa5afa713ef",
  measurementId: "G-80K6KPYMD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 