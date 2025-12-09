
export interface Lesson {
  id: number;
  title: string;
  description: string;
  keys: string[]; // Keys introduced/focused in this lesson
  content: string; // The practice text
  isAiGenerated?: boolean;
}

export interface Stats {
  wpm: number;
  accuracy: number;
  errors: number;
  progress: number; // 0-100
  startTime: number | null;
  completed: boolean;
}

export enum GameState {
  IDLE = 'IDLE',
  TYPING = 'TYPING',
  COMPLETED = 'COMPLETED',
}

export interface KeyState {
  key: string;
  isPressed: boolean;
  isTarget: boolean;
  finger: 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';
}

export interface HistoryEntry {
  id: string;
  date: string;
  lessonId: number;
  wpm: number;
  accuracy: number;
  errors: number;
  durationSeconds: number;
}

export interface LessonProgress {
  unlocked: boolean;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  runCount: number;
}

// --- New Types for Advanced Features ---

export type KeyboardLayoutType = 'qwerty' | 'dvorak' | 'colemak';
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type CursorStyle = 'block' | 'line' | 'underline' | 'box';

export interface UserSettings {
  theme: ThemeMode;
  keyboardLayout: KeyboardLayoutType;
  soundEnabled: boolean;
  volume: number; // 0.0 to 1.0
  showKeyboard: boolean;
  fontFamily: string;
  fontSize: FontSize;
  cursorStyle: CursorStyle;
  stopOnError: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  condition: (history: HistoryEntry[], progress: Record<number, LessonProgress>) => boolean;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}
