import { getVersion } from '@tauri-apps/api/app';

/**
 * Returns the application version using Tauri APIs.
 * Fallbacks to package.json version in dev environment if needed (or mocked).
 */
export const getAppVersion = async (): Promise<string> => {
    try {
        const version = await getVersion();
        return `v${version}`;
    } catch (error) {
        console.warn("Failed to get app version (likely not running in Tauri context):", error);
        return "vX.Y.Z (Dev)";
    }
};
