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
            ${status === 'online' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                status === 'offline' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    'bg-white/5 border-white/10 text-white/40'}
            text-[10px] uppercase font-bold tracking-wider
        `}>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-400 shadow-[0_0_8px_rgba(0,255,65,0.5)]' : status === 'offline' ? 'bg-red-400' : 'bg-gray-400 animate-pulse'}`} />
            <span>{status === 'online' ? 'NET' : status === 'offline' ? 'OFFLINE' : 'CONNECTING'}</span>

            {status === 'online' && ping !== null && (
                <span className="opacity-50 border-l border-current pl-2 ml-1 font-mono">
                    {ping}ms
                </span>
            )}
        </div>
    );
};
