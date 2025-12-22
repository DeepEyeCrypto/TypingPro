import { invoke } from '@tauri-apps/api/tauri';

export interface AppConfig {
    googleClientId: string;
    githubClientId: string;
    mode: string;
    isDev: boolean;
    source: 'vite' | 'backend' | 'none';
}

export interface BackendConfig {
    google_client_id: string;
    github_client_id: string;
}

let cachedConfig: AppConfig | null = null;

const getViteEnv = (key: string): string | null => {
    // Explicit lookups for baked-in values
    if (key === 'VITE_GOOGLE_CLIENT_ID') {
        const val = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
        if (val && !val.includes('your_')) return val;
    }
    if (key === 'VITE_GITHUB_CLIENT_ID') {
        const val = (import.meta as any).env.VITE_GITHUB_CLIENT_ID;
        if (val && !val.includes('your_')) return val;
    }

    const value = (import.meta as any).env[key];
    if (!value || value.includes('your_')) return null;
    return value;
};

export const loadConfig = async (): Promise<AppConfig> => {
    // 1. Try Vite Env first
    const viteGoogle = getViteEnv('VITE_GOOGLE_CLIENT_ID');
    const viteGithub = getViteEnv('VITE_GITHUB_CLIENT_ID');

    if (viteGoogle && viteGithub) {
        cachedConfig = {
            googleClientId: viteGoogle,
            githubClientId: viteGithub,
            mode: (import.meta as any).env.MODE || 'development',
            isDev: (import.meta as any).env.DEV || false,
            source: 'vite'
        };
        console.log('[ConfigLoader] Config loaded from Vite env');
        return cachedConfig;
    }

    // 2. Fallback to Backend Bridge
    console.warn('[ConfigLoader] Vite env missing or incomplete. Attempting backend bridge...');
    try {
        const backend = await invoke<BackendConfig>('get_auth_config');
        if (backend.google_client_id && backend.github_client_id) {
            cachedConfig = {
                googleClientId: backend.google_client_id,
                githubClientId: backend.github_client_id,
                mode: (import.meta as any).env.MODE || 'development',
                isDev: (import.meta as any).env.DEV || false,
                source: 'backend'
            };
            console.log('[ConfigLoader] Config recovered from Backend Bridge');
            return cachedConfig;
        }
    } catch (e) {
        console.error('[ConfigLoader] Backend Bridge failed:', e);
    }

    // 3. Absolute Fallback
    return {
        googleClientId: '',
        githubClientId: '',
        mode: (import.meta as any).env.MODE || 'development',
        isDev: (import.meta as any).env.DEV || false,
        source: 'none'
    };
};

export const getConfigSync = (): AppConfig => {
    if (cachedConfig) return cachedConfig;
    return {
        googleClientId: getViteEnv('VITE_GOOGLE_CLIENT_ID') || '',
        githubClientId: getViteEnv('VITE_GITHUB_CLIENT_ID') || '',
        mode: (import.meta as any).env.MODE || 'development',
        isDev: (import.meta as any).env.DEV || false,
        source: 'vite'
    };
};
