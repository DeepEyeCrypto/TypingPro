import React, { useEffect, useState, useRef } from 'react';
import { liveRaceService, RaceState } from '../../services/liveRaceService';
import { useAuthStore } from '../../stores/authStore';
import { TypingArea } from '../TypingArea';

interface Props {
    matchId: string;
    onBack: () => void;
    // Pass typing props from useTyping hook
    typingProps: any;
}

const DuelArena: React.FC<Props> = ({ matchId, onBack, typingProps }) => {
    const { user } = useAuthStore();

    // State
    const [raceState, setRaceState] = useState<RaceState | null>(null);
    const [opponentId, setOpponentId] = useState<string | null>(null);
    const hasJoined = useRef(false);

    // Init Protocol
    useEffect(() => {
        if (!matchId || !user || hasJoined.current) return;
        hasJoined.current = true;

        liveRaceService.joinRace(matchId, {
            onStateChange: (newState) => {
                setRaceState(newState);

                // Identify Opponent
                const pIds = Object.keys(newState.players || {});
                const op = pIds.find(id => id !== user.id);
                if (op) setOpponentId(op);
            },
            onFinish: (winnerId) => {
                // Handle Finish
            }
        });

        return () => {
            liveRaceService.leaveRace();
            hasJoined.current = false;
        };
    }, [matchId, user]);

    // Handle Race Completion via typing hook
    useEffect(() => {
        if (typingProps.showResult && raceState) {
            liveRaceService.updateProgress(
                typingProps.metrics.adjusted_wpm,
                typingProps.currentLesson?.text.length || 0,
                100,
                true
            );
        }
    }, [typingProps.showResult]);

    if (!raceState || !user) return <div className="text-white">Loading Arena...</div>;

    const me = raceState.players[user.id] || { progress: 0, wpm: 0 };
    const enemy = opponentId ? raceState.players[opponentId] : { progress: 0, wpm: 0, cursorIndex: 0 };

    return (
        <div className="w-full h-full flex flex-col">

            {/* Top Bar: The Stakes */}
            {/* Top Bar: The Stakes */}
            <header className="h-20 glass-panel border-b-0 rounded-none m-4 flex items-center px-8 justify-between">

                {/* Player Status */}
                <div className="flex items-center gap-4 text-cyan-400">
                    <div className="w-10 h-10 rounded bg-cyan-900/50 flex items-center justify-center border border-cyan-500/50">
                        P1
                    </div>
                    <div>
                        <div className="text-xl font-bold">{Math.round(me.wpm || 0)} WPM</div>
                        <div className="text-xs opacity-70">YOU</div>
                    </div>
                </div>

                {/* Progress Visual */}
                <div className="flex-1 mx-12 max-w-2xl relative">
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                        {/* My Bar (From Left) */}
                        <div
                            className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-300"
                            style={{ width: `${me.progress || 0}%` }}
                        ></div>
                    </div>
                    {/* Enemy Bar below */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative mt-1">
                        <div
                            className="absolute top-0 left-0 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-all duration-300"
                            style={{ width: `${enemy.progress || 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Enemy Status */}
                <div className="flex items-center gap-4 text-red-500">
                    <div className="text-right">
                        <div className="text-xl font-bold">{Math.round(enemy.wpm || 0)} WPM</div>
                        <div className="text-xs opacity-70">OPPONENT</div>
                    </div>
                    <div className="w-10 h-10 rounded bg-red-900/50 flex items-center justify-center border border-red-500/50">
                        P2
                    </div>
                </div>
            </header>


            {/* Main Arena */}
            <main className="flex-1 flex items-center justify-center relative p-8">

                {/* Re-use the existing TypingArea, but wrapped for Duel */}
                <TypingArea
                    targetText={typingProps.currentLesson?.text || ''}
                    input={typingProps.input}
                    activeChar={typingProps.activeChar}
                    onBack={onBack}
                    onKeyDown={(e) => typingProps.onKeyDown(e.nativeEvent)}
                    isPaused={typingProps.isPaused}
                    ghostReplay={typingProps.ghostReplay}
                />

                {/* Enemy Ghost View (Mini-map) */}
                <div className="absolute bottom-8 right-8 w-64 h-32 glass-panel border-red-500/30 p-4 opacity-80 pointer-events-none">
                    <div className="text-red-500 text-[10px] uppercase mb-1 tracking-wider">Opponent Stream</div>
                    <div className="w-full h-full overflow-hidden text-red-500/50 text-xs break-all leading-tight font-mono">
                        {(typingProps.currentLesson?.text || '').substring(0, enemy.cursorIndex || 0)}
                        <span className="animate-pulse text-red-500">_</span>
                    </div>
                </div>

            </main>

        </div>
    );
};

export default DuelArena;
