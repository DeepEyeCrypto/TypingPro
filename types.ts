
export interface Lesson {
  id: number;
  title: string;
  description: string;
  keys: string[]; // Keys introduced/focused in this lesson
  content: string; // The practice text
  module?: string;
  difficulty?: number;
  target_wpm?: number;
  isAiGenerated?: boolean;
  newKeys?: string[]; // Keys specifically introduced in this lesson
  videoUrl?: string; // Optional HLS tutorial video
  type?: 'standard' | 'burst'; // Speed drills
  targetAccuracy?: number; // Proposed 98-99%
  fingerMap?: Record<string, string>; // Maps chars to fingers for specifically this lesson's drills
  tips?: string[]; // Pedagogical guidance for beginners
  passingCriteria?: {
    accuracy: number;
    wpm: number;
  };
  phase?: 1 | 2 | 3 | 4;
  isMasterMode?: boolean; // If true, restart on any mistake
}

export interface KeyStats {
  char: string;
  totalPresses: number;
  errorCount: number;
  accuracy: number; // 0-100
}

export interface FingerStats {
  finger: string;
  totalPresses: number;
  errorCount: number;
  accuracy: number;
  avgHoldTime?: number;
}

export interface BigramStats {
  pair: string; // e.g. "th", "er"
  avgLatency: number;
  count: number;
}

export type QuestType = 'speed' | 'accuracy' | 'endurance' | 'lessons';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  type: QuestType;
  xpReward: number;
  icon: string; // Lucide icon name
}

export interface KeystrokeEvent {
  char: string;
  code: string;
  timestamp: number;
  latency: number; // ms since last character down
  holdTime?: number; // ms between keyDown and keyUp
  isError: boolean;
  expectedChar: string;
}

export interface Stats {
  wpm: number;
  totalWpm?: number;
  netWpm?: number;
  grossWpm?: number;
  cpm?: number;
  accuracy: number;
  errors: number;
  progress: number; // 0-100
  startTime: number | null;
  completed: boolean;
  keyStats?: Record<string, KeyStats>;
  fingerStats?: Record<string, FingerStats>;
  formAccuracy?: number; // Percentage of correct finger usage
  wpmTimeline?: { timestamp: number; wpm: number }[]; // For real-time graphing
  keystrokeLog?: KeystrokeEvent[]; // For session replay and forensics
  handEfficiency?: { left: number; right: number }; // Speed/accuracy ratio per hand
  bestCombo?: number;
  aiInsights?: {
    enemyKeys: { char: string; avgHold: number }[];
    bottlenecks: { pair: string; avgLat: number }[];
  };
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
  netWpm?: number;
  grossWpm?: number;
  cpm?: number;
  accuracy: number;
  errors: number;
  durationSeconds: number;
  wpmTimeline?: { timestamp: number; wpm: number }[];
  keystrokeLog?: KeystrokeEvent[];
  handEfficiency?: { left: number; right: number };
  bestCombo?: number;
  aiInsights?: {
    enemyKeys: { char: string; avgHold: number }[];
    bottlenecks: { pair: string; avgLat: number }[];
  };
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
export type OSLayoutType = 'win' | 'mac';
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type CursorStyle = 'block' | 'line' | 'underline' | 'box';
export type TrainingMode = 'speed' | 'accuracy';

export interface UserSettings {
  theme: ThemeMode;
  keyboardLayout: KeyboardLayoutType;
  osLayout: OSLayoutType;
  soundEnabled: boolean;
  volume: number; // 0.0 to 1.0
  showKeyboard: boolean;
  fontFamily: string;
  fontSize: FontSize;
  cursorStyle: CursorStyle;
  stopOnError: boolean;
  trainingMode: TrainingMode;
  fontColor: string;
  wpmGoal?: number;
  accuracyGoal?: number;
  showHands: boolean;
  performanceMode: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  streakCount: number;
  lastLoginDate?: string; // ISO string
  createdAt: string;
}

export interface DailyActivity {
  date: string; // ISO yyyy-mm-dd
  totalWords: number;
  totalDuration: number; // seconds
  lessonsCompleted: number;
  avgWpm: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  condition: (history: HistoryEntry[], progress: Record<number, LessonProgress>, streak?: number) => boolean;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

export interface VirtualKey {
  code: string;
  width?: number;
  finger: string;
  homing?: boolean;
  label?: string;
}
