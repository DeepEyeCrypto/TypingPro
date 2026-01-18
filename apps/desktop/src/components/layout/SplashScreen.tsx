import React, { useEffect, useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
// import '../styles/glass.css';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusOpacity, setStatusOpacity] = useState(1);
    const [exitAnimation, setExitAnimation] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setExitAnimation(true), 500);
                    setTimeout(onComplete, 1200);
                    return 100;
                }
                // Varying speed for "organic" loading feel
                const increment = prev < 30 ? 4 : prev < 70 ? 2 : 1;
                return Math.min(100, prev + increment);
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onComplete]);

    // Status message cycling for flair
    const [statusMsg, setStatusMsg] = useState('Starting engine');
    useEffect(() => {
        const msgs = [
            'Setting up UI',
            'Connecting to cloud',
            'Loading your data',
            'Almost ready'
        ];
        let i = 0;
        const msgInterval = setInterval(() => {
            setStatusOpacity(0);
            setTimeout(() => {
                setStatusMsg(msgs[i % msgs.length]);
                setStatusOpacity(1);
                i++;
            }, 300);
        }, 2000);
        return () => clearInterval(msgInterval);
    }, []);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center glass-root transition-all duration-1000 ease-in-out
                ${exitAnimation ? 'opacity-0 scale-105 blur-2xl' : 'opacity-100 scale-100 blur-0'}`}
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />

            {/* Main Logo Cluster */}
            <div className="mb-12 text-center transform transition-all duration-700 animate-in fade-in zoom-in slide-in-from-bottom-8">
                <h1 className="text-6xl font-black tracking-tighter flex items-center justify-center gap-1 drop-shadow-2xl">
                    <span className="text-white">TYPING</span>
                    <span className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">PRO</span>
                </h1>
                <div className="mt-2 text-[10px] font-black text-white/20 uppercase tracking-[0.5em] flex items-center justify-center gap-4">
                    <span className="h-[1px] w-8 bg-white/10" />
                    ELITE TYPING ENGINE
                    <span className="h-[1px] w-8 bg-white/10" />
                </div>
            </div>

            {/* Central Loading Unit */}
            <GlassCard
                variant="glass"
                className="w-[420px] p-8 border-white/20 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.8)] glass-unified"
            >
                {/* Prismatic Sheen Integrated */}
                <div className="absolute inset-0 prismatic-sheen opacity-40 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Status Header */}
                    <div className="w-full flex justify-between items-end mb-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Status</span>
                            <span className={`text-xs font-black text-white transition-opacity duration-300 ${statusOpacity === 0 ? 'opacity-0' : 'opacity-100'}`}>
                                {statusMsg}...
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none">Progress</span>
                            <div className="text-2xl font-black text-white tabular-nums leading-none mt-1">{progress}%</div>
                        </div>
                    </div>

                    {/* Industrial Progress Bar */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px] relative">
                        <div
                            className="h-full bg-gradient-to-r from-white/20 via-white to-white/20 rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_white]"
                            style={{ width: `${progress}%` }}
                        />
                        {/* Shimmer effect on bar */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 animate-shimmer"
                            style={{ left: `${progress - 10}%` }}
                        />
                    </div>

                    {/* Version Checksum */}
                    <div className="mt-8 flex items-center gap-4 w-full pt-6 border-t border-white/5">
                        <div className="flex-1">
                            <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Platform</div>
                            <div className="text-[10px] font-black text-white/60">v1.2.54 [Stable]</div>
                        </div>
                        <div className="h-8 w-[1px] bg-white/5" />
                        <div className="flex-1 text-right">
                            <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Engine</div>
                            <div className="text-[10px] font-black text-cyan-400 drop-shadow-glow">Rust Native</div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Bottom Credits */}
            <div className="absolute bottom-12 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse">
                Liquid Glass V5 Architecture // Authorized Access Only
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite linear;
                }
            `}</style>
        </div>
    );
};
