import React, { useEffect, useState } from 'react';
import { useAchievementStore } from '../../stores/achievementStore';
import { AudioEngine } from '../../lib/AudioEngine';

export const AchievementToast: React.FC = () => {
    const { notifications, clearNotification } = useAchievementStore();
    const [active, setActive] = useState<any | null>(null);

    useEffect(() => {
        if (!active && notifications.length > 0) {
            const next = notifications[0];
            setActive(next);

            // Play success sound
            AudioEngine.getInstance().playSuccess();

            // Auto-clear (longer if there's an action)
            const timeoutMs = next.onAction ? 10000 : 5000;
            const timer = setTimeout(() => {
                handleClose(next.id);
            }, timeoutMs);

            return () => clearTimeout(timer);
        }
    }, [notifications, active]);

    const handleClose = (id: string) => {
        setActive(null);
        setTimeout(() => clearNotification(id), 300);
    };

    if (!active) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-bounce-in">
            <div className="bg-black/90 border border-[#00ff41]/50 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(0,255,65,0.2)] min-w-[360px]">
                <div className="w-12 h-12 rounded-xl bg-[#00ff41]/10 flex items-center justify-center text-2xl border border-[#00ff41]/20">
                    {active.icon || '🏆'}
                </div>
                <div className="flex-1">
                    <h4 className="text-[#00ff41] font-bold text-sm tracking-widest uppercase">
                        {active.title || 'Achievement Unlocked'}
                    </h4>
                    <p className="text-white font-medium text-sm">{active.message}</p>
                    {active.reward && (
                        <div className="mt-1 flex items-center gap-1 text-[#ffd700] text-xs font-bold">
                            <span>+{active.reward} Keystones</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {active.onAction && (
                        <button
                            onClick={() => {
                                active.onAction();
                                handleClose(active.id);
                            }}
                            className="px-3 py-1.5 bg-[#00ff41] text-black text-[10px] font-black uppercase rounded-lg hover:bg-[#00ff41]/80 transition-all"
                        >
                            {active.actionLabel || 'VIEW'}
                        </button>
                    )}
                    <button
                        onClick={() => handleClose(active.id)}
                        className="text-white/20 hover:text-white transition-colors p-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes bounce-in {
                    0% { transform: translate(-50%, 100px) scale(0.9); opacity: 0; }
                    50% { transform: translate(-50%, -10px) scale(1.05); opacity: 1; }
                    100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </div>
    );
};
