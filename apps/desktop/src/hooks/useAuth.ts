// ═══════════════════════════════════════════════════════════════════
// USE AUTH: Hybrid Tauri Deep-Link + Firebase Authentication
// ═══════════════════════════════════════════════════════════════════
//
// 1. App initiates login via Rust (invoke('get_oauth_url'))
// 2. Rust opens system browser with PKCE
// 3. Browser redirects back to typingpro://auth/callback
// 4. Tauri Deep Link plugin catches the code/state
// 5. Rust exchanges code for profile + token
// 6. Frontend receives profile and logs into Firebase for cloud sync
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import { onOpenUrl as onDeepLinkOpenUrl } from '@tauri-apps/plugin-deep-link';
import {
    signInWithCredential,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth as firebaseAuth } from '../lib/firebase';
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

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user_session');
        return stored ? JSON.parse(stored) : null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setAuthenticated, logout: authStoreLogout } = useAuthStore();

    const login = useCallback(async (provider: 'google' | 'github') => {
        setIsLoading(true);
        setError(null);
        try {
            // Get PKCE Auth URL from Rust
            const url = await invoke<string>('get_oauth_url', { provider });
            localStorage.setItem('pending_auth_provider', provider);

            // Open System Browser
            await open(url);
        } catch (err: any) {
            console.error('Login failed to start:', err);
            setError(err.toString());
            toast.error('Failed to start login flow.');
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await firebaseSignOut(firebaseAuth);
            setUser(null);
            localStorage.removeItem('user_session');
            authStoreLogout();
            toast.info('You have been signed out.');
        } catch (err) {
            console.error('Logout error:', err);
        }
    }, [authStoreLogout]);

    const handleAuthCallback = useCallback(async (urlStr: string) => {
        // Support both deep link and localhost callback
        if (!urlStr.includes('typingpro://auth/callback') && !urlStr.includes('/auth/google/callback')) {
            return;
        }

        try {
            setIsLoading(true);
            const url = new URL(urlStr);
            const code = url.searchParams.get('code');
            const state = url.searchParams.get('state');

            if (!code || !state) {
                setIsLoading(false);
                return;
            }

            const provider = localStorage.getItem('pending_auth_provider') || 'google';

            // Exchange code for profile via Rust
            const profile = await invoke<User>('exchange_auth_token', {
                provider,
                code,
                state
            });

            // --- FIREBASE SYNC ---
            try {
                const credential = provider === 'google'
                    ? GoogleAuthProvider.credential(profile.token)
                    : GithubAuthProvider.credential(profile.token);

                await signInWithCredential(firebaseAuth, credential);
                console.log('Successfully synced with Firebase Auth');
            } catch (fbErr) {
                console.warn('Firebase sync failed, but local auth succeeded:', fbErr);
            }

            // Update local and store
            setUser(profile);
            localStorage.setItem('user_session', JSON.stringify(profile));
            localStorage.removeItem('pending_auth_provider');

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

            try {
                await syncService.pullFromCloud();
            } catch (syncErr) {
                console.warn('Cloud sync failed after login:', syncErr);
            }

            toast.success(`Welcome back, ${profile.name}!`);
            setIsLoading(false);

            // If we're on a callback URL, clean up the address bar
            if (window.location.search) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (err: any) {
            console.error('Auth callback error:', err);
            toast.error('Authentication failed.');
            setIsLoading(false);
        }
    }, [setAuthenticated]);

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const initAuth = async () => {
            // 1. Check current URL for callback (Localhost flow)
            if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
                handleAuthCallback(window.location.href);
            }

            // 2. Listen for Deep Links (Production flow)
            unlisten = await onDeepLinkOpenUrl(async (urls) => {
                for (const urlStr of urls) {
                    handleAuthCallback(urlStr);
                }
            });
        };

        initAuth();
        return () => { if (unlisten) unlisten(); };
    }, [handleAuthCallback]);

    // On mount, sync session
    useEffect(() => {
        if (user && !useAuthStore.getState().user) {
            setAuthenticated(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url,
                    provider: user.provider as 'google' | 'github',
                },
                user.token
            );
        }
    }, [user, setAuthenticated]);

    return { user, login, logout, isLoading, error };
};

export default useAuth;
