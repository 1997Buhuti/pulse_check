import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Real project config provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyD2dUK12Ozfju4gjWoI0nFGhE2s4tFHGTI",
  authDomain: "pulsecheck-4ec45.firebaseapp.com",
  projectId: "pulsecheck-4ec45",
  storageBucket: "pulsecheck-4ec45.firebasestorage.app",
  messagingSenderId: "344528896656",
  appId: "1:344528896656:web:a81c88fb3475845eeace15"
};

console.log("Firebase Initializing with Project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
