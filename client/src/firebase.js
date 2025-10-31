// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAf-qFyDoA35z7iENIOZ1sIsqUZGm8wVDw",
  authDomain: "resumebuilder-702cb.firebaseapp.com",
  projectId: "resumebuilder-702cb",
  storageBucket: "resumebuilder-702cb.firebasestorage.app",
  messagingSenderId: "954995904651",
  appId: "1:954995904651:web:303511dd8f1e284c8ec48e",
  measurementId: "G-B39N6XWTGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };