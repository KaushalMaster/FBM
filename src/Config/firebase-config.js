import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMWNwP8iOUuonz32a5R5k5zA8pBk-aS7k",
  authDomain: "foodbymood-f20f7.firebaseapp.com",
  projectId: "foodbymood-f20f7",
  storageBucket: "foodbymood-f20f7.appspot.com",
  messagingSenderId: "88617605777",
  appId: "1:88617605777:web:c508673ff0096b41647d30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const firestore = getFirestore(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
