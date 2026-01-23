/**
 * FLOW FRAMEWORK: STEP 4 - MAC APP GPU SAFETY MODE
 * Explicitly disables expensive GPU filters in desktop mac builds to prevent beachballing.
 */

export function enableMacSafeMode() {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const isTauri = !!(window as any).__TAURI__ || !!(window as any).__TAURI_METADATA__;
    const isElectron = !!(window as any).electron || !!(window as any).require;

    if (!isMac || (!isTauri && !isElectron)) {
        console.log('[MacSafeMode] Not on desktop Mac, skipping GPU constraints.');
        return;
    }

    const style = document.createElement('style');
    style.id = 'mac-gpu-safety-patch';
    style.textContent = `
    /* Disable expensive GPU filters in desktop mac build for stability */
    .glass-perfect,
    .card,
    .glass,
    .stats-card,
    .mode-card,
    .container-glass,
    .glass-panel {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
      transform: none !important;
      will-change: auto !important;
    }

    /* Force clean layers for simple components */
    .simple-card {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
  `;
    document.head.appendChild(style);
    console.warn('[MacSafeMode] CRITICAL: GPU-heavy filters disabled for desktop mac stability.');
}
