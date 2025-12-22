import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export interface ConfigHealth {
    google_client_id_loaded: boolean;
    google_client_secret_loaded: boolean;
    github_client_id_loaded: boolean;
    github_client_secret_loaded: boolean;
}

export const useOAuthConfig = () => {
    const [configHealth, setConfigHealth] = useState<ConfigHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [isViteOk, setIsViteOk] = useState(false);

    const refreshHealth = async () => {
        setLoading(true);
        try {
            const health = await invoke<ConfigHealth>('get_backend_config');
            setConfigHealth(health);

            // Check Vite Env
            const env = (import.meta as any).env;
            const googleOk = !!env.VITE_GOOGLE_CLIENT_ID;
            const githubOk = !!env.VITE_GITHUB_CLIENT_ID;
            setIsViteOk(googleOk && githubOk);
        } catch (e) {
            console.error('Failed to fetch config health:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshHealth();
    }, []);

    const allLoaded = configHealth ? (
        configHealth.google_client_id_loaded &&
        configHealth.google_client_secret_loaded &&
        configHealth.github_client_id_loaded &&
        configHealth.github_client_secret_loaded
    ) : false;

    return { configHealth, loading, isViteOk, allLoaded, refreshHealth };
};
