import { create } from 'zustand';
import { userService } from '../userService';
import { useAuthStore } from './authStore';

export type UserStatus = 'IDLE' | 'SEARCHING' | 'TYPING' | 'LOBBY' | 'DUELING';

interface PresenceState {
    status: UserStatus;
    currentWpm: number;
    setStatus: (status: UserStatus) => void;
    setWpm: (wpm: number) => void;
    syncPresence: () => Promise<void>;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
    status: 'IDLE',
    currentWpm: 0,

    setStatus: (status) => {
        set({ status });
        get().syncPresence(); // Immediate sync on state change
    },

    setWpm: (wpm) => {
        const lastSync = (get() as any).lastBurstSync || 0;
        const now = Date.now();
        set({ currentWpm: wpm });

        // Burst sync every 5s during typing
        if (get().status === 'TYPING' && now - lastSync > 5000) {
            (set as any)({ lastBurstSync: now });
            get().syncPresence();
        }
    },

    syncPresence: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        const { status, currentWpm } = get();
        try {
            await userService.updatePresence(user.id, {
                status,
                current_wpm: status === 'TYPING' ? currentWpm : 0
            });
        } catch (err) {
            console.error('Presence Sync Failed:', err);
        }
    }
}));
