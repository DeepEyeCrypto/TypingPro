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
        <div style={{
            position: 'fixed',
            bottom: '40px',
            right: '20px',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            fontSize: '0.7rem',
            zIndex: 10000,
            color: status === 'online' ? '#00ff41' : status === 'offline' ? '#ff4444' : '#888',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <span>{status === 'online' ? '✅ Online' : status === 'offline' ? '❌ Offline' : '📡 Testing...'}</span>
            {status === 'online' && ping !== null && (
                <span style={{
                    opacity: 0.8,
                    fontSize: '0.65rem',
                    borderLeft: '1px solid rgba(255,255,255,0.2)',
                    paddingLeft: '8px'
                }}>
                    {ping}ms
                </span>
            )}
        </div>
    );
};
