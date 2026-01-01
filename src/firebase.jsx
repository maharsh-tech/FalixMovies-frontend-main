import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4inaonKdvYTrbJ0_eu7BxCVh6jyYxCyg",
    authDomain: "falixmovies-auth.firebaseapp.com",
    projectId: "falixmovies-auth",
    storageBucket: "falixmovies-auth.firebasestorage.app",
    messagingSenderId: "493579670333",
    appId: "1:493579670333:web:f4e1fd4e4046605fea2b54",
    measurementId: "G-HZ9Z2V4SEE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Firestore with the app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
