import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    UserProfile, UserSettings, LessonProgress, HistoryEntry, EarnedBadge,
    ThemeMode, KeyboardLayoutType, Stats
} from '../types';
import {
    getProfiles, createProfile, getSettings, saveSettings,
    getLessonProgress, getHistory, getEarnedBadges,
    updateLessonProgress, saveHistory, saveEarnedBadge, unlockLesson, clearHistory
} from '../services/storageService';
import { setVolume } from '../services/audioService';
import { BADGES, FANCY_FONTS } from '../constants';

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

    // Actions
    setActiveLessonId: (id: number) => void;
    switchProfile: (profile: UserProfile) => void;
    createNewProfile: (name: string) => void;
    updateUserSetting: (key: keyof UserSettings, val: any) => void;
    recordLessonComplete: (lessonId: number, stats: Stats) => boolean; // returns true if next lesson unlocked
    clearUserHistory: () => void;
    refreshUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // --- State ---
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [currentProfile, setCurrentProfile] = useState<UserProfile>({ id: 'default', name: 'Guest', createdAt: '' });
    const [settings, setSettings] = useState<UserSettings>({
        theme: 'system',
        keyboardLayout: 'qwerty',
        soundEnabled: true,
        volume: 0.5,
        showKeyboard: true,
        fontFamily: 'Cinzel',
        fontSize: 'xl',
        cursorStyle: 'block',
        stopOnError: false
    });

    const [lessonProgress, setLessonProgress] = useState<Record<number, LessonProgress>>({});
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
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
            // Could check localStorage for last active profile
            setCurrentProfile(loaded[0]);
        }

        return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }, []);

    // --- Profile Data Sync ---
    const loadProfileData = (profileId: string) => {
        const prog = getLessonProgress(profileId);
        const hist = getHistory(profileId);
        const prefs = getSettings(profileId);
        const badges = getEarnedBadges(profileId);

        setLessonProgress(prog);
        setHistory(hist);
        setSettings(prefs);
        setEarnedBadges(badges);
        setVolume(prefs.volume);
    };

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

    const updateUserSetting = (key: keyof UserSettings, val: any) => {
        setSettings(prev => ({ ...prev, [key]: val }));
    };

    const clearUserHistory = () => {
        clearHistory(currentProfile.id);
        setHistory([]);
    };

    const recordLessonComplete = (lessonId: number, stats: Stats): boolean => {
        // Logic from App.tsx handleComplete
        const passedCriteria = stats.accuracy === 100 && stats.wpm >= 22;

        const updatedProgress = updateLessonProgress(currentProfile.id, lessonId, {
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            completed: passedCriteria
        });

        let unlockedNext = false;
        if (passedCriteria) {
            const nextId = lessonId + 1;
            // Check availability logic should be in caller or service, but we'll assume valid here
            // or check simple existence if we had the list. 
            // For now, we trust the logic that calls this or checks afterwards.
            // Actually, we need to know if next exists to unlock it.
            // We'll optimistically unlock. The UI handles existence check.
            unlockLesson(currentProfile.id, nextId);
            updatedProgress[nextId] = { ...updatedProgress[nextId], unlocked: true };
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

    return (
        <AppContext.Provider value={{
            profiles, currentProfile, settings, lessonProgress, history, earnedBadges, systemTheme, activeLessonId,
            setActiveLessonId, switchProfile, createNewProfile, updateUserSetting, recordLessonComplete, clearUserHistory, refreshUserData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};
