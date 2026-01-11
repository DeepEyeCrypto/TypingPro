import { create } from 'zustand';

export interface Activity {
    name: string;
    value: number;
}

export interface Stat {
    label: string;
    val: string;
    icon: string;
    color: string;
}

export interface DietItem {
    name: string;
    day: string;
    image: string;
    active?: boolean;
}

export interface UserBiometric {
    weight: string;
    height: string;
    age: string;
}

export interface ScheduledItem {
    category: string;
    title: string;
    dates: string;
    image: string;
}

interface FitnessState {
    activities: Activity[];
    stats: Stat[];
    dietPlan: DietItem[];
    biometrics: UserBiometric;
    schedule: ScheduledItem[];
    synced: boolean;

    setActivities: (activities: Activity[]) => void;
    setStats: (stats: Stat[]) => void;
    setDietPlan: (plan: DietItem[]) => void;
    setBiometrics: (bio: UserBiometric) => void;
    setSchedule: (schedule: ScheduledItem[]) => void;
    setSynced: (status: boolean) => void;
}

export const useFitnessStore = create<FitnessState>((set) => ({
    activities: [
        { name: 'Mon', value: 30 },
        { name: 'Tue', value: 45 },
        { name: 'Wed', value: 35 },
        { name: 'Thu', value: 60 },
        { name: 'Fri', value: 40 },
        { name: 'Sat', value: 75 },
        { name: 'Sun', value: 50 },
    ],
    stats: [
        { label: 'Calories', val: '1428 Kcal', icon: 'Flame', color: 'text-orange-400' },
        { label: 'Heart Rate', val: '104 bpm', icon: 'Heart', color: 'text-pink-500' },
        { label: 'Steps', val: '9,886', icon: 'Footprints', color: 'text-green-500' },
        { label: 'Sleep', val: '8.5 hrs', icon: 'Moon', color: 'text-blue-500' },
    ],
    dietPlan: [
        { name: 'Fruits only', day: 'Day 1', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' },
        { name: 'Vegetables', day: 'Day 2', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', active: true },
    ],
    biometrics: { weight: '75 kg', height: '180 cm', age: '26 yrs' },
    schedule: [
        { category: 'Fitness', title: 'Cardio Workshop', dates: '17-21 Dec', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b' },
        { category: 'Fitness', title: 'Strength Training', dates: '22-25 Dec', image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d' },
        { category: 'Yoga', title: 'Morning Flow', dates: '26-28 Dec', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b' },
    ],
    synced: true,

    setActivities: (activities) => set({ activities }),
    setStats: (stats) => set({ stats }),
    setDietPlan: (dietPlan) => set({ dietPlan }),
    setBiometrics: (biometrics) => set({ biometrics }),
    setSchedule: (schedule) => set({ schedule }),
    setSynced: (synced) => set({ synced }),
}));
