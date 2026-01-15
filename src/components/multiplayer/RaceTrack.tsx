import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';

export const RaceTrack: React.FC = () => {
    const { playersRef, gameState } = useGame();
    const [renderTrigger, setRenderTrigger] = useState(0);

    // Optimized Render Loop: Only re-renders this component for smoothness
    useEffect(() => {
        if (gameState.status !== 'RACING') return;

        let animationFrameId: number;

        const tick = () => {
            setRenderTrigger(prev => prev + 1); // Force re-render to update positions from Ref
            animationFrameId = requestAnimationFrame(tick);
        };

        tick();

        return () => cancelAnimationFrame(animationFrameId);
    }, [gameState.status]);

    // Convert Map to Array for rendering
    const players = Array.from(playersRef.current.values());

    return (
        <div className="w-full space-y-4 py-6">
            {players.map((player) => (
                <div key={player.id} className="relative w-full">
                    {/* Track Base */}
                    <div className="w-full h-8 bg-white/5 rounded-full border border-white/10 overflow-hidden relative backdrop-blur-sm">

                        {/* Progress Fill (Optional - maybe just cursor?) */}
                        {/* Let's do a glowing trail */}
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent to-neon/20 transition-all duration-300 ease-linear"
                            style={{ width: `${player.progress}%` }}
                        />

                        {/* Neon Cursor / Car */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-linear flex flex-col items-center"
                            style={{ left: `${player.progress}%` }}
                        >
                            {/* The Car/Cursor */}
                            <div className={`
                                w-4 h-4 rounded-full shadow-[0_0_10px_currentColor] border-2 border-white
                                ${true ? 'bg-neon text-neon' : 'bg-white/50 text-white'} 
                             `} />

                            {/* Player Name Tooltip */}
                            <div className="absolute -top-8 whitespace-nowrap text-xs font-bold text-white/80 bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                                {player.username} ({Math.round(player.wpm)} WPM)
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
