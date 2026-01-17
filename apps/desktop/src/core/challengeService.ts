// ═══════════════════════════════════════════════════════════════════
// CHALLENGE SERVICE - Daily challenge generation and tracking
// ═══════════════════════════════════════════════════════════════════

import { DailyChallenge, UserChallengeProgress, CHALLENGE_TEMPLATES } from '../types/challenges';

// Generate today's challenges (2-3 random challenges)
export function generateDailyChallenges(date: string = new Date().toISOString().split('T')[0]): DailyChallenge[] {
    // Use date as seed for consistent challenges per day
    const seed = hashDate(date);
    const shuffled = shuffleWithSeed([...CHALLENGE_TEMPLATES], seed);

    // Pick 3 challenges
    const selected = shuffled.slice(0, 3);

    // Calculate expiry (end of day UTC)
    const expiryDate = new Date(date);
    expiryDate.setUTCHours(23, 59, 59, 999);

    return selected.map((template, index) => ({
        ...template,
        id: `${date}-${index}`,
        date,
        expires_at: expiryDate.toISOString(),
    }));
}

// Simple hash for seeding
function hashDate(date: string): number {
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
        hash = ((hash << 5) - hash) + date.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// Seeded shuffle
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
    const result = [...array];
    let currentSeed = seed;

    for (let i = result.length - 1; i > 0; i--) {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        const j = Math.floor((currentSeed / 233280) * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

// Update challenge progress after a session
export function updateChallengeProgress(
    challenge: DailyChallenge,
    currentProgress: UserChallengeProgress,
    sessionResult: { wpm: number; accuracy: number; duration: number }
): UserChallengeProgress {
    if (currentProgress.completed) return currentProgress;

    let newProgress = currentProgress.progress;

    switch (challenge.requirement.metric) {
        case 'wpm':
            // Take best WPM achieved
            newProgress = Math.max(newProgress, sessionResult.wpm);
            break;
        case 'accuracy':
            // Take best accuracy achieved
            newProgress = Math.max(newProgress, sessionResult.accuracy);
            break;
        case 'duration':
            // Accumulate duration
            newProgress += sessionResult.duration;
            break;
        case 'lessons':
            // Increment lessons count
            newProgress += 1;
            break;
        case 'sessions':
            // Increment session count
            newProgress += 1;
            break;
    }

    const completed = newProgress >= challenge.requirement.target;

    return {
        ...currentProgress,
        progress: newProgress,
        completed,
        completed_at: completed ? new Date().toISOString() : undefined,
    };
}

// Calculate challenge progress percentage
export function getChallengeProgressPercent(challenge: DailyChallenge, progress: number): number {
    return Math.min(100, Math.round((progress / challenge.requirement.target) * 100));
}

// Get total keystones from completed challenges
export function getCompletedChallengeRewards(challenges: DailyChallenge[], progressMap: Record<string, UserChallengeProgress>): number {
    return challenges.reduce((total, challenge) => {
        const progress = progressMap[challenge.id];
        if (progress?.completed) {
            return total + challenge.reward_keystones;
        }
        return total;
    }, 0);
}

// Initialize empty progress for a challenge
export function initializeChallengeProgress(challengeId: string): UserChallengeProgress {
    return {
        challenge_id: challengeId,
        progress: 0,
        target: 0,
        completed: false,
    };
}
