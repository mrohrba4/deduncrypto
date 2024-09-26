// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ9SVEWAtQHldindXb8ActqMV3zvBLpCo",
  authDomain: "dedun-crypto-bb1fa.firebaseapp.com",
  projectId: "dedun-crypto-bb1fa",
  storageBucket: "dedun-crypto-bb1fa.appspot.com",
  messagingSenderId: "532561650572",
  appId: "1:532561650572:web:8911d423d7af8a9f62aca9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//init firebase auth with persistence:
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };