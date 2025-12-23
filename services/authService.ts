import { invoke } from '@tauri-apps/api/tauri';
import { Store } from 'tauri-plugin-store-api';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    picture: string;
    token: string;
}

const store = new Store('auth_store.dat');

export interface PublicOAuthConfig {
    google_client_id: string;
    google_redirect_uri: string;
    github_client_id: string;
    github_redirect_uri: string;
    has_gemini_key: boolean;
}

export const authService = {
    /**
     * Gets the public OAuth configuration from the backend.
     */
    getPublicConfig: async (): Promise<PublicOAuthConfig> => {
        return await invoke<PublicOAuthConfig>('get_oauth_config');
    },

    /**
     * Initiates Google Sign-In via native system browser.
     */
    signInWithGoogle: async (): Promise<void> => {
        try {
            const config = await authService.getPublicConfig();
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.google_client_id}&redirect_uri=${encodeURIComponent(config.google_redirect_uri)}&response_type=code&scope=openid%20profile%20email`;
            await invoke('log_to_file', { msg: `Opening Google Auth: ${authUrl}` });
            // Use Tauri shell to open browser
            const { open } = await import('@tauri-apps/api/shell');
            await open(authUrl);
        } catch (error) {
            console.error("Google Auth Start Failed", error);
            throw error;
        }
    },

    /**
     * Initiates GitHub Sign-In.
     */
    signInWithGithub: async (): Promise<void> => {
        try {
            const config = await authService.getPublicConfig();
            const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.github_client_id}&redirect_uri=${encodeURIComponent(config.github_redirect_uri)}&scope=user:email`;
            await invoke('log_to_file', { msg: `Opening GitHub Auth: ${authUrl}` });
            const { open } = await import('@tauri-apps/api/shell');
            await open(authUrl);
        } catch (error) {
            console.error("GitHub Auth Start Failed", error);
            throw error;
        }
    },

    /**
     * Exchanges a code for a user session.
     */
    completeOAuthFlow: async (provider: string, code: string): Promise<AuthUser> => {
        try {
            const userData = await invoke<any>('exchange_oauth_code', { provider, code });

            if (userData.access_token) {
                const user: AuthUser = {
                    id: (userData.id || userData.sub || '').toString(),
                    name: userData.name || userData.login || 'User',
                    email: userData.email || '',
                    picture: userData.picture || userData.avatar_url || '',
                    token: userData.access_token
                };
                await store.set('user', user);
                await store.save();
                return user;
            }
            throw new Error("OAuth exchange failed: No access token received.");
        } catch (error) {
            console.error(`${provider} Exchange Failed`, error);
            throw error;
        }
    },

    /**
     * Signs out the current user.
     */
    signOutUser: async (): Promise<void> => {
        try {
            await store.delete('user');
            await store.save();
        } catch (error) {
            console.error("Auth Service: Logout Failed", error);
            throw error;
        }
    },

    /**
     * Gets the current user from secure store.
     */
    getCurrentUser: async (): Promise<AuthUser | null> => {
        try {
            const user = await store.get<AuthUser>('user');
            return user || null;
        } catch (e) {
            console.warn("Failed to load user from store", e);
            return null;
        }
    }
};

