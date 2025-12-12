import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';

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
            // @ts-ignore - Check for placeholder API key manually before invoking SDK
            const apiKey = auth.app.options.apiKey;
            if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
                throw new Error("Firebase API Key is missing or invalid. Please configure services/firebase.ts");
            }

            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error: any) {
            console.error("Auth Service: Login Failed", error);
            throw error; // Re-throw for UI to handle
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
