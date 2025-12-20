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
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
            <div className="bg-black/80 border border-white/10 rounded-xl p-3 shadow-xl flex flex-col gap-1 min-w-[120px]">
                <div className="flex justify-between items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Performance</span>
                    <div className={`w-2 h-2 rounded-full ${stats.fps >= 55 ? 'bg-green-500' : 'bg-red-500 shadow-red-500/50 shadow-sm animate-pulse'}`} />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xl font-black text-white">{stats.fps}</span>
                        <span className="text-[10px] font-bold text-white/30 ml-1">FPS</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className={`text-sm font-bold ${stats.latency < 16 ? 'text-brand' : 'text-red-400'}`}>
                            {stats.latency}ms
                        </span>
                        <span className="text-[10px] font-bold text-white/30 ml-1">LATENCY</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
