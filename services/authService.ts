import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, User, setPersistence, browserLocalPersistence } from 'firebase/auth';

/**
 * Service to handle Authentication logic.
 * Abstracts the underlying Firebase implementation.
 */

export interface AuthUser extends User {
    // Extend if we need custom properties in the future
}

export const authService = {
    /**
     * Initiates Google Sign-In popup flow.
     * @returns Promise resolving to the signed-in User or throwing an error.
     */
    signInWithGoogle: async (): Promise<User> => {
        try {
            // @ts-ignore - Check for placeholder API key manually
            const apiKey = auth.app.options.apiKey;
            if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
                throw new Error("Firebase API Key is missing or invalid. Please configure services/firebase.ts");
            }

            // Ensure persistence is set to Local (survives browser restart)
            await setPersistence(auth, browserLocalPersistence);

            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error: any) {
            // Ignore popup closed by user, it's a normal cancellation
            if (error.code === 'auth/popup-closed-by-user') {
                console.log("Sign-in cancelled by user");
                throw new Error("Cancelled");
            }
            console.error("Auth Service: Login Failed", error);
            throw error;
        }
    },

    /**
     * Signs out the current user.
     */
    signOutUser: async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Auth Service: Logout Failed", error);
            throw error;
        }
    },

    /**
     * Gets the current synchronous user state (may be null if not loaded yet).
     * Note: Prefer using `useAuthState` or `onAuthStateChanged` for reactive updates.
     */
    getCurrentUser: (): User | null => {
        return auth.currentUser;
    }
};
