// ═══════════════════════════════════════════════════════════════════
// STREAK SERVICE - Daily practice streak tracking
// ═══════════════════════════════════════════════════════════════════

export interface StreakData {
    current_streak: number;
    longest_streak: number;
    last_practice_date: string | null;
}

// Get today's date as YYYY-MM-DD
function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

// Get yesterday's date as YYYY-MM-DD
function getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

// Check if streak is still valid (practiced today or yesterday)
export function isStreakValid(lastPracticeDate: string | null): boolean {
    if (!lastPracticeDate) return false;
    const today = getToday();
    const yesterday = getYesterday();
    return lastPracticeDate === today || lastPracticeDate === yesterday;
}

// Update streak after a practice session
export function updateStreak(currentData: StreakData): StreakData {
    const today = getToday();
    const yesterday = getYesterday();

    let newStreak = currentData.current_streak;
    let longestStreak = currentData.longest_streak;

    if (currentData.last_practice_date === today) {
        // Already practiced today, no change
        return currentData;
    }

    if (currentData.last_practice_date === yesterday) {
        // Continued the streak
        newStreak += 1;
    } else if (currentData.last_practice_date === null || currentData.last_practice_date < yesterday) {
        // Streak broken, start fresh
        newStreak = 1;
    }

    // Update longest streak if needed
    if (newStreak > longestStreak) {
        longestStreak = newStreak;
    }

    return {
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_practice_date: today,
    };
}

// Get streak bonus keystones
export function getStreakBonus(streak: number): number {
    if (streak >= 100) return 50;
    if (streak >= 30) return 25;
    if (streak >= 7) return 10;
    if (streak >= 3) return 5;
    return 0;
}

// Get streak milestone message
export function getStreakMilestone(streak: number): { reached: boolean; milestone: number; message: string } | null {
    const milestones = [7, 30, 100, 365];

    for (const milestone of milestones) {
        if (streak === milestone) {
            const messages: Record<number, string> = {
                7: '🔥 Week Warrior! 7-day streak!',
                30: '🔥🔥 Month Master! 30-day streak!',
                100: '💯 Century Legend! 100-day streak!',
                365: '👑 Year King! 365-day streak!',
            };
            return { reached: true, milestone, message: messages[milestone] };
        }
    }
    return null;
}

// Check if streak was broken
export function wasStreakBroken(lastPracticeDate: string | null): boolean {
    if (!lastPracticeDate) return false;
    const yesterday = getYesterday();
    return lastPracticeDate < yesterday;
}
