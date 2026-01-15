import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

interface EngineMetrics {
    gross_wpm: number;
    net_wpm: number;
    accuracy: number;
    consistency: number;
    is_bot: boolean;
    cheat_flags: string;
}

interface EngineDebugState {
    metrics: EngineMetrics;
    total_chars: number;
    last_latency: number;
    avg_latency: number;
    std_dev: number;
    unique_latencies: number;
    telemetry_buffer_size: number;
}

interface DevState {
    isDevMode: boolean;
    isHudVisible: boolean;
    engineState: EngineDebugState | null;

    toggleDevMode: () => void;
    toggleHud: () => void;
    refreshEngineState: () => Promise<void>;
    forceCheat: (status: boolean) => Promise<void>;
}

export const useDevStore = create<DevState>((set, get) => ({
    isDevMode: process.env.NODE_ENV === 'development', // Auto-enable in dev
    isHudVisible: false,
    engineState: null,

    toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),

    toggleHud: () => set((state) => ({ isHudVisible: !state.isHudVisible })),

    refreshEngineState: async () => {
        try {
            const state = await invoke<EngineDebugState>('get_engine_state');
            set({ engineState: state });
        } catch (err) {
            console.error('Failed to refresh engine state:', err);
        }
    },

    forceCheat: async (status: boolean) => {
        try {
            await invoke('force_engine_cheat', { status });
            await get().refreshEngineState();
        } catch (err) {
            console.error('Failed to force cheat status:', err);
        }
    }
}));
