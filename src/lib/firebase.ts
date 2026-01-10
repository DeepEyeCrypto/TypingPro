import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// --- RUNTIME ASSERTIONS ---
if (import.meta.env.PROD) {
    const REQUIRED = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID'] as const;
    REQUIRED.forEach(key => {
        if (!import.meta.env[key as keyof ImportMetaEnv]) {
            throw new Error(`FIREBASE CRITICAL: Missing ${key} in production!`);
        }
    });
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | undefined;
let rtdb: Database;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    rtdb = getDatabase(app);

    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
    }
} catch (error) {
    console.error("FIREBASE INITIALIZATION ERROR:", error);
    throw error;
}

export { app, db, auth, rtdb, analytics };
