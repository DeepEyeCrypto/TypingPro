/**
 * Environment Configuration Utility
 * Provides safe, typed access to VITE_ prefixed environment variables.
 */

export interface AppConfig {
    googleClientId: string;
    githubClientId: string;
    mode: string;
    isDev: boolean;
}

const getEnv = (key: string, defaultValue = ''): string => {
    const value = (import.meta as any).env[key];
    if (value === undefined || value === null) return defaultValue;
    return value;
};

export const config: AppConfig = {
    googleClientId: getEnv('VITE_GOOGLE_CLIENT_ID'),
    githubClientId: getEnv('VITE_GITHUB_CLIENT_ID'),
    mode: (import.meta as any).env.MODE || 'development',
    isDev: (import.meta as any).env.DEV || false,
};

export const validateConfig = () => {
    const missing: string[] = [];
    if (!config.googleClientId || config.googleClientId.includes('your_')) missing.push('VITE_GOOGLE_CLIENT_ID');
    if (!config.githubClientId || config.githubClientId.includes('your_')) missing.push('VITE_GITHUB_CLIENT_ID');

    return {
        isValid: missing.length === 0,
        missing
    };
};

export default config;
