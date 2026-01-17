import { load } from '@tauri-apps/plugin-store';

// Initialize the store
// We use a lazy initialization pattern because load() is async
let store: Awaited<ReturnType<typeof load>> | null = null;

const getStore = async () => {
    if (!store) {
        store = await load('settings.dat', { autoSave: true });
    }
    return store;
};

export const storeService = {
    set: async (key: string, value: any) => {
        try {
            const s = await getStore();
            await s.set(key, value);
            await s.save(); // Ensure write to disk immediately for safety
        } catch (err) {
            console.error('Store set failed:', err);
        }
    },

    get: async <T>(key: string): Promise<T | null> => {
        try {
            const s = await getStore();
            const val = await s.get<T>(key);
            return val || null; // Normalize undefined to null
        } catch (err) {
            console.error('Store get failed:', err);
            return null;
        }
    },

    remove: async (key: string) => {
        try {
            const s = await getStore();
            await s.delete(key);
            await s.save();
        } catch (err) {
            console.error('Store remove failed:', err);
        }
    },

    // Specific Auth Helpers
    setAuthToken: async (token: string) => {
        await storeService.set('auth_token', token);
    },

    getAuthToken: async () => {
        return await storeService.get<string>('auth_token');
    },

    setUserProfile: async (user: any) => {
        await storeService.set('auth_user', user);
    },

    getUserProfile: async () => {
        return await storeService.get<any>('auth_user');
    },

    clearAuth: async () => {
        await storeService.remove('auth_token');
        await storeService.remove('auth_user');
    }
};
