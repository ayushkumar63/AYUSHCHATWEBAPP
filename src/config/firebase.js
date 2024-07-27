import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC4IX-6rHgPyFhcYhPJKH3b8NgT2YmOEi8",
  authDomain: "ayushchat-c4d1b.firebaseapp.com",
  projectId: "ayushchat-c4d1b",
  storageBucket: "ayushchat-c4d1b.appspot.com",
  messagingSenderId: "22159092135",
  appId: "1:22159092135:web:fb0e54985e7f6b49c3ee82",
  measurementId: "G-0XRCC2F6CP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);