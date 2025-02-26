import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQYqBeI3RzcfdpqE2UkUCcOni8uu0XYCA",
  authDomain: "matchmentor-68cd8.firebaseapp.com",
  databaseURL: "https://matchmentor-68cd8-default-rtdb.firebaseio.com",
  projectId: "matchmentor-68cd8",
  storageBucket: "matchmentor-68cd8.firebasestorage.app",
  messagingSenderId: "242940184537",
  appId: "1:242940184537:web:b782d3e7b98aa51e8dbbc8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, doc, setDoc };
