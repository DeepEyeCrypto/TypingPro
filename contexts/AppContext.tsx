import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    UserProfile, UserSettings, LessonProgress, HistoryEntry, EarnedBadge,
    ThemeMode, KeyboardLayoutType, Stats, KeyStats, DailyGoal
} from '../types';
import {
    getProfiles, createProfile, getSettings, saveSettings,
    getLessonProgress, getHistory, getEarnedBadges,
    updateLessonProgress, saveHistory, saveEarnedBadge, unlockLesson, clearHistory,
    getKeyStats, updateKeyStats, getDailyGoals, saveDailyGoals, updateFingerStats, getFingerStats
} from '../services/storageService';
import { FingerStats } from '../types';
import { setVolume } from '../services/audioService';
import { BADGES, FANCY_FONTS, XP_LEVELS } from '../constants';

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
    fingerStats: Record<string, FingerStats>;
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
    getWeaknessDrill: () => { content: string, title: string } | null;

    // Auth
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // --- State ---
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [currentProfile, setCurrentProfile] = useState<UserProfile>({
        id: 'default',
        name: 'Guest',
        xp: 0,
        level: 'Recruit',
        createdAt: ''
    });
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
        showHands: true,
        performanceMode: false
    });

    // Apply performance mode class to body
    useEffect(() => {
        if (settings.performanceMode) {
            document.body.classList.add('perf-mode');
        } else {
            document.body.classList.remove('perf-mode');
        }
    }, [settings.performanceMode]);

    const [lessonProgress, setLessonProgress] = useState<Record<number, LessonProgress>>({});
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
    const [keyStats, setKeyStats] = useState<Record<string, KeyStats>>({});
    const [fingerStats, setFingerStats] = useState<Record<string, FingerStats>>({});
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
                avatar: authUser.picture,
                xp: 0,
                level: 'Recruit',
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
            { id: 'g2', description: 'Type for 5 minutes', targetValue: 300, currentValue: 0, isCompleted: false, type: 'time' },
            { id: 'g3', description: 'Maintain 98% Form', targetValue: 1, currentValue: 0, isCompleted: false, type: 'form' }
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

    const getLevelFromXp = (xp: number) => {
        const sorted = [...XP_LEVELS].sort((a, b) => b.minXp - a.minXp);
        return sorted.find(l => xp >= l.minXp)?.title || 'Recruit';
    };

    const createNewProfile = (name: string) => {
        const p = createProfile(name);
        const fullProfile: UserProfile = { ...p, xp: 0, level: 'Recruit' };
        setProfiles(prev => [...prev, fullProfile]);
        setCurrentProfile(fullProfile);
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

    const getWeaknessDrill = (): { content: string, title: string } | null => {
        const sortedFingers = Object.values(fingerStats).sort((a, b) => a.accuracy - b.accuracy);
        if (sortedFingers.length === 0) return null;

        const weakest = sortedFingers[0];
        if (weakest.accuracy >= 98 || weakest.totalPresses < 10) return null;

        const weakestFinger = weakest.finger;
        const mappings: Record<string, string> = {
            'left-pinky': 'q a z',
            'left-ring': 'w s x',
            'left-middle': 'e d c',
            'left-index': 'r f v t g b',
            'right-index': 'y h n u j m',
            'right-middle': 'i k ,',
            'right-ring': 'o l .',
            'right-pinky': 'p ; /'
        };

        const chars = mappings[weakestFinger] || 'f j';
        const content = Array(8).fill(chars).join(' ');

        return {
            content,
            title: `Bonus Drill: ${weakestFinger.replace('-', ' ').toUpperCase()} Reinforcement`
        };
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

        // --- Adaptive Intelligence: Pace Adjustment ---
        if (stats.accuracy < 98) {
            console.log("Adaptive Intelligence: Accuracy below 98%. Recommending focus on form over speed.");
            // We could set a global 'paceHint' or 'slowDown' state here if needed
        }

        saveHistory(currentProfile.id, entry);
        const newHistory = [entry, ...history];
        setHistory(newHistory);

        // --- Session Velocity ---
        const lastSession = history[0];
        if (lastSession) {
            const velocity = entry.wpm - lastSession.wpm;
            if (velocity > 0) {
                console.log(`Session Velocity: +${velocity} WPM improvement!`);
            }
        }

        // --- Phase 4: Scientific Mastery (XP & Adaptive Leveling) ---
        if (passedCriteria) {
            const gainedXp = Math.round((stats.wpm * stats.accuracy) / 10);

            // Mastery Unlock: 3 consecutive 99%+ accuracy unlocks next tier immediately
            const recentHistory = [entry, ...history].slice(0, 3);
            const isMasteryAchieved = recentHistory.length >= 3 && recentHistory.every(h => h.accuracy >= 99);

            if (isMasteryAchieved) {
                // Unlock the next Tier (Start of next stage)
                // Stages: 1-5, 6-10, 11-15, 16-20, 21-25, 26-30
                const currentStageEnd = Math.ceil(lessonId / 5) * 5;
                const nextStageStart = currentStageEnd + 1;
                if (nextStageStart <= 85) {
                    unlockLesson(currentProfile.id, nextStageStart);
                    // Note: updatedProgress already has the next lesson unlocked normally
                }
            }

            const newXp = currentProfile.xp + gainedXp;
            const newLevel = getLevelFromXp(newXp);

            const updatedProfile = { ...currentProfile, xp: newXp, level: newLevel };
            setCurrentProfile(updatedProfile);

            // Save to profiles list
            const updatedProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
            setProfiles(updatedProfiles);
            localStorage.setItem('typingpro_profiles', JSON.stringify(updatedProfiles));
        }

        // --- Finger Analytics Update ---
        if (stats.fingerStats) {
            const updatedFingerStats = updateFingerStats(currentProfile.id, stats.fingerStats);
            // Finger Independence Score calculation
            const total = Object.values(updatedFingerStats).reduce((a, b: FingerStats) => a + b.totalPresses, 0);
            if (total > 0) {
                const targetUsage = total / 8;
                const fingers = ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'];
                let variance = 0;
                fingers.forEach(f => {
                    const fingerStat = updatedFingerStats[f] as FingerStats | undefined;
                    const usage = fingerStat?.totalPresses || 0;
                    variance += Math.pow(usage - targetUsage, 2);
                });
                const stdDev = Math.sqrt(variance / 8);
                const independenceScore = Math.max(0, 100 - (stdDev / (total / 4)) * 100);
                console.log(`Finger Independence Score: ${independenceScore.toFixed(1)}%`);
            }
        }

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
        fingerStats,
        dailyGoals,
        setActiveLessonId,
        switchProfile,
        createNewProfile,
        updateUserSetting,
        recordLessonComplete,
        clearUserHistory,
        refreshUserData,
        recordKeyStats: recordKeyStatsAction,
        getWeaknessDrill,
        login,
        logout
    }), [
        profiles, currentProfile, settings, lessonProgress, history, earnedBadges, systemTheme,
        activeLessonId, user, keyStats, fingerStats, dailyGoals, getWeaknessDrill
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
