import React, { createContext, useContext, ReactNode } from 'react';
import { useMultiplayer, GameState, PlayerState } from '../hooks/useMultiplayer';
import { Socket } from 'socket.io-client';

interface GameContextType {
    socket: Socket | null;
    gameState: GameState;
    playersRef: React.MutableRefObject<Map<string, PlayerState>>;
    connect: () => void;
    joinRoom: (roomId?: string, user?: { id: string, username: string, avatar_url?: string }) => void;
    sendProgress: (wpm: number, progress: number) => void;
    startMatch: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const multiplayer = useMultiplayer();

    return (
        <GameContext.Provider value={multiplayer}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
