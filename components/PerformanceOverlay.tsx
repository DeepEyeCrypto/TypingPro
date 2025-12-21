import React, { useEffect, useState, useRef } from 'react';
import { PerformanceMonitor } from '../src/utils/performanceMonitor';

export const PerformanceOverlay: React.FC = () => {
    const [stats, setStats] = useState({ fps: 0, latency: 0 });
    const requestRef = useRef<number | undefined>(undefined);
    const framesRef = useRef(0);
    const lastTimeRef = useRef(performance.now());

    useEffect(() => {
        const update = () => {
            framesRef.current++;
            const now = performance.now();
            const elapsed = now - lastTimeRef.current;

            if (elapsed >= 1000) {
                const fps = Math.round((framesRef.current * 1000) / elapsed);
                // Get last measured latency from the monitor
                const measures = performance.getEntriesByName('keystroke-response', 'measure');
                const lastLatency = measures.length > 0 ? measures[measures.length - 1].duration : 0;

                setStats({ fps, latency: Number(lastLatency.toFixed(2)) });

                // Adaptive Performance: Toggle perf-mode if FPS < 55
                if (fps < 55) {
                    document.body.classList.add('perf-mode');
                } else if (fps >= 59) {
                    document.body.classList.remove('perf-mode');
                }

                framesRef.current = 0;
                lastTimeRef.current = now;
            }
            requestRef.current = requestAnimationFrame(update);
        };

        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            document.body.classList.remove('perf-mode');
        };
    }, []);

    if (process.env.NODE_ENV === 'production' && !window.location.search.includes('debug=true')) {
        // return null; // Hide in production unless debug
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
            <div className="glass-premium px-4 py-2 flex items-center gap-4 bg-white/5 border-white/5 shadow-2xl">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black transition-colors ${stats.fps >= 55 ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {stats.fps}
                    </span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">FPS</span>
                </div>

                <div className="w-px h-3 bg-white/10" />

                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black transition-colors ${stats.latency < 16 ? 'text-sky-400' : 'text-rose-500'}`}>
                        {stats.latency}ms
                    </span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">LATENCY</span>
                </div>
            </div>
        </div>
    );
};
