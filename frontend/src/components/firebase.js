
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqKhLGXhBCGoiRbykexUj8MAOVob3wtvU",
  authDomain: "job-portal-1eb99.firebaseapp.com",
  projectId: "job-portal-1eb99",
  storageBucket: "job-portal-1eb99.firebasestorage.app",
  messagingSenderId: "713103969049",
  appId: "1:713103969049:web:793f89a027775d0932d388",
  measurementId: "G-C8PCWS0EYN",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
