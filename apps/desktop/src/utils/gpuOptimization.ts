/**
 * GPU Optimization Utility for TypingPro
 * Focuses on macOS performance in Tauri/Electron environments.
 */

export function disableGPUIntensiveEffects() {
    // Detect if running on macOS
    const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    // Detect Tauri or Electron
    const isTauri = !!(window as any).__TAURI__ || !!(window as any).__TAURI_METADATA__;
    const isElectron = !!(window as any).electron;

    if ((isTauri || isElectron) && isMacOS) {
        console.log('[GPU Optimization] macOS detected, applying intensive effects constraints');

        // Create style tag to enforce performance limits
        const style = document.createElement('style');
        style.id = 'gpu-optimization-override';
        style.textContent = `
      /* Global override for extreme performance */
      * {
        /* Faster transitions */
        transition-duration: 0.2s !important;
      }

      /* Enforce max blur for safety */
      [style*="backdrop-filter"], 
      .glass, .card, .glass-panel, .glass-perfect, .stats-card, .mode-card {
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        will-change: transform;
        backface-visibility: hidden;
      }

      /* Disable expensive animations if user prefers reduced motion */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize GPU optimization on app startup
 */
export function initGPUOptimization() {
    // Check after DOM is likely ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(disableGPUIntensiveEffects, 100);
        });
    } else {
        setTimeout(disableGPUIntensiveEffects, 100);
    }
}
