
import { HistoryEntry, LessonProgress, UserSettings, UserProfile, EarnedBadge } from "../types";
import { LESSONS } from "../constants";

const DEFAULT_PROFILE_ID = 'default';

// Helper to namespace keys by profile
const getKey = (base: string, profileId: string = DEFAULT_PROFILE_ID) => `${base}_${profileId}`;

const KEYS = {
    HISTORY: 'typing_history_v2',
    PROGRESS: 'typing_progress_v2',
    PREFS: 'typing_prefs_v3', // v3 for new settings structure
    PROFILES: 'typing_profiles_v1',
    BADGES: 'typing_badges_v1'
};

// --- Profiles ---

export const getProfiles = (): UserProfile[] => {
    try {
        const data = localStorage.getItem(KEYS.PROFILES);
        const profiles = data ? JSON.parse(data) : [];
        if (profiles.length === 0) {
            const def: UserProfile = { id: 'default', name: 'Guest', createdAt: new Date().toISOString() };
            localStorage.setItem(KEYS.PROFILES, JSON.stringify([def]));
            return [def];
        }
        return profiles;
    } catch {
        return [{ id: 'default', name: 'Guest', createdAt: new Date().toISOString() }];
    }
};

export const createProfile = (name: string): UserProfile => {
    const profiles = getProfiles();
    const newProfile: UserProfile = {
        id: Date.now().toString(),
        name,
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

export const updateLessonProgress = (profileId: string, lessonId: number, stats: { wpm: number, accuracy: number, completed: boolean }) => {
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

export const unlockLesson = (profileId: string, lessonId: number) => {
    const progress = getLessonProgress(profileId);
    if (!progress[lessonId]) {
        progress[lessonId] = { unlocked: true, completed: false, bestWpm: 0, bestAccuracy: 0, runCount: 0 };
    } else {
        progress[lessonId].unlocked = true;
    }
    localStorage.setItem(getKey(KEYS.PROGRESS, profileId), JSON.stringify(progress));
    return progress;
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
    stopOnError: false
};

export const getSettings = (profileId: string): UserSettings => {
    try {
        const data = localStorage.getItem(getKey(KEYS.PREFS, profileId));
        if (data) {
            const parsed = JSON.parse(data);
            // Migration for old boolean darkMode
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
