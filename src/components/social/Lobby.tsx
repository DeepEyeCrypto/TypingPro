import React, { useState, useEffect } from 'react';
import { matchmakingService } from '../../services/matchmakingService';
import { useAuthStore } from '../../stores/authStore';

interface Props {
    onBack: () => void;
    onMatchFound: (matchId: string) => void;
}

const Lobby: React.FC<Props> = ({ onBack, onMatchFound }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [statusText, setStatusText] = useState("Ready to Duel?");
    const { user } = useAuthStore();

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (isSearching) {
                matchmakingService.leaveQueue();
                matchmakingService.stopListening();
            }
        };
    }, [isSearching]);

    const handleFindMatch = async () => {
        if (!user) return;

        try {
            setIsSearching(true);
            setStatusText("Searching for worthy adversary...");

            // 1. Join Queue
            // For MVP, just using avg WPM of 50 if stats not ready?
            // Ideally fetch from store.
            await matchmakingService.joinQueue(user.name || "Unknown", user.avatar_url || "", 50);

            // 2. Listen
            matchmakingService.listenForMatch((matchId) => {
                setStatusText("Match Found! Entering Arena...");
                setTimeout(() => {
                    onMatchFound(matchId);
                }, 1500);
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
        <div className="flex flex-col items-center justify-center h-full text-cyan-400 font-mono relative">
            <button onClick={onBack} className="absolute top-8 left-8 text-sm hover:text-white uppercase tracking-widest opacity-50 hover:opacity-100">← Exit Lobby</button>
            {/* Radar Animation Area */}
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
                {isSearching && (
                    <>
                        <div className="absolute w-full h-full border border-cyan-500/30 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute w-48 h-48 border border-cyan-500/50 rounded-full animate-pulse"></div>
                    </>
                )}
                <div className="z-10 text-6xl">⚔️</div>
            </div>

            <h2 className="text-2xl mb-4 font-bold tracking-widest uppercase">
                {statusText}
            </h2>

            {!isSearching ? (
                <button
                    onClick={handleFindMatch}
                    className="glass-button text-cyan-400 font-bold uppercase tracking-widest text-lg px-12 py-4"
                >
                    Find Match
                </button>
            ) : (
                <button
                    onClick={handleCancel}
                    className="mt-8 glass-button text-red-400 hover:text-red-300 text-sm border-red-500/30 hover:border-red-500/80"
                >
                    Cancel Search
                </button>
            )}
        </div>
    );
};

export default Lobby;
