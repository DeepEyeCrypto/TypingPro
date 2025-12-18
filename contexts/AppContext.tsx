import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    UserProfile, UserSettings, LessonProgress, HistoryEntry, EarnedBadge,
    ThemeMode, KeyboardLayoutType, Stats, KeyStats, DailyGoal
} from '../types';
import {
    getProfiles, createProfile, getSettings, saveSettings,
    getLessonProgress, getHistory, getEarnedBadges,
    updateLessonProgress, saveHistory, saveEarnedBadge, unlockLesson, clearHistory,
    getKeyStats, updateKeyStats, getDailyGoals, saveDailyGoals
} from '../services/storageService';
import { setVolume } from '../services/audioService';
import { BADGES, FANCY_FONTS } from '../constants';

import { authService, AuthUser } from '../services/authService';

interface AppContextType {
    // State
    profiles: UserProfile[];
    currentProfile: UserProfile;
    settings: UserSettings;
    lessonProgress: Record<number, LessonProgress>;
    history: HistoryEntry[];
    earnedBadges: EarnedBadge[];
    systemTheme: 'light' | 'dark';
    activeLessonId: number;
    user: AuthUser | null;
    keyStats: Record<string, KeyStats>;
    dailyGoals: DailyGoal[];

    // Actions
    setActiveLessonId: (id: number) => void;
    switchProfile: (profile: UserProfile) => void;
    createNewProfile: (name: string) => void;
    updateUserSetting: <K extends keyof UserSettings>(key: K, val: UserSettings[K]) => void;
    recordLessonComplete: (lessonId: number, stats: Stats) => boolean;
    clearUserHistory: () => void;
    refreshUserData: () => void;
    recordKeyStats: (sessionStats: Record<string, KeyStats>) => void;

    // Auth
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // --- State ---
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [currentProfile, setCurrentProfile] = useState<UserProfile>({ id: 'default', name: 'Guest', createdAt: '' });
    const [user, setUser] = useState<AuthUser | null>(null);
    const [settings, setSettings] = useState<UserSettings>({
        theme: 'system',
        keyboardLayout: 'qwerty',
        soundEnabled: true,
        volume: 0.5,
        showKeyboard: true,
        fontFamily: 'Cinzel',
        fontSize: 'medium', // A+
        cursorStyle: 'underline',
        stopOnError: false,
        trainingMode: 'accuracy',
        fontColor: '#FFFF00', // Bright Yellow
        showHands: true
    });

    const [lessonProgress, setLessonProgress] = useState<Record<number, LessonProgress>>({});
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
    const [keyStats, setKeyStats] = useState<Record<string, KeyStats>>({});
    const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
    const [activeLessonId, setActiveLessonId] = useState(1);

    // --- Initial Load ---
    useEffect(() => {
        // Detect System Theme
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
        setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handleThemeChange);

        // Load Profiles
        const loaded = getProfiles();
        setProfiles(loaded);
        if (loaded.length > 0) {
            setCurrentProfile(loaded[0]);
        }

        // Check Auth
        authService.getCurrentUser().then(u => {
            if (u) handleAuthUser(u);
        });

        return () => {
            mediaQuery.removeEventListener('change', handleThemeChange);
        };
    }, []);

    const handleAuthUser = (authUser: AuthUser) => {
        setUser(authUser);
        // Sync with Profiles
        const existing = getProfiles().find(p => p.id === authUser.id);
        if (existing) {
            setCurrentProfile(existing);
        } else {
            // Create new profile linked to Google ID
            const newProfile: UserProfile = {
                id: authUser.id,
                name: authUser.name || 'Google User',
                createdAt: new Date().toISOString()
            };
            const updatedProfiles = [...getProfiles(), newProfile];
            localStorage.setItem('typingpro_profiles', JSON.stringify(updatedProfiles));
            setProfiles(updatedProfiles);
            setCurrentProfile(newProfile);
        }
    };

    const login = async () => {
        const u = await authService.signInWithGoogle();
        handleAuthUser(u);
    };

    const logout = async () => {
        await authService.signOutUser();
        setUser(null);
        // Optionally switch back to default/guest or stay on current profile?
        // Let's stay on current but clearing 'user' state changes UI to "Sign In"
    };

    // --- Profile Data Sync ---
    const loadProfileData = (profileId: string) => {
        const prog = getLessonProgress(profileId);
        const hist = getHistory(profileId);
        const prefs = getSettings(profileId);
        const badges = getEarnedBadges(profileId);
        const keys = getKeyStats(profileId);
        const goals = getDailyGoals(profileId);

        setLessonProgress(prog);
        setHistory(hist);
        setSettings(prefs);
        setEarnedBadges(badges);
        setKeyStats(keys);
        setDailyGoals(goals.length > 0 ? goals : initDailyGoals(profileId)); // usage of initDailyGoals here implies we need it
        setVolume(prefs.volume);
    };

    // Helper to init goals if empty
    const initDailyGoals = (profileId: string) => {
        // Simple default goals
        const defaults: DailyGoal[] = [
            { id: 'g1', description: 'Complete 3 Lessons', targetValue: 3, currentValue: 0, isCompleted: false, type: 'lessons' },
            { id: 'g2', description: 'Type for 5 minutes', targetValue: 300, currentValue: 0, isCompleted: false, type: 'time' }
        ];
        saveDailyGoals(profileId, defaults);
        return defaults;
    }

    useEffect(() => {
        if (currentProfile.id) {
            loadProfileData(currentProfile.id);
        }
    }, [currentProfile.id]);

    // --- Theme & Font Application ---
    useEffect(() => {
        if (!currentProfile.id) return;
        saveSettings(currentProfile.id, settings);
        setVolume(settings.volume);

        const effectiveTheme = settings.theme === 'system' ? systemTheme : settings.theme;
        if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Font Logic
        if (settings.fontFamily !== 'Inter') {
            const fontObj = FANCY_FONTS.find(f => f.family === settings.fontFamily);
            if (fontObj?.url) {
                const id = `font-${settings.fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
                if (!document.getElementById(id)) {
                    const link = document.createElement('link');
                    link.id = id;
                    link.href = fontObj.url;
                    link.rel = 'stylesheet';
                    document.head.appendChild(link);
                }
            }
        }
        document.body.style.setProperty('font-family', `"${settings.fontFamily}", sans-serif`, 'important');
    }, [settings, currentProfile.id, systemTheme]);

    // --- Actions ---

    const switchProfile = (p: UserProfile) => setCurrentProfile(p);

    const createNewProfile = (name: string) => {
        const p = createProfile(name);
        setProfiles(prev => [...prev, p]);
        setCurrentProfile(p);
    };

    const updateUserSetting = <K extends keyof UserSettings>(key: K, val: UserSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: val }));
    };

    const clearUserHistory = () => {
        clearHistory(currentProfile.id);
        setHistory([]);
    };

    const recordKeyStatsAction = (sessionStats: Record<string, KeyStats>) => {
        const updated = updateKeyStats(currentProfile.id, sessionStats);
        setKeyStats(updated);
    };

    const recordLessonComplete = (lessonId: number, stats: Stats): boolean => {
        // Logic from App.tsx handleComplete
        const passedCriteria = stats.accuracy >= (settings.trainingMode === 'accuracy' ? 98 : 90) && stats.wpm >= 15; // Adjusted criteria

        const updatedProgress = updateLessonProgress(currentProfile.id, lessonId, {
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            completed: passedCriteria
        });

        let unlockedNext = false;
        if (passedCriteria) {
            // Logic to find next ID strictly by numerical order might fail if gaps exist, 
            // but we'll assume constants.ts IDs are sequential for now.
            // Actually, with new granular lessons, IDs are 1..N.
            const nextId = lessonId + 1;
            unlockLesson(currentProfile.id, nextId);
            if (updatedProgress[nextId]) { // Only if it exists
                updatedProgress[nextId] = { ...updatedProgress[nextId], unlocked: true };
            }
            unlockedNext = true;
        }

        setLessonProgress({ ...updatedProgress });

        // History
        const entry: HistoryEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            lessonId,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            errors: stats.errors,
            durationSeconds: (Date.now() - (stats.startTime || 0)) / 1000
        };
        saveHistory(currentProfile.id, entry);
        const newHistory = [entry, ...history];
        setHistory(newHistory);

        // Update Daily Goals
        const newGoals = dailyGoals.map(g => {
            if (g.isCompleted) return g;
            let val = g.currentValue;
            if (g.type === 'lessons' && passedCriteria) val += 1;
            if (g.type === 'time') val += entry.durationSeconds;
            // wpm/accuracy goals usually "achieve X once"

            return {
                ...g,
                currentValue: val,
                isCompleted: val >= g.targetValue
            };
        });
        if (JSON.stringify(newGoals) !== JSON.stringify(dailyGoals)) {
            setDailyGoals(newGoals);
            saveDailyGoals(currentProfile.id, newGoals);
        }

        // Badge Logic
        BADGES.forEach(badge => {
            if (!earnedBadges.some(eb => eb.badgeId === badge.id)) {
                if (badge.condition(newHistory, updatedProgress)) {
                    saveEarnedBadge(currentProfile.id, badge.id);
                    setEarnedBadges(prev => [...prev, { badgeId: badge.id, earnedAt: new Date().toISOString() }]);
                }
            }
        });

        return unlockedNext;
    };

    const refreshUserData = () => loadProfileData(currentProfile.id);

    const contextValue = React.useMemo(() => ({
        profiles,
        currentProfile,
        settings,
        lessonProgress,
        history,
        earnedBadges,
        systemTheme,
        activeLessonId,
        user,
        keyStats,
        dailyGoals,
        setActiveLessonId,
        switchProfile,
        createNewProfile,
        updateUserSetting,
        recordLessonComplete,
        clearUserHistory,
        refreshUserData,
        recordKeyStats: recordKeyStatsAction,
        login,
        logout
    }), [
        profiles, currentProfile, settings, lessonProgress, history, earnedBadges, systemTheme,
        activeLessonId, user, keyStats, dailyGoals
    ]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};
