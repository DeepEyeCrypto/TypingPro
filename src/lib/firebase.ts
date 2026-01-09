import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getDatabase, Database } from 'firebase/database';

console.log("FIREBASE: Loading Module...");

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app: any = null;
let db: Firestore = undefined as any;
let auth: Auth = undefined as any;
let analytics: Analytics = undefined as any;
let rtdb: Database = undefined as any;

try {
    // Check for critical keys
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.error("FIREBASE: Missing API Key or Project ID in env vars!", firebaseConfig);
        throw new Error("Missing Firebase Config");
    }

    console.log("FIREBASE: Initializing...");
    console.log(`FIREBASE: Using Project ID: ${firebaseConfig.projectId}`);
    app = initializeApp(firebaseConfig);
    console.log("FIREBASE: App Initialized");

    db = getFirestore(app);
    console.log("FIREBASE: Firestore Initialized");

    auth = getAuth(app);
    console.log("FIREBASE: Auth Initialized");

    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
        console.log("FIREBASE: Analytics Initialized");
    }

    rtdb = getDatabase(app);
    console.log("FIREBASE: RTDB Initialized");

} catch (e) {
    console.error("FIREBASE CRITICAL FAILURE:", e);
    if (typeof window !== 'undefined' && (window as any).debugLog) {
        (window as any).debugLog(`FIREBASE INIT FAILED: ${e}`, 'ERROR');
    }

    // CRITICAL FIX: Do NOT use {} as Firestore. This causes collection() to throw a confusing error.
    // We'll leave them as undefined so subsequent guards can catch them, or provide a safe way to handle.
    // Exporting them as undefined is safer than empty objects.
    app = null;
    (db as any) = null;
    (auth as any) = null;
}

export { db, auth, rtdb };

export function getFirebaseDebugInfo() {
    return {
        apiKey: !!firebaseConfig.apiKey ? `Present (${firebaseConfig.apiKey.toString().substring(0, 4)}...)` : 'MISSING',
        projectId: !!firebaseConfig.projectId ? `Present (${firebaseConfig.projectId})` : 'MISSING',
        authDomain: !!firebaseConfig.authDomain ? 'Present' : 'MISSING',
        initialized: !!app
    };
}
