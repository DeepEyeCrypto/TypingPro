// ═══════════════════════════════════════════════════════════════════
// USE FIREBASE AUTH: Firebase-based authentication with Google/GitHub
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../core/store/authStore';
import { syncService } from '../core/syncService';
import { toast } from '../core/store/toastStore';

export interface User {
    id: string;
    name: string;
    email?: string;
    avatar_url?: string;
    provider: string;
    token: string;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

export const useFirebaseAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get authStore actions for cross-store sync
    const { setAuthenticated, logout: authStoreLogout } = useAuthStore();

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const profile = await mapFirebaseUserToProfile(firebaseUser);
                setUser(profile);

                // Sync with Zustand authStore
                await setAuthenticated(
                    {
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        avatar_url: profile.avatar_url,
                        provider: profile.provider as 'google' | 'github',
                    },
                    profile.token
                );
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [setAuthenticated]);

    const mapFirebaseUserToProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
        const token = await firebaseUser.getIdToken();
        const providerId = firebaseUser.providerData[0]?.providerId || 'unknown';

        return {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || undefined,
            avatar_url: firebaseUser.photoURL || undefined,
            provider: providerId.includes('google') ? 'google' :
                providerId.includes('github') ? 'github' : 'firebase',
            token: token,
        };
    };

    const login = useCallback(async (provider: 'google' | 'github') => {
        setIsLoading(true);
        setError(null);

        try {
            const authProvider = provider === 'google' ? googleProvider : githubProvider;
            const result = await signInWithPopup(auth, authProvider);

            const profile = await mapFirebaseUserToProfile(result.user);
            setUser(profile);

            // Sync with Zustand authStore
            await setAuthenticated(
                {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    avatar_url: profile.avatar_url,
                    provider: profile.provider as 'google' | 'github',
                },
                profile.token
            );

            // Pull cloud data after successful login
            try {
                await syncService.pullFromCloud();
            } catch (syncErr) {
                console.warn('Cloud sync failed after login:', syncErr);
            }

            toast.success(`Welcome back, ${profile.name}!`);
            setIsLoading(false);
        } catch (err: any) {
            console.error('Firebase auth failed:', err);

            let errorMessage = 'Login failed';
            if (err.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login cancelled';
            } else if (err.code === 'auth/popup-blocked') {
                errorMessage = 'Popup was blocked. Please allow popups for this site.';
            } else if (err.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account with this email already exists with a different provider.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            toast.error(errorMessage);
            setIsLoading(false);
        }
    }, [setAuthenticated]);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            setUser(null);
            authStoreLogout();
            toast.info('You have been signed out.');
        } catch (err: any) {
            console.error('Logout failed:', err);
            toast.error('Failed to sign out');
        }
    }, [authStoreLogout]);

    return { user, login, logout, isLoading, error };
};

export default useFirebaseAuth;
