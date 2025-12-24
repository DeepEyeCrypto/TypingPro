import { useState, useCallback, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface TypingStats {
    wpm: number;
    accuracy: number;
    elapsed_time: number;
    correct_chars: number;
    total_chars: number;
    finger_latency: number[];
}

export const useRustEngine = (initialText: string) => {
    const [stats, setStats] = useState<TypingStats>({
        wpm: 0,
        accuracy: 100,
        elapsed_time: 0,
        correct_chars: 0,
        total_chars: 0,
        finger_latency: [],
    });

    const [cursorPos, setCursorPos] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const startTest = useCallback(async (text: string) => {
        await invoke('start_test', { text });
        setCursorPos(0);
        setIsFinished(false);
    }, []);

    const handleKey = useCallback(async (key: string) => {
        if (key === 'Backspace') {
            // In Rust, we need a separate command or handle it in process_key
            // For now, let's assume we logic it in process_key if we send a special char or use a dedicated command
            return;
        }

        if (key.length === 1) {
            const newStats = await invoke<TypingStats>('process_key', { key: key.charAt(0) });
            setStats(newStats);
            setCursorPos(prev => prev + 1);

            // If we've typed the whole text (client-side check for UI responsiveness)
            // The Rust engine also tracks this.
        }
    }, []);

    return {
        stats,
        cursorPos,
        isFinished,
        startTest,
        handleKey,
    };
};
