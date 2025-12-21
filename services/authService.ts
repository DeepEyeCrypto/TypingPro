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

export const authService = {
    /**
     * Initiates Google Sign-In via native system browser.
     * @returns Promise resolving to the signed-in User.
     */
    signInWithGoogle: async (): Promise<AuthUser> => {
        try {
            const user = await invoke<AuthUser>('login_google');
            await store.set('user', user);
            await store.save();
            return user;
        } catch (error) {
            console.error("Google Auth Failed", error);
            throw error;
        }
    },

    /**
     * Initiates GitHub Sign-In.
     */
    signInWithGithub: async (): Promise<AuthUser> => {
        try {
            const user = await invoke<AuthUser>('login_github');
            await store.set('user', user);
            await store.save();
            return user;
        } catch (error) {
            console.error("GitHub Auth Failed", error);
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

