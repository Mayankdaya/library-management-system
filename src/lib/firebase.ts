
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDu9WkwSGptlTC_nQRNqRMq1rywHKWRWp0",
  authDomain: "verdant-library-c9482.firebaseapp.com",
  projectId: "verdant-library-c9482",
  storageBucket: "verdant-library-c9482.appspot.com",
  messagingSenderId: "283781815596",
  appId: "1:283781815596:web:3d4f0cfe0b9b91c1846089",
  measurementId: "G-905B5NHDEL"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

    