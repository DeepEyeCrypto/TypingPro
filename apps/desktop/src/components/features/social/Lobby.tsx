// ═══════════════════════════════════════════════════════════════════
// LOBBY: VisionOS-style matchmaking and duel preparation
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { matchmakingService } from '../../../core/matchmakingService';
import { useAuthStore } from '../../../core/store/authStore';
import { GlassCard } from '../../ui/GlassCard';

interface Props {
    onBack: () => void;
    onMatchFound: (matchId: string) => void;
}

const Lobby: React.FC<Props> = ({ onBack, onMatchFound }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [statusText, setStatusText] = useState("Ready to Duel?");
    const { user } = useAuthStore();

    useEffect(() => {
        let interval: any;
        if (isSearching) {
            interval = setInterval(async () => {
                if (user) {
                    const matchId = await matchmakingService.findAndCreateMatch(user.name || "Typist", user.avatar_url || "");
                    if (matchId) {
                        onMatchFound(matchId);
                    }
                }
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
            if (isSearching) {
                matchmakingService.leaveQueue();
                matchmakingService.stopListening();
            }
        };
    }, [isSearching, user]);

    const handleFindMatch = async () => {
        if (!user) return;
        try {
            setIsSearching(true);
            setStatusText("Searching for worthy adversary...");
            await matchmakingService.joinQueue(user.name || "Unknown", user.avatar_url || "", 50);
            matchmakingService.listenForMatch((matchId) => {
                setStatusText("Match Found! Entering Arena...");
                setTimeout(() => onMatchFound(matchId), 1500);
            });
        } catch (error) {
            console.error(error);
            setStatusText("Error joining queue.");
            setIsSearching(false);
        }
    };

    const handleCancel = async () => {
        await matchmakingService.leaveQueue();
        matchmakingService.stopListening();
        setIsSearching(false);
        setStatusText("Ready to Duel?");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-2xl mx-auto p-6 animate-in fade-in duration-700">

            <GlassCard variant="large" className="w-full flex flex-col items-center py-16 gap-8 text-center relative overflow-hidden">

                {/* Visualizer / Radar */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {isSearching ? (
                        <>
                            <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full animate-ping" />
                            <div className="absolute inset-4 border-2 border-white/10 rounded-full animate-pulse" />
                            <div className="absolute inset-8 border border-white/5 rounded-full" />
                            <div className="z-10 text-6xl animate-bounce">⚔️</div>
                        </>
                    ) : (
                        <div className="z-10 text-6xl drop-shadow-2xl grayscale opacity-50">⚔️</div>
                    )}
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">{statusText}</h2>
                    <p className="glass-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Neural Matchmaking Protocol</p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
                    {!isSearching ? (
                        <button
                            onClick={handleFindMatch}
                            className="glass-pill w-full py-4 text-sm font-black text-gray-900 shadow-xl active:scale-95 transition-all uppercase tracking-widest"
                        >
                            Request Access
                        </button>
                    ) : (
                        <button
                            onClick={handleCancel}
                            className="w-full py-4 text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]"
                        >
                            Abort Signal Search
                        </button>
                    )}
                </div>

                {/* Legend / Tip */}
                <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-between">
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Latency: 14ms</span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Arena: US-EAST-1</span>
                </div>
            </GlassCard>

            <button
                onClick={onBack}
                className="mt-12 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] hover:text-white transition-colors decoration-none"
            >
                ← Return to Hub
            </button>
        </div>
    );
};

export default Lobby;
