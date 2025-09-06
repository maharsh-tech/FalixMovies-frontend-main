import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANjO1fSuivhjh3nCSP5OPa4l-RdxL8epg",
  authDomain: "falixmovies.firebaseapp.com",
  projectId: "falixmovies",
  storageBucket: "falixmovies.firebasestorage.app",
  messagingSenderId: "151310379759",
  appId: "1:151310379759:android:b4fc88de39b00d15acc91a",
  measurementId: "G-NYYZXMCQD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Firestore with the app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
