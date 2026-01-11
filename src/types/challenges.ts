// ═══════════════════════════════════════════════════════════════════
// CHALLENGE TYPES - Daily/Weekly challenges for bonus Keystones
// ═══════════════════════════════════════════════════════════════════

export type ChallengeType = 'speed' | 'accuracy' | 'endurance' | 'perfect' | 'streak';
export type ChallengeMetric = 'wpm' | 'accuracy' | 'duration' | 'lessons' | 'sessions';

export interface DailyChallenge {
    id: string;
    date: string; // YYYY-MM-DD
    type: ChallengeType;
    title: string;
    description: string;
    requirement: {
        metric: ChallengeMetric;
        target: number;
    };
    reward_keystones: number;
    expires_at: string;
}

export interface UserChallengeProgress {
    challenge_id: string;
    progress: number;
    target: number;
    completed: boolean;
    completed_at?: string;
}

// Challenge templates for generating daily challenges
export const CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'id' | 'date' | 'expires_at'>[] = [
    { type: 'speed', title: 'Speed Burst', description: 'Achieve 50 WPM in any test', requirement: { metric: 'wpm', target: 50 }, reward_keystones: 15 },
    { type: 'speed', title: 'Lightning Fingers', description: 'Achieve 70 WPM in any test', requirement: { metric: 'wpm', target: 70 }, reward_keystones: 25 },
    { type: 'accuracy', title: 'Precision Strike', description: 'Complete a test with 98%+ accuracy', requirement: { metric: 'accuracy', target: 98 }, reward_keystones: 20 },
    { type: 'perfect', title: 'Perfect Session', description: 'Complete a test with 100% accuracy', requirement: { metric: 'accuracy', target: 100 }, reward_keystones: 30 },
    { type: 'endurance', title: 'Marathon Typer', description: 'Practice for 10 minutes total', requirement: { metric: 'duration', target: 600 }, reward_keystones: 25 },
    { type: 'endurance', title: 'Practice Round', description: 'Complete 3 lessons', requirement: { metric: 'lessons', target: 3 }, reward_keystones: 20 },
    { type: 'streak', title: 'Consistency King', description: 'Complete 5 sessions today', requirement: { metric: 'sessions', target: 5 }, reward_keystones: 35 },
];
