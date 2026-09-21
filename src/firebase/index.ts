
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig as devFirebaseConfig } from '@/firebase/config';

// Function to construct Firebase config from environment variables
const getFirebaseConfigFromEnv = (): FirebaseOptions | null => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  // Check if all required environment variables are set
  if (
    apiKey &&
    authDomain &&
    projectId &&
    storageBucket &&
    messagingSenderId &&
    appId
  ) {
    return {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      measurementId,
    };
  }
  return null;
};


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const existingApps = getApps();
  if (existingApps.length) {
    const app = existingApps[0];
    return getSdks(app);
  }

  let firebaseApp: FirebaseApp;

  // For production, always prioritize environment variables
  if (process.env.NODE_ENV === 'production') {
    const prodConfig = getFirebaseConfigFromEnv();
    if (prodConfig) {
      try {
        firebaseApp = initializeApp(prodConfig);
      } catch (e) {
        console.error("Firebase production init failed:", e);
        // Fallback if needed
        firebaseApp = initializeApp(devFirebaseConfig);
      }
    } else {
      // Fallback for environments like Firebase App Hosting which inject config automatically
      try {
        firebaseApp = initializeApp();
      } catch (e) {
        console.error(
          "Firebase initialization failed. Ensure environment variables (NEXT_PUBLIC_FIREBASE_*) are set."
        );
        firebaseApp = initializeApp(devFirebaseConfig);
      }
    }
  } else {
    // For development, use the hardcoded config file
    try {
      firebaseApp = initializeApp(devFirebaseConfig);
    } catch (e) {
      console.error("Firebase development init failed:", e);
      return {
        firebaseApp: null,
        auth: null,
        firestore: null,
        storage: null
      };
    }
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  if (!firebaseApp) {
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
      storage: null
    };
  }

  let auth = null;
  try {
    auth = getAuth(firebaseApp);
  } catch (e) {
    console.warn("Firebase Auth initialization failed:", e);
  }

  let storage = null;
  try {
    storage = getStorage(firebaseApp);
  } catch (e) {
    console.warn("Firebase Storage initialization failed:", e);
  }

  let firestore = null;
  try {
    firestore = getFirestore(firebaseApp);
    // Basic sanity check to ensure it's a valid object
    if (firestore && (typeof firestore !== 'object' || Array.isArray(firestore))) {
      console.error("Invalid Firestore instance returned");
      firestore = null;
    }
  } catch (e) {
    console.error("Firebase Firestore initialization failed:", e);
    firestore = null;
  }

  return {
    firebaseApp,
    auth,
    firestore,
    storage
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
// export * from './auth/use-user'; // Removed to avoid conflict with provider's useUser
export * from './errors';
export * from './error-emitter';
