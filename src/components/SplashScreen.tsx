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
            background: '#1a1a1a',
            color: '#fff',
            zIndex: 9999,
            opacity: opacity,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: 'none'
        }}>
            <div className="liquid-glass-card" style={{ padding: '3rem', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(45deg, #00f260, #0575e6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-1px'
                }}>
                    TypingPro
                </h1>
                <p style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem' }}>
                    Elite Typing Engine
                </p>

                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: '#00f260',
                        boxShadow: '0 0 10px #00f260',
                        transition: 'width 0.1s linear'
                    }} />
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#444' }}>
                    v1.2.1 [RUST::CORE::ACTIVE] (SAFE_MODE)
                </div>
            </div>
        </div>
    );
};
