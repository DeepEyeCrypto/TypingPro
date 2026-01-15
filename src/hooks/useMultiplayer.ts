import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Types
export interface PlayerState {
    id: string;
    username: string;
    avatar_url?: string;
    wpm: number;
    progress: number; // 0 to 100
    is_finished: boolean;
    rank?: number;
}

export interface GameState {
    roomId: string | null;
    status: 'LOBBY' | 'COUNTDOWN' | 'RACING' | 'FINISHED';
    players: PlayerState[];
    countdown: number | null;
}

const SERVER_URL = 'http://localhost:4000'; // Placeholder

export const useMultiplayer = () => {
    const socket = useRef<Socket | null>(null);
    const [gameState, setGameState] = useState<GameState>({
        roomId: null,
        status: 'LOBBY',
        players: [],
        countdown: null,
    });

    // Mutable ref for high-frequency updates to avoid re-rendering entire tree
    const playersRef = useRef<Map<string, PlayerState>>(new Map());

    useEffect(() => {
        // Initialize Socket
        socket.current = io(SERVER_URL, {
            autoConnect: false,
            transports: ['websocket'],
        });

        const s = socket.current;

        s.on('connect', () => {
            console.log('Connected to Multiplayer Server:', s.id);
        });

        s.on('room_joined', (data: { roomId: string, players: PlayerState[] }) => {
            setGameState(prev => ({
                ...prev,
                roomId: data.roomId,
                players: data.players,
                status: 'LOBBY'
            }));
            // Sync Ref
            playersRef.current.clear();
            data.players.forEach(p => playersRef.current.set(p.id, p));
        });

        s.on('player_joined', (player: PlayerState) => {
            setGameState(prev => ({
                ...prev,
                players: [...prev.players, player]
            }));
            playersRef.current.set(player.id, player);
        });

        s.on('player_left', (playerId: string) => {
            setGameState(prev => ({
                ...prev,
                players: prev.players.filter(p => p.id !== playerId)
            }));
            playersRef.current.delete(playerId);
        });

        s.on('game_start_countdown', (seconds: number) => {
            setGameState(prev => ({ ...prev, status: 'COUNTDOWN', countdown: seconds }));
        });

        s.on('game_started', () => {
            setGameState(prev => ({ ...prev, status: 'RACING', countdown: null }));
        });

        s.on('player_update', (data: { id: string, wpm: number, progress: number }) => {
            // Update Ref directly for high-freq components
            const p = playersRef.current.get(data.id);
            if (p) {
                p.wpm = data.wpm;
                p.progress = data.progress;
                playersRef.current.set(data.id, p);
            }

            // Check if we need to trigger a re-render (e.g., if rank changes or finished)
            // For now, we rely on the visualizer to poll the Ref or use a subscription
        });

        return () => {
            s.disconnect();
        };
    }, []);

    const connect = useCallback(() => {
        if (!socket.current?.connected) {
            socket.current?.connect();
        }
    }, []);

    const joinRoom = useCallback((roomId?: string, user?: { id: string, username: string, avatar_url?: string }) => {
        socket.current?.emit('join_room', { roomId, user });
    }, []);

    const sendProgress = useCallback((wpm: number, progress: number) => {
        socket.current?.emit('update_progress', { wpm, progress });
    }, []);

    const startMatch = useCallback(() => {
        socket.current?.emit('request_start');
    }, []);

    return {
        socket: socket.current,
        gameState,
        playersRef,
        connect,
        joinRoom,
        sendProgress,
        startMatch
    };
};
