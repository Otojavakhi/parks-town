import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuxc_0OMXwAS9nG_T98PfA4uloRTd-wbA",
  authDomain: "fir-783a8.firebaseapp.com",
  projectId: "fir-783a8",
  storageBucket: "fir-783a8.appspot.com",
  messagingSenderId: "464369840769",
  appId: "1:464369840769:web:ab9f19020e1e57a1609380",
};

export const app = initializeApp(firebaseConfig);
// export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();
export const colRef = collection(db, "buildings");
