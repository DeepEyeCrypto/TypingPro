import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    provider: 'google' | 'github';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: (user) => set({ user, isAuthenticated: true, isLoading: false, error: null }),
    logout: () => set({ user: null, isAuthenticated: false }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),
}));
