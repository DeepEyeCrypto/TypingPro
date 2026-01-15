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
export declare const useFitnessStore: import("zustand").UseBoundStore<import("zustand").StoreApi<FitnessState>>;
export {};
//# sourceMappingURL=useFitnessStore.d.ts.map