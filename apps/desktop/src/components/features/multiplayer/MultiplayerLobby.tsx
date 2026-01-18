import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonElements';
import { useAuthStore } from '@/core/store/authStore';
import { RaceTrack } from '../../components/multiplayer/RaceTrack';

export const MultiplayerLobby: React.FC = () => {
    const { connect, joinRoom, startMatch, gameState } = useGame();
    const { user } = useAuthStore();

    useEffect(() => {
        connect();
    }, [connect]);

    const handleFindMatch = () => {
        if (user) {
            joinRoom('public_lobby', {
                id: user.id,
                username: user.name,
                avatar_url: user.avatar_url
            });
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center p-8 relative">

            <GlassCard className="w-full max-w-4xl p-8 min-h-[600px] flex flex-col items-center gap-8 relative z-10 glass-unified">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">
                        Speed<span className="text-neon">Drift</span> Arena
                    </h1>
                    <p className="text-white/50 font-mono text-sm tracking-widest">GLOBAL MULTIPLAYER SERVER // {gameState.status}</p>
                </div>

                {/* GAME AREA */}
                <div className="flex-1 w-full bg-black/20 rounded-3xl border border-white/5 p-6 backdrop-blur-md shadow-inner flex flex-col justify-center">

                    {gameState.status === 'LOBBY' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                            {gameState.players.map((p, i) => (
                                <div
                                    key={p.id}
                                    className="animate-in zoom-in duration-300 flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="w-16 h-16 rounded-full border-2 border-neon/50 overflow-hidden shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                                        <img src={p.avatar_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${p.id}`} alt={p.username} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-white font-bold">{p.username}</span>
                                    <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">READY</span>
                                </div>
                            ))}

                            {/* Placeholder Slot */}
                            {gameState.players.length === 0 && (
                                <div className="col-span-full text-center text-white/30 italic py-12">
                                    Waiting for pilots...
                                </div>
                            )}
                        </div>
                    )}

                    {(gameState.status === 'RACING' || gameState.status === 'COUNTDOWN') && (
                        <RaceTrack />
                    )}

                </div>

                {/* ACTIONS */}
                <div className="w-full flex justify-center gap-4">
                    {gameState.status === 'LOBBY' && (
                        <>
                            {gameState.players.length > 0 ? (
                                <NeonButton variant="primary" className="px-12 py-4 text-xl" onClick={startMatch}>
                                    START RACE
                                </NeonButton>
                            ) : (
                                <NeonButton variant="primary" className="px-12 py-4 text-xl" onClick={handleFindMatch}>
                                    FIND MATCH
                                </NeonButton>
                            )}
                        </>
                    )}
                </div>

            </GlassCard>

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-t from-neon/5 via-transparent to-transparent pointer-events-none mix-blend-screen" />
        </div>
    );
};
