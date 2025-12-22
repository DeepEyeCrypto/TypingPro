import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export interface ConfigHealth {
    google_client_id_loaded: boolean;
    google_client_secret_loaded: boolean;
    github_client_id_loaded: boolean;
    github_client_secret_loaded: boolean;
}

export interface SystemStatus {
    backend_env: Record<string, string>;
    cwd: string;
}

export const useOAuthConfig = () => {
    const [configHealth, setConfigHealth] = useState<ConfigHealth | null>(null);
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [isViteOk, setIsViteOk] = useState(false);
    const [viteErrors, setViteErrors] = useState<string[]>([]);

    const refreshHealth = async () => {
        setLoading(true);
        const errors: string[] = [];
        try {
            // 1. Fetch Backend Diagnostics
            const health = await invoke<ConfigHealth>('get_backend_config');
            const status = await invoke<SystemStatus>('get_system_status');

            setConfigHealth(health);
            setSystemStatus(status);

            // 2. Strict Vite Check
            const env = (import.meta as any).env;
            const required = [
                'VITE_GOOGLE_CLIENT_ID',
                'VITE_GITHUB_CLIENT_ID',
                'VITE_GOOGLE_REDIRECT_URI',
                'VITE_GITHUB_REDIRECT_URI'
            ];

            required.forEach(key => {
                const val = env[key];
                if (!val || val === '' || val.includes('your_')) {
                    errors.push(`Missing: ${key}`);
                }
            });

            if (errors.length > 0) {
                console.error('Vite Env Recovery Errors:', errors);
                setViteErrors(errors);
                setIsViteOk(false);
            } else {
                setIsViteOk(true);
                setViteErrors([]);
            }

        } catch (e) {
            console.error('System Health Bridge Failure:', e);
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

    return {
        configHealth,
        systemStatus,
        loading,
        isViteOk,
        viteErrors,
        allLoaded,
        refreshHealth
    };
};
