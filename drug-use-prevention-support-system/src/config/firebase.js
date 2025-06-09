// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArdex-th6-hIx-9yISLHfYd7252tLrvDI",
  authDomain: "student-management-ebb78.firebaseapp.com",
  projectId: "student-management-ebb78",
  storageBucket: "student-management-ebb78.firebasestorage.app",
  messagingSenderId: "572711524031",
  appId: "1:572711524031:web:7a67704f01de839f13180a",
  measurementId: "G-MMG3MF99LF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth = getAuth();