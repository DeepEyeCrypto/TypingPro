import React, { useEffect, useState } from 'react';

export const NetworkTest: React.FC = () => {
    const [status, setStatus] = useState<'testing' | 'online' | 'offline'>('testing');

    useEffect(() => {
        fetch('https://api.github.com', { mode: 'no-cors' })
            .then(() => setStatus('online'))
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
            fontFamily: 'monospace'
        }}>
            {status === 'online' ? '✅ Online' : status === 'offline' ? '❌ Offline' : '📡 Testing...'}
        </div>
    );
};
