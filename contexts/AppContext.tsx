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
import { HERO_CURRICULUM } from '../constants/curriculum';

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
    activeModal: 'none' | 'settings' | 'history' | 'achievements' | 'dashboard' | 'profiles';
    isCodeMode: boolean;
    isSidebarCollapsed: boolean;

    // Actions
    setActiveLessonId: (id: number) => void;
    setActiveModal: (modal: 'none' | 'settings' | 'history' | 'achievements' | 'dashboard' | 'profiles') => void;
    setIsCodeMode: (val: boolean) => void;
    setIsSidebarCollapsed: (val: boolean) => void;
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
    const [activeModal, setActiveModal] = useState<'none' | 'settings' | 'history' | 'achievements' | 'dashboard' | 'profiles'>('none');
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        const lesson = HERO_CURRICULUM.find(l => l.id === lessonId);
        if (!lesson) return false;

        // Use lesson-specific passing criteria or a sensible default
        const minAccuracy = lesson.passingCriteria?.accuracy || 98;
        const minWpm = lesson.passingCriteria?.wpm || 15;
        const passedCriteria = stats.accuracy >= minAccuracy && stats.wpm >= minWpm;

        const updatedProgress = updateLessonProgress(currentProfile.id, lessonId, {
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            completed: passedCriteria
        });

        let unlockedNext = false;
        if (passedCriteria) {
            // Find next lesson in the curriculum
            const nextLesson = HERO_CURRICULUM.find(l => l.id > lessonId);
            if (nextLesson) {
                unlockLesson(currentProfile.id, nextLesson.id);
                if (updatedProgress[nextLesson.id]) {
                    updatedProgress[nextLesson.id] = { ...updatedProgress[nextLesson.id], unlocked: true };
                }
                unlockedNext = true;
            }

            // Phase Completion Logic
            if (lesson.phase) {
                const phaseLessons = HERO_CURRICULUM.filter(l => l.phase === lesson.phase);
                const isPhaseComplete = phaseLessons.every(l => updatedProgress[l.id]?.completed);
                if (isPhaseComplete) {
                    console.log(`🎉 Phase ${lesson.phase} Complete! Great job!`);
                    // We can trigger a special badge or toast here in the future
                }
            }
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

        // Update Profile XP
        if (passedCriteria) {
            const gainedXp = Math.round((stats.wpm * stats.accuracy) / 10) + (lesson.phase || 0) * 50;
            const newXp = currentProfile.xp + gainedXp;
            const newLevel = getLevelFromXp(newXp);

            const updatedProfile = { ...currentProfile, xp: newXp, level: newLevel };
            setCurrentProfile(updatedProfile);

            const updatedProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
            setProfiles(updatedProfiles);
            localStorage.setItem('typingpro_profiles', JSON.stringify(updatedProfiles));
        }

        // Daily Goals update...
        const newGoals = dailyGoals.map(g => {
            if (g.isCompleted) return g;
            let val = g.currentValue;
            if (g.type === 'lessons' && passedCriteria) val += 1;
            if (g.type === 'time') val += entry.durationSeconds;
            return { ...g, currentValue: val, isCompleted: val >= g.targetValue };
        });

        if (JSON.stringify(newGoals) !== JSON.stringify(dailyGoals)) {
            setDailyGoals(newGoals);
            saveDailyGoals(currentProfile.id, newGoals);
        }

        // Badge logic...
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
        activeModal,
        isCodeMode,
        isSidebarCollapsed,
        setActiveLessonId,
        setActiveModal,
        setIsCodeMode,
        setIsSidebarCollapsed,
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
        activeLessonId, user, keyStats, fingerStats, dailyGoals, getWeaknessDrill,
        activeModal, isCodeMode, isSidebarCollapsed
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
