/**
 * NUCLEAR OPTION: Global Mac GPU Killswitch
 * This utility strips all CSS filters and backdrop blurs on macOS
 * to prevent the WindowServer compositor from deadlocking (beachballing).
 */
export const disableHardwareAccelOnMac = () => {
    // Check if we are running in a Tauri/Desktop environment
    const isDesktop = (window as any).__TAURI_INTERNALS__ !== undefined;
    const isMac = navigator.userAgent.includes('Mac');

    if (isDesktop && isMac) {
        console.warn('☢️ NUCLEAR OPTION ACTIVE: Disabling all CSS filters for macOS stability.');

        const style = document.createElement('style');
        style.id = 'nuclear-gpu-killswitch';
        style.innerHTML = `
            * { 
                backdrop-filter: none !important; 
                -webkit-backdrop-filter: none !important;
                filter: none !important;
                transition: none !important; /* Secondary safety: remove heavy layout transitions */
            }
            /* Preserve readable backgrounds since blurs are gone */
            .glass, .glass-panel, [class*="glass"] {
                background: rgba(15, 15, 20, 0.98) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
            }
            [data-theme='arctic'] .glass, 
            [data-theme='arctic'] .glass-panel {
                background: rgba(255, 255, 255, 0.98) !important;
                border: 1px solid rgba(0, 0, 0, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }
};
