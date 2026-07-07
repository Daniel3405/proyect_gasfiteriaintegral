import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRmtqMMnn5rO6KQ57NedenLPlSjAkY6YQ",
  authDomain: "gasfiteria-integral.firebaseapp.com",
  projectId: "gasfiteria-integral",
  storageBucket: "gasfiteria-integral.firebasestorage.app",
  messagingSenderId: "413897244243",
  appId: "1:413897244243:web:b7c4a14b5802ffadf990a6",
  measurementId: "G-HBG03LQW3T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);