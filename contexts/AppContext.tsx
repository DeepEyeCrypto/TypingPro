import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    UserProfile, UserSettings, LessonProgress, HistoryEntry, EarnedBadge,
    ThemeMode, KeyboardLayoutType, Stats, KeyStats, DailyQuest
} from '../types';
import {
    getProfiles, createProfile, getSettings, saveSettings,
    getLessonProgress, getHistory, getEarnedBadges,
    updateLessonProgress, saveHistory, saveEarnedBadge, unlockLesson, clearHistory,
    getKeyStats, updateKeyStats, updateFingerStats, getFingerStats
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
    dailyQuests: DailyQuest[];

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
        level: 1,
        streakCount: 1,
        lastLoginDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
    });
    const [user, setUser] = useState<AuthUser | null>(null);
    const [settings, setSettings] = useState<UserSettings>({
        theme: 'system',
        keyboardLayout: 'qwerty',
        osLayout: (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0) ? 'mac' : 'win',
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
    const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);

    // --- Helper for Quest Generation ---
    const initializeDailyQuests = (profileId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const storedQuestsJson = localStorage.getItem(`quests_${profileId}`);
        const storedQuests = storedQuestsJson ? JSON.parse(storedQuestsJson) : null;

        if (storedQuests && storedQuests.date === today) {
            setDailyQuests(storedQuests.quests);
            return;
        }

        // Generate new quests for the day
        const newQuests: DailyQuest[] = [
            {
                id: 'q-speed',
                title: 'Speed Demon',
                description: 'Reach 45 WPM in any lesson',
                type: 'speed',
                targetValue: 45,
                currentValue: 0,
                isCompleted: false,
                xpReward: 150,
                icon: 'Zap'
            },
            {
                id: 'q-accuracy',
                title: 'Perfect Precision',
                description: 'Achieve 98% Accuracy',
                type: 'accuracy',
                targetValue: 98,
                currentValue: 0,
                isCompleted: false,
                xpReward: 150,
                icon: 'Target'
            },
            {
                id: 'q-lessons',
                title: 'The Grind',
                description: 'Complete 3 Lessons',
                type: 'lessons',
                targetValue: 3,
                currentValue: 0,
                isCompleted: false,
                xpReward: 200,
                icon: 'BookOpen'
            }
        ];

        const questData = { date: today, quests: newQuests };
        localStorage.setItem(`quests_${profileId}`, JSON.stringify(questData));
        setDailyQuests(newQuests);
    };

    const updateQuestProgress = (stats: Stats) => {
        const today = new Date().toISOString().split('T')[0];
        let changed = false;

        const updatedQuests = dailyQuests.map(q => {
            if (q.isCompleted) return q;

            let newValue = q.currentValue;
            if (q.type === 'speed') newValue = Math.max(q.currentValue, stats.wpm);
            if (q.type === 'accuracy') newValue = Math.max(q.currentValue, stats.accuracy);
            if (q.type === 'lessons') newValue = q.currentValue + 1;

            const isNowCompleted = newValue >= q.targetValue;
            if (isNowCompleted || newValue !== q.currentValue) {
                changed = true;
                if (isNowCompleted && !q.isCompleted) {
                    addXp(q.xpReward); // Award bonus XP
                }
                return { ...q, currentValue: newValue, isCompleted: isNowCompleted };
            }
            return q;
        });

        if (JSON.stringify(updatedQuests) !== JSON.stringify(dailyQuests)) {
            setDailyQuests(updatedQuests);
            localStorage.setItem(`quests_${currentProfile.id}`, JSON.stringify({ date: today, quests: updatedQuests }));
        }
    };

    const addXp = (amount: number) => {
        const newXp = currentProfile.xp + amount;
        const newLevel = getLevelFromXp(newXp);
        const oldLevel = currentProfile.level;

        const updatedProfile = { ...currentProfile, xp: newXp, level: newLevel };

        // Update currentProfile state
        setCurrentProfile(updatedProfile);

        // Update profiles array in state and localStorage
        const updatedProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
        setProfiles(updatedProfiles);
        localStorage.setItem('typingpro_profiles', JSON.stringify(updatedProfiles));

        if (newLevel > oldLevel) {
            console.log(`🎉 LEVEL UP! You reached Level ${newLevel}: ${getRankTitle(newLevel)}`);
        }
    };
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
            const profile = loaded[0];
            setCurrentProfile(profile);
            checkStreak(profile);

            setFingerStats(getFingerStats(profile.id));
            initializeDailyQuests(profile.id);

            const hist = getHistory(profile.id);
            const prog = getLessonProgress(profile.id);
            runRetroactiveBadgeCheck(hist, prog);
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
                level: 1,
                streakCount: 1,
                lastLoginDate: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
            const updatedProfiles = [...getProfiles(), newProfile];
            localStorage.setItem('typingpro_profiles', JSON.stringify(updatedProfiles));
            setProfiles(updatedProfiles);
            setCurrentProfile(newProfile);
            checkStreak(newProfile);
            runRetroactiveBadgeCheck([], {});
        }
    };

    const runRetroactiveBadgeCheck = (hist: HistoryEntry[], prog: Record<number, LessonProgress>) => {
        const earned = getEarnedBadges(currentProfile.id);
        BADGES.forEach(badge => {
            if (!earned.some(eb => eb.badgeId === badge.id)) {
                if (badge.condition(hist, prog, currentProfile.streakCount)) {
                    saveEarnedBadge(currentProfile.id, badge.id);
                    setEarnedBadges(prev => [...prev, { badgeId: badge.id, earnedAt: new Date().toISOString() }]);
                }
            }
        });
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

        setLessonProgress(prog);
        setHistory(hist);
        setSettings(prefs);
        setEarnedBadges(badges);
        setKeyStats(keys);
        initializeDailyQuests(profileId); // Ensure quests are initialized/loaded
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

    const getLevelFromXp = (xp: number) => {
        const level = Math.floor(Math.sqrt(xp / 100)) + 1;
        return level;
    };

    const getRankTitle = (level: number) => {
        const sorted = [...XP_LEVELS].sort((a, b) => b.minLevel - a.minLevel);
        return sorted.find(l => level >= l.minLevel)?.title || 'Type Recruit';
    };

    const checkStreak = (profile: UserProfile) => {
        if (!profile.lastLoginDate) {
            updateProfileData(profile.id, { lastLoginDate: new Date().toISOString(), streakCount: 1 });
            return;
        }

        const last = new Date(profile.lastLoginDate);
        const now = new Date();
        const diffTime = now.getTime() - last.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            const newStreak = profile.streakCount + 1;
            updateProfileData(profile.id, { lastLoginDate: now.toISOString(), streakCount: newStreak });
            setCurrentProfile(prev => ({ ...prev, streakCount: newStreak, lastLoginDate: now.toISOString() }));
        } else if (diffDays > 1) {
            // Streak broken
            updateProfileData(profile.id, { lastLoginDate: now.toISOString(), streakCount: 1 });
            setCurrentProfile(prev => ({ ...prev, streakCount: 1, lastLoginDate: now.toISOString() }));
        } else if (diffDays === 0 && now.getDate() !== last.getDate()) {
            // Wrapped around midnight (e.g. 11:30 PM to 00:30 AM)
            const newStreak = profile.streakCount + 1;
            updateProfileData(profile.id, { lastLoginDate: now.toISOString(), streakCount: newStreak });
            setCurrentProfile(prev => ({ ...prev, streakCount: newStreak, lastLoginDate: now.toISOString() }));
        }
    };

    const updateProfileData = (id: string, data: Partial<UserProfile>) => {
        const all = getProfiles();
        const updated = all.map(p => p.id === id ? { ...p, ...data } : p);
        localStorage.setItem('typingpro_profiles', JSON.stringify(updated));
        setProfiles(updated);
    };

    const createNewProfile = (name: string) => {
        const p = createProfile(name);
        const fullProfile: UserProfile = {
            ...p,
            xp: 0,
            level: 1,
            streakCount: 1,
            lastLoginDate: new Date().toISOString()
        };
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
        if (history.length === 0) return null;

        // Use the most recent session's insights
        const lastSession = history[0];
        if (!lastSession.aiInsights) return null;

        const { enemyKeys, bottlenecks } = lastSession.aiInsights;

        // Prioritize Bigram Bottlenecks (more effective for flow)
        if (bottlenecks && bottlenecks.length > 0) {
            const worst = bottlenecks[0].pair;
            const drillContent = Array(12).fill(worst).join(' ');
            return {
                content: drillContent,
                title: `AI Remedial: ${worst.toUpperCase()} Transition Drill`
            };
        }

        // Fallback to single enemy keys
        if (enemyKeys && enemyKeys.length > 0) {
            const worst = enemyKeys[0].char;
            const drillContent = Array(12).fill(worst).join(' ');
            return {
                content: drillContent,
                title: `AI Remedial: ${worst.toUpperCase()} Hesitation Drill`
            };
        }

        return null;
    };

    const recordLessonComplete = (lessonId: number, stats: Stats): boolean => {
        const lesson = HERO_CURRICULUM.find(l => l.id === lessonId);
        if (!lesson) return false;

        // Determine if lesson passed based on criteria
        const minAccuracy = lesson.passingCriteria?.accuracy || 98;
        const minWpm = lesson.passingCriteria?.wpm || 15;
        const passedCriteria = stats.accuracy >= minAccuracy && stats.wpm >= minWpm;

        // Update lesson progress
        const updatedProgress = updateLessonProgress(currentProfile.id, lessonId, {
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            completed: passedCriteria
        });

        let unlockedNext = false;
        if (passedCriteria) {
            // Unlock next lesson if available
            const nextLesson = HERO_CURRICULUM.find(l => l.id > lessonId);
            if (nextLesson) {
                unlockLesson(currentProfile.id, nextLesson.id);
                if (updatedProgress[nextLesson.id]) {
                    updatedProgress[nextLesson.id] = { ...updatedProgress[nextLesson.id], unlocked: true };
                }
                unlockedNext = true;
            }

            // Check for phase completion
            if (lesson.phase) {
                const phaseLessons = HERO_CURRICULUM.filter(l => l.phase === lesson.phase);
                const isPhaseComplete = phaseLessons.every(l => updatedProgress[l.id]?.completed);
                if (isPhaseComplete) {
                    console.log(`🎉 Phase ${lesson.phase} Complete! Great job!`);
                    // Future: Trigger special badge or toast
                }
            }
        }

        setLessonProgress({ ...updatedProgress });

        // Record history entry
        const entry: HistoryEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            lessonId,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            errors: stats.errors,
            durationSeconds: (Date.now() - (stats.startTime || 0)) / 1000,
            wpmTimeline: stats.wpmTimeline,
            keystrokeLog: stats.keystrokeLog,
            handEfficiency: stats.handEfficiency,
            aiInsights: stats.aiInsights
        };

        saveHistory(currentProfile.id, entry);
        const newHistory = [entry, ...history];
        setHistory(newHistory);

        // Update Daily Quest progress
        updateQuestProgress(stats);

        // Calculate and add XP
        let xpGained = 25; // Base XP
        if (stats.accuracy === 100) xpGained += 50;
        if (stats.wpm > 50) xpGained += 25;

        // Apply Streak Multiplier (5% per streak day, max 2x)
        const streakMultiplier = Math.min(2, 1 + (currentProfile.streakCount * 0.05));
        xpGained = Math.round(xpGained * streakMultiplier);

        addXp(xpGained);

        // Check for and award badges
        BADGES.forEach(badge => {
            if (!earnedBadges.some(eb => eb.badgeId === badge.id)) {
                if (badge.condition(newHistory, updatedProgress, currentProfile.streakCount)) {
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
        dailyQuests,
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
        activeLessonId, user, keyStats, fingerStats, dailyQuests, getWeaknessDrill,
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
