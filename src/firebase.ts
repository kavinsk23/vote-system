import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbCo59czyJzscEGhvRuzEAlMdQMxUCOhc",
  authDomain: "voting-system-9700f.firebaseapp.com",
  projectId: "voting-system-9700f",
  storageBucket: "voting-system-9700f.appspot.com",
  messagingSenderId: "495523244351",
  appId: "1:495523244351:web:ca29d3cdec22ea53d54b8a",
  measurementId: "G-YBN4MTFKLL"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);