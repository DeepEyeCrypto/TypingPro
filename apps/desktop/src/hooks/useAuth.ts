import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
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

    // Get authStore actions for cross-store sync
    const { setAuthenticated, logout: authStoreLogout, setGuest } = useAuthStore();

    const login = useCallback(async (provider: 'google' | 'github') => {
        setIsLoading(true);
        setError(null);
        try {
            // Get PKCE Auth URL from Rust
            const url = await invoke<string>('get_oauth_url', { provider });

            // Store provider for logging/debug if needed, though Rust handles state map
            localStorage.setItem('pending_auth_provider', provider);

            // Open System Browser
            await open(url);
        } catch (err: any) {
            console.error('Login failed init:', err);
            setError(err.toString());
            toast.error('Failed to start login. Please try again.');
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user_session');
        localStorage.removeItem('pending_auth_provider');
        // Also update the Zustand store
        authStoreLogout();
        toast.info('You have been signed out.');
    }, [authStoreLogout]);

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const initDeepLink = async () => {
            unlisten = await onOpenUrl(async (urls) => {
                console.log('Deep link received:', urls);
                for (const urlStr of urls) {
                    if (urlStr.includes('typingpro://auth/callback')) {
                        try {
                            setIsLoading(true);
                            setError(null);
                            // Parse URL manually or use URL object
                            const url = new URL(urlStr);
                            const code = url.searchParams.get('code');
                            const state = url.searchParams.get('state');

                            if (!code || !state) {
                                throw new Error('Missing code or state in callback');
                            }

                            const provider = localStorage.getItem('pending_auth_provider') || 'unknown';

                            // Exchange code for profile
                            const profile = await invoke<User>('exchange_auth_token', {
                                provider,
                                code,
                                state
                            });

                            // Update local state
                            setUser(profile);
                            localStorage.setItem('user_session', JSON.stringify(profile));
                            localStorage.removeItem('pending_auth_provider');

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
                            console.error('Token exchange failed:', err);
                            const errorMsg = typeof err === 'string' ? err : err.message || 'Login failed';
                            setError(errorMsg);
                            toast.error(`Login failed: ${errorMsg}`);
                            setIsLoading(false);
                        }
                    }
                }
            });
        };

        initDeepLink();

        return () => {
            if (unlisten) unlisten();
        };
    }, [setAuthenticated]);

    // On mount, sync local storage user with Zustand store
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

