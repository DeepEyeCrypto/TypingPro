import { useFitnessStore } from '../stores/useFitnessStore';
import { fitnessService } from './fitnessService';
import { auth } from '../lib/firebase';

export const orchestrator = {
    async pushToCloud() {
        const user = auth.currentUser || { uid: 'fitness_demo_user' };
        if (!user) return;

        const { activities, stats, dietPlan, biometrics, schedule } = useFitnessStore.getState();
        const { setSynced } = useFitnessStore.getState();

        setSynced(false);
        try {
            await fitnessService.updateFitnessData(user.uid, {
                activities,
                stats,
                dietPlan,
                biometrics,
                schedule
            });
            setSynced(true);
        } catch (error) {
            console.error("Cloud Sync Failed:", error);
            setSynced(false);
        }
    },

    async pullFromCloud() {
        const user = auth.currentUser || { uid: 'fitness_demo_user' };
        if (!user) return;

        try {
            const data = await fitnessService.getFitnessProfile(user.uid);
            if (data) {
                const { setActivities, setStats, setDietPlan, setBiometrics, setSchedule, setSynced } = useFitnessStore.getState();

                if (data.activities) setActivities(data.activities);
                if (data.stats) setStats(data.stats);
                if (data.dietPlan) setDietPlan(data.dietPlan);
                if (data.biometrics) setBiometrics(data.biometrics);
                if (data.schedule) setSchedule(data.schedule);

                setSynced(true);
            }
        } catch (error) {
            console.error("Cloud Pull Failed:", error);
        }
    }
};
