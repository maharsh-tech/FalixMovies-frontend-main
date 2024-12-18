import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqiuLUNuDAHkeA1xlt1CN5o0sc4SNK7yA",
  authDomain: "gasgstamovies.firebaseapp.com",
  projectId: "gasgstamovies",
  storageBucket: "gasgstamovies.firebasestorage.app",
  messagingSenderId: "956178222832",
  appId: "1:956178222832:web:201e8e415119befe4abc35",
  measurementId: "G-R02HPHLGLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth and Firestore with the app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
