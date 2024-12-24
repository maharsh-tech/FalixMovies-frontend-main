import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDspAMoxizfNuNsntDTM7Nna7go3k9GSv0",
  authDomain: "srilinks4k-d79b0.firebaseapp.com",
  projectId: "srilinks4k-d79b0",
  storageBucket: "srilinks4k-d79b0.firebasestorage.app",
  messagingSenderId: "521896668238",
  appId: "1:521896668238:web:e4fa39320373817523e71f",
  measurementId: "G-JDFS7KRV40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Firestore with the app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
