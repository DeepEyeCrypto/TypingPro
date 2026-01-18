// ═══════════════════════════════════════════════════════════════════
// TOAST STORE: Global toast notification state management
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastState {
    toasts: Toast[];
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
    clearAll: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],

    addToast: (message, type, duration = 4000) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
            toasts: [...state.toasts, { id, message, type, duration }]
        }));

        // Auto-remove after duration
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id)
            }));
        }, duration + 500); // Extra time for exit animation
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }));
    },

    clearAll: () => {
        set({ toasts: [] });
    }
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER FUNCTIONS (for easy use across components)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const toast = {
    success: (message: string, duration?: number) =>
        useToastStore.getState().addToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
        useToastStore.getState().addToast(message, 'error', duration),
    info: (message: string, duration?: number) =>
        useToastStore.getState().addToast(message, 'info', duration),
};
