// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8z5EFg14hoIk_UD-J13u7b1Sz46R96Hg",
  authDomain: "cozy-movies-testing.firebaseapp.com",
  projectId: "cozy-movies-testing",
  storageBucket: "cozy-movies-testing.firebasestorage.app",
  messagingSenderId: "68520793453",
  appId: "1:68520793453:web:b11ec807469ec719ca7664"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})