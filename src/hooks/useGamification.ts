import { useCallback } from 'react';
import { Stats, UserProfile, DailyQuest } from '../../types';

const LEVEL_XP_BASE = 1000;
const LEVEL_GROWTH = 1.2;

export const useGamification = () => {
    const calculateXP = useCallback((stats: Stats): number => {
        const accuracyMultiplier = stats.accuracy / 100;
        const speedBonus = stats.wpm * 2;
        const baseXP = (stats.progress === 100 ? 50 : 0);

        return Math.round((baseXP + speedBonus) * accuracyMultiplier);
    }, []);

    const processLevelUp = useCallback((currentProfile: UserProfile, xpGained: number) => {
        let newXP = currentProfile.xp + xpGained;
        let newLevel = currentProfile.level;

        const getXPForLevel = (lvl: number) => Math.round(LEVEL_XP_BASE * Math.pow(LEVEL_GROWTH, lvl - 1));

        while (newXP >= getXPForLevel(newLevel)) {
            newXP -= getXPForLevel(newLevel);
            newLevel++;
        }

        return { ...currentProfile, xp: newXP, level: newLevel };
    }, []);

    const updateQuests = useCallback((quests: DailyQuest[], stats: Stats): DailyQuest[] => {
        return quests.map(quest => {
            if (quest.isCompleted) return quest;

            let newValue = quest.currentValue;
            switch (quest.type) {
                case 'speed':
                    if (stats.wpm >= quest.targetValue) newValue = quest.targetValue;
                    break;
                case 'accuracy':
                    if (stats.accuracy >= quest.targetValue && stats.progress === 100) newValue = quest.targetValue;
                    break;
                case 'lessons':
                    if (stats.progress === 100) newValue += 1;
                    break;
            }

            const isCompleted = newValue >= quest.targetValue;
            return { ...quest, currentValue: newValue, isCompleted };
        });
    }, []);

    return {
        calculateXP,
        processLevelUp,
        updateQuests,
    };
};
