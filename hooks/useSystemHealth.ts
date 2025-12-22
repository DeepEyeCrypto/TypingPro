import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export interface SystemHealth {
    frontendEnvOk: boolean;
    googleBackendOk: boolean;
    githubBackendOk: boolean;
    errors: string[];
}

export function useSystemHealth() {
    const [health, setHealth] = useState<SystemHealth>({
        frontendEnvOk: false,
        googleBackendOk: false,
        githubBackendOk: false,
        errors: []
    });

    const checkHealth = useCallback(async () => {
        const errors: string[] = [];

        // 1. Check Frontend Env
        const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const githubId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const googleRedirect = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
        const githubRedirect = import.meta.env.VITE_GITHUB_REDIRECT_URI;

        const frontendEnvOk = !!(googleId && githubId && googleRedirect && githubRedirect);
        if (!frontendEnvOk) {
            if (!googleId) errors.push("VITE_GOOGLE_CLIENT_ID missing");
            if (!githubId) errors.push("VITE_GITHUB_CLIENT_ID missing");
            if (!googleRedirect) errors.push("VITE_GOOGLE_REDIRECT_URI missing");
            if (!githubRedirect) errors.push("VITE_GITHUB_REDIRECT_URI missing");
        }

        // 2. Check Backend Env
        let googleBackendOk = false;
        let githubBackendOk = false;

        try {
            const backendConfig = await invoke<any>('get_backend_config');
            googleBackendOk = backendConfig.google_client_id_loaded && backendConfig.google_client_secret_loaded;
            githubBackendOk = backendConfig.github_client_id_loaded && backendConfig.github_client_secret_loaded;

            if (!googleBackendOk) errors.push("Backend: Google keys not loaded");
            if (!githubBackendOk) errors.push("Backend: GitHub keys not loaded");
        } catch (err) {
            errors.push(`Backend communication error: ${err}`);
        }

        setHealth({
            frontendEnvOk,
            googleBackendOk,
            githubBackendOk,
            errors
        });
    }, []);

    useEffect(() => {
        checkHealth();
    }, [checkHealth]);

    return { health, refresh: checkHealth };
}
