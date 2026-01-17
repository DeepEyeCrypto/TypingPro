// ═══════════════════════════════════════════════════════════════════
// CHALLENGE TYPES
// ═══════════════════════════════════════════════════════════════════

export type ChallengeMetric = 'wpm' | 'accuracy' | 'duration' | 'lessons' | 'sessions';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeTemplate {
    title: string;
    description: string;
    difficulty: ChallengeDifficulty;
    requirement: {
        metric: ChallengeMetric;
        target: number;
    };
    reward_keystones: number;
}

export interface DailyChallenge extends ChallengeTemplate {
    id: string;
    date: string;
    expires_at: string;
}

export interface UserChallengeProgress {
    challenge_id: string;
    progress: number;
    target: number;
    completed: boolean;
    completed_at?: string;
}

// Challenge templates pool
export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
    {
        title: 'Speed Demon',
        description: 'Reach 60 WPM in a single session',
        difficulty: 'medium',
        requirement: { metric: 'wpm', target: 60 },
        reward_keystones: 50
    },
    {
        title: 'Perfect Precision',
        description: 'Achieve 98% accuracy in a session',
        difficulty: 'hard',
        requirement: { metric: 'accuracy', target: 98 },
        reward_keystones: 75
    },
    {
        title: 'Warm Up',
        description: 'Complete 3 lessons today',
        difficulty: 'easy',
        requirement: { metric: 'lessons', target: 3 },
        reward_keystones: 25
    },
    {
        title: 'Marathon Typist',
        description: 'Type for 10 minutes total',
        difficulty: 'medium',
        requirement: { metric: 'duration', target: 600 },
        reward_keystones: 40
    },
    {
        title: 'Quick Sprint',
        description: 'Complete 5 sessions',
        difficulty: 'easy',
        requirement: { metric: 'sessions', target: 5 },
        reward_keystones: 30
    },
    {
        title: 'Velocity Master',
        description: 'Reach 80 WPM in a single session',
        difficulty: 'hard',
        requirement: { metric: 'wpm', target: 80 },
        reward_keystones: 100
    },
];
