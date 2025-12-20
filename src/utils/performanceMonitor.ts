/**
 * PerformanceMonitor - Forensic Latency Tracking
 * Utility to identify rendering and processing bottlenecks.
 */
export const PerformanceMonitor = {
    startMeasure: (label: string) => {
        if (typeof window !== 'undefined' && window.performance) {
            performance.mark(`${label}-start`);
        }
    },
    endMeasure: (label: string) => {
        if (typeof window !== 'undefined' && window.performance) {
            try {
                performance.mark(`${label}-end`);
                performance.measure(label, `${label}-start`, `${label}-end`);
                const measure = performance.getEntriesByName(label, 'measure').pop();
                if (measure) {
                    // Log only if it exceeds an interesting threshold (e.g., 16ms for 60fps)
                    if (measure.duration > 16) {
                        console.warn(`[PERF] ⏱️ ${label} exceeded 16ms: ${measure.duration.toFixed(2)}ms`);
                    } else {
                        // Optional: verbose logging for debugging
                        // console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
                    }
                }
            } catch (e) {
                // Silently fail if marks are missing
            } finally {
                // Cleanup to prevent memory buildup from entries
                performance.clearMarks(`${label}-start`);
                performance.clearMarks(`${label}-end`);
                performance.clearMeasures(label);
            }
        }
    },
};
