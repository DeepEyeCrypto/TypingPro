
import { HistoryEntry, LessonProgress, UserSettings, UserProfile, EarnedBadge, KeyStats, DailyGoal, FingerStats } from "../types";
import { LESSONS } from "../constants";

const DEFAULT_PROFILE_ID = 'default';

// Helper to namespace keys by profile
const getKey = (base: string, profileId: string = DEFAULT_PROFILE_ID) => `${base}_${profileId}`;

const KEYS = {
    HISTORY: 'typing_history_v2',
    PROGRESS: 'typing_progress_v2',
    PREFS: 'typing_prefs_v3',
    PROFILES: 'typing_profiles_v1',
    BADGES: 'typing_badges_v1',
    KEY_STATS: 'typing_key_stats_v1',
    FINGER_STATS: 'typing_finger_stats_v1',
    DAILY_GOALS: 'typing_daily_goals_v1'
};

// --- Profiles ---

export const getProfiles = (): UserProfile[] => {
    try {
        const data = localStorage.getItem(KEYS.PROFILES);
        const profiles = data ? JSON.parse(data) : [];
        if (profiles.length === 0) {
            const def: UserProfile = {
                id: 'default',
                name: 'Guest',
                xp: 0,
                level: 'Recruit',
                createdAt: new Date().toISOString()
            };
            localStorage.setItem(KEYS.PROFILES, JSON.stringify([def]));
            return [def];
        }
        return profiles;
    } catch {
        return [{
            id: 'default',
            name: 'Guest',
            xp: 0,
            level: 'Recruit',
            createdAt: new Date().toISOString()
        }];
    }
};

export const createProfile = (name: string): UserProfile => {
    const profiles = getProfiles();
    const newProfile: UserProfile = {
        id: Date.now().toString(),
        name,
        xp: 0,
        level: 'Recruit',
        createdAt: new Date().toISOString()
    };
    profiles.push(newProfile);
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
    return newProfile;
};

// --- History ---

export const saveHistory = (profileId: string, entry: HistoryEntry) => {
    const history = getHistory(profileId);
    history.unshift(entry);
    try {
        localStorage.setItem(getKey(KEYS.HISTORY, profileId), JSON.stringify(history));
    } catch (e) {
        console.error("Storage full or error saving history", e);
    }
};

export const getHistory = (profileId: string): HistoryEntry[] => {
    try {
        const data = localStorage.getItem(getKey(KEYS.HISTORY, profileId));
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

export const clearHistory = (profileId: string) => {
    localStorage.removeItem(getKey(KEYS.HISTORY, profileId));
};

// --- Lesson Progress ---

export const getLessonProgress = (profileId: string): Record<number, LessonProgress> => {
    try {
        const data = localStorage.getItem(getKey(KEYS.PROGRESS, profileId));
        if (data) return JSON.parse(data);
    } catch (e) {
        // Fallback
    }

    const initialProgress: Record<number, LessonProgress> = {};
    LESSONS.forEach(l => {
        initialProgress[l.id] = {
            unlocked: l.id === 1,
            completed: false,
            bestWpm: 0,
            bestAccuracy: 0,
            runCount: 0
        };
    });
    return initialProgress;
};

export const updateLessonProgress = (profileId: string, lessonId: number, stats: { wpm: number, accuracy: number, completed: boolean }): Record<number, LessonProgress> => {
    const progress = getLessonProgress(profileId);

    if (!progress[lessonId]) {
        progress[lessonId] = { unlocked: false, completed: false, bestWpm: 0, bestAccuracy: 0, runCount: 0 };
    }

    const current = progress[lessonId];
    current.runCount += 1;
    current.bestWpm = Math.max(current.bestWpm, stats.wpm);
    current.bestAccuracy = Math.max(current.bestAccuracy, stats.accuracy);
    if (stats.completed) current.completed = true;

    localStorage.setItem(getKey(KEYS.PROGRESS, profileId), JSON.stringify(progress));
    return progress;
};

export const unlockLesson = (profileId: string, lessonId: number): Record<number, LessonProgress> => {
    const progress = getLessonProgress(profileId);
    if (!progress[lessonId]) {
        progress[lessonId] = { unlocked: true, completed: false, bestWpm: 0, bestAccuracy: 0, runCount: 0 };
    } else {
        progress[lessonId].unlocked = true;
    }
    localStorage.setItem(getKey(KEYS.PROGRESS, profileId), JSON.stringify(progress));
    return progress;
};

// --- Key Stats ---

export const getKeyStats = (profileId: string): Record<string, KeyStats> => {
    try {
        const data = localStorage.getItem(getKey(KEYS.KEY_STATS, profileId));
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
};

export const updateKeyStats = (profileId: string, sessionStats: Record<string, KeyStats>): Record<string, KeyStats> => {
    const current = getKeyStats(profileId);

    Object.values(sessionStats).forEach(stat => {
        if (!current[stat.char]) {
            current[stat.char] = { char: stat.char, totalPresses: 0, errorCount: 0, accuracy: 0 };
        }
        const existing = current[stat.char];
        existing.totalPresses += stat.totalPresses;
        existing.errorCount += stat.errorCount;
        existing.accuracy = Math.round(((existing.totalPresses - existing.errorCount) / Math.max(1, existing.totalPresses)) * 100);
    });

    localStorage.setItem(getKey(KEYS.KEY_STATS, profileId), JSON.stringify(current));
    return current;
};

// --- Finger Stats ---

export const getFingerStats = (profileId: string): Record<string, FingerStats> => {
    try {
        const data = localStorage.getItem(getKey(KEYS.FINGER_STATS, profileId));
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
};

export const updateFingerStats = (profileId: string, sessionFingerStats: Record<string, FingerStats>): Record<string, FingerStats> => {
    const current = getFingerStats(profileId);

    Object.values(sessionFingerStats).forEach(stat => {
        if (!current[stat.finger]) {
            current[stat.finger] = { finger: stat.finger, totalPresses: 0, errorCount: 0, accuracy: 0 };
        }
        const existing = current[stat.finger];
        existing.totalPresses += stat.totalPresses;
        existing.errorCount += stat.errorCount;
        existing.accuracy = Math.round(((existing.totalPresses - existing.errorCount) / Math.max(1, existing.totalPresses)) * 100);
    });

    localStorage.setItem(getKey(KEYS.FINGER_STATS, profileId), JSON.stringify(current));
    return current;
};

// --- Daily Goals ---

export const getDailyGoals = (profileId: string): DailyGoal[] => {
    try {
        const data = localStorage.getItem(getKey(KEYS.DAILY_GOALS, profileId));
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveDailyGoals = (profileId: string, goals: DailyGoal[]) => {
    localStorage.setItem(getKey(KEYS.DAILY_GOALS, profileId), JSON.stringify(goals));
};


// --- Settings ---

const DEFAULT_SETTINGS: UserSettings = {
    theme: 'system',
    keyboardLayout: 'qwerty',
    soundEnabled: true,
    volume: 0.5,
    showKeyboard: true,
    fontFamily: 'Inter',
    fontSize: 'large',
    cursorStyle: 'block',
    stopOnError: false,
    trainingMode: 'accuracy',
    fontColor: 'white',
    showHands: true
};

export const getSettings = (profileId: string): UserSettings => {
    try {
        const data = localStorage.getItem(getKey(KEYS.PREFS, profileId));
        if (data) {
            const parsed = JSON.parse(data);
            if (typeof parsed.darkMode === 'boolean') {
                parsed.theme = parsed.darkMode ? 'dark' : 'light';
                delete parsed.darkMode;
            }
            return { ...DEFAULT_SETTINGS, ...parsed };
        }
        return DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = (profileId: string, settings: UserSettings) => {
    localStorage.setItem(getKey(KEYS.PREFS, profileId), JSON.stringify(settings));
};

// --- Badges ---

export const getEarnedBadges = (profileId: string): EarnedBadge[] => {
    try {
        const data = localStorage.getItem(getKey(KEYS.BADGES, profileId));
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveEarnedBadge = (profileId: string, badgeId: string) => {
    const badges = getEarnedBadges(profileId);
    if (!badges.find(b => b.badgeId === badgeId)) {
        badges.push({ badgeId, earnedAt: new Date().toISOString() });
        localStorage.setItem(getKey(KEYS.BADGES, profileId), JSON.stringify(badges));
    }
};
