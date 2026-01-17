import React, { useEffect, useState } from 'react';
import { useAchievementStore } from '../../../core/store/achievementStore';
// import { AudioEngine } from '../../../lib/AudioEngine'; // TODO: Restore when AudioEngine is available
import { GlassCard } from '../../ui/GlassCard';

export const AchievementToast: React.FC = () => {
    const { notifications, clearNotification } = useAchievementStore();
    const [active, setActive] = useState<any | null>(null);

    useEffect(() => {
        if (!active && notifications.length > 0) {
            const next = notifications[0];
            setActive(next);

            // Play success sound
            // AudioEngine.getInstance().playSuccess(); // TODO: Restore when AudioEngine is available

            // Auto-clear
            const timeoutMs = next.onAction ? 10000 : 5000;
            const timer = setTimeout(() => {
                handleClose(next.id);
            }, timeoutMs);

            return () => clearTimeout(timer);
        }
    }, [notifications, active]);

    const handleClose = (id: string) => {
        setActive(null);
        setTimeout(() => clearNotification(id), 500);
    };

    if (!active) return null;

    return (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999] animate-celebrate">
            <GlassCard
                variant="glass"
                className="p-1 px-1 border-white/10 shadow-glass-deep min-w-[420px]"
            >
                <div className="flex items-center gap-6 p-5">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl border border-white/20 shadow-inner filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            {active.icon || '🏆'}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-glow animate-pulse">
                            <span className="text-black text-[10px] font-black">!</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Achievement_Unlocked</div>
                        <h4 className="text-white font-black text-lg tracking-tight leading-tight uppercase">
                            {active.title || 'Signal_Detected'}
                        </h4>
                        <p className="text-white/60 font-medium text-sm mt-1">{active.message}</p>

                        {active.reward && (
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <span className="text-white font-black text-[10px] uppercase tracking-widest">+{active.reward} KEYSTONES</span>
                                <span className="text-xs">💎</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 ml-4">
                        {active.onAction && (
                            <button
                                onClick={() => {
                                    active.onAction();
                                    handleClose(active.id);
                                }}
                                className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-glow"
                            >
                                {active.actionLabel || 'EXECUTE'}
                            </button>
                        )}
                        <button
                            onClick={() => handleClose(active.id)}
                            className="p-2.5 text-white/20 hover:text-white/100 transition-colors self-end"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </GlassCard>

            <style>{`
                @keyframes celebrate {
                    0% { transform: translate(-50%, 150px) scale(0.8); opacity: 0; filter: blur(10px); }
                    60% { transform: translate(-50%, -10px) scale(1.02); opacity: 1; filter: blur(0px); }
                    100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                }
                .animate-celebrate {
                    animation: celebrate 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};
