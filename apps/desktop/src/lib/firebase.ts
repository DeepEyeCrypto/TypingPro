import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from 'firebase/analytics';
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

// --- SINGLETON INITIALIZATION ---
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);

let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
    isAnalyticsSupported().then(supported => {
        if (supported && firebaseConfig.measurementId) {
            analytics = getAnalytics(app);
        }
    });
}

// --- DIAGNOSTIC BRIDGE ---
export function getFirebaseDebugInfo() {
    return {
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        hasApiKey: Boolean(import.meta.env.VITE_FIREBASE_API_KEY),
        hasAuthDomain: Boolean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
        hasAppId: Boolean(import.meta.env.VITE_FIREBASE_APP_ID),
        appInitialized: !!app
    };
}

export { app, db, auth, rtdb, analytics };
