import { create } from 'zustand';
import { Lesson } from '../data/lessons';

export type MissionState = 'IDLE' | 'BRIEFING' | 'OPERATIONAL' | 'EVALUATING' | 'SUCCESS' | 'FAILURE';

interface MissionData {
    lesson: Lesson | null;
    targetWpm: number;
    minAccuracy: number;
    constraints: string[];
}

interface MissionStore {
    state: MissionState;
    data: MissionData;

    // Actions
    setBriefing: (mission: MissionData) => void;
    startMission: () => void;
    failMission: (reason: string) => void;
    succeedMission: () => void;
    resetMission: () => void;

    // Tracking
    failureReason: string | null;
}

export const useMissionStore = create<MissionStore>((set) => ({
    state: 'IDLE',
    data: {
        lesson: null,
        targetWpm: 0,
        minAccuracy: 0,
        constraints: [],
    },
    failureReason: null,

    setBriefing: (mission) => set({
        state: 'BRIEFING',
        data: mission,
        failureReason: null
    }),

    startMission: () => set({ state: 'OPERATIONAL' }),

    failMission: (reason) => set({
        state: 'FAILURE',
        failureReason: reason
    }),

    succeedMission: () => set({ state: 'SUCCESS' }),

    resetMission: () => set({
        state: 'IDLE',
        data: { lesson: null, targetWpm: 0, minAccuracy: 0, constraints: [] },
        failureReason: null
    }),
}));
