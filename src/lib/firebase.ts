import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

console.log("FIREBASE: Loading Module...");

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app: any = null;
let db: Firestore;
let auth: Auth;

try {
    // Check for critical keys
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.error("FIREBASE: Missing API Key or Project ID in env vars!", firebaseConfig);
        throw new Error("Missing Firebase Config");
    }

    console.log("FIREBASE: Initializing...");
    app = initializeApp(firebaseConfig);
    console.log("FIREBASE: App Initialized");

    db = getFirestore(app);
    console.log("FIREBASE: Firestore Initialized");

    auth = getAuth(app);
    console.log("FIREBASE: Auth Initialized");

} catch (e) {
    console.error("FIREBASE CRITICAL FAILURE:", e);
    // Explicitly set db/auth to undefined or a throw-proxy so usage is clear
    // But for existing code safety, we'll keep the mock but log louder.
    // The issue is doc() expects a FirebaseFirestore instance. {} is not one.

    // We should probably NOT export mock objects if they aren't functional.
    // However, to prevent import crashes, we might need value.
    // Let's rely on the console.error being visible.

    // BETTER FIX: Re-throw if critical.
    throw e;
}

export { db, auth };
