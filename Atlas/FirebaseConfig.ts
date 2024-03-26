// Import the functions you need from the SDKs you need
import { initializeApp } from '@firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
import { getDatabase } from '@firebase/database';

// Import for persistence (optional)
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxLxXBpNP_09IfCMT45Qi2TpNfxBvyEjs",
  authDomain: "atlas-navigation-app-cd3a1.firebaseapp.com",
  projectId: "atlas-navigation-app-cd3a1",
  storageBucket: "atlas-navigation-app-cd3a1.appspot.com",
  messagingSenderId: "274162874972",
  appId: "1:274162874972:web:a07c3cfe7fd5cedfcd4499",
  measurementId: "G-ZY4HV5EKQZ",
  URL: "https://atlas-navigation-app-cd3a1-default-rtdb.firebaseio.com/",
};

// Initialize Firebase

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const PERSISTENT_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP)
export const FIREBASE_DATABASE = getDatabase(FIREBASE_APP)