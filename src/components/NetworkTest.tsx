import React, { useEffect, useState } from 'react';
import { AudioEngine } from '../lib/AudioEngine';

export const NetworkTest: React.FC = () => {
    const [status, setStatus] = useState<'testing' | 'online' | 'offline'>('testing');
    const [ping, setPing] = useState<number | null>(null);

    useEffect(() => {
        const startTime = performance.now();
        fetch('https://api.github.com', { mode: 'no-cors' })
            .then(() => {
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);
                setPing(duration);
                setStatus('online');
                // Small ping sound for online status
                AudioEngine.getInstance().playSuccess();
            })
            .catch(() => setStatus('offline'));
    }, []);

    return (
        <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border 
            ${status === 'online' ? 'bg-white/5 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' :
                status === 'offline' ? 'bg-white/10 border-white/40 text-white' :
                    'bg-white/5 border-white/10 text-white/40'}
            text-[10px] uppercase font-bold tracking-wider
        `}>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]' : status === 'offline' ? 'bg-white/30' : 'bg-white/20 animate-pulse'}`} />
            <span>{status === 'online' ? 'NET' : status === 'offline' ? 'OFFLINE' : 'CONNECTING'}</span>

            {status === 'online' && ping !== null && (
                <span className="opacity-30 border-l border-white/20 pl-2 ml-1 font-mono">
                    {ping}ms
                </span>
            )}
        </div>
    );
};
