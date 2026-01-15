import React, { useEffect, useState } from 'react';
import '../styles/glass.css';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setOpacity(0), 500); // Fade out
                    setTimeout(onComplete, 1000); // Unmount
                    return 100;
                }
                return prev + 2; // 50 ticks * 20ms = 1000ms (~1s load + delay)
            });
        }, 20);

        return () => clearInterval(interval);
    }, [onComplete]);

    if (opacity === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            color: '#000000',
            zIndex: 9999,
            opacity: opacity,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: 'none'
        }}>
            <div className="liquid-glass-card" style={{ padding: '3rem', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    marginBottom: '0.5rem',
                    color: '#000000',
                    letterSpacing: '-2px',
                    textTransform: 'uppercase'
                }}>
                    TypingPro
                </h1>
                <p style={{ color: '#000', opacity: 0.3, fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem' }}>
                    Elite Typing Engine
                </p>

                <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#000',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                        transition: 'width 0.1s linear'
                    }} />
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#000', opacity: 0.4 }}>
                    v1.2.1 [RUST::CORE::ACTIVE] (SAFE_MODE)
                </div>
            </div>
        </div>
    );
};
