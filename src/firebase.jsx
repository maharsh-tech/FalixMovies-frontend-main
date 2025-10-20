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
  appId: "1:151310379759:web:b647415c3ac655b3acc91a",
  measurementId: "G-V93J8P2CPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Firestore with the app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
