// Firebase Configuration and Initialization
// This file sets up Firebase services for the Scoop dating app

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from Firebase Console
// These are public identifiers - it's safe to commit them to Git
const firebaseConfig = {
  apiKey: "AIzaSyDUnQhUhf5oRXysUGknp339lXjnFroLOw4",
  authDomain: "scoop-dating.firebaseapp.com",
  projectId: "scoop-dating",
  storageBucket: "scoop-dating.firebasestorage.app",
  messagingSenderId: "109029143115",
  appId: "1:109029143115:web:e64639a66f54189fc513ce",
  measurementId: "G-BFSZCLB85P"
};

// Initialize Firebase app
// This creates the Firebase app instance that all services will use
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// Each service handles a specific part of our backend:

// Authentication - handles user signup, login, password reset
export const auth = getAuth(app);

// Firestore - our NoSQL database for user profiles, matches, messages
export const db = getFirestore(app);

// Storage - handles profile photo uploads
export const storage = getStorage(app);

// Export the app instance in case we need it elsewhere
export default app;
