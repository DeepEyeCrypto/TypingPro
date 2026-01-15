import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
export const fitnessService = {
    async getFitnessProfile(uid) {
        if (!db)
            return null;
        const docRef = doc(db, 'fitness_profiles', uid);
        const snap = await getDoc(docRef);
        return snap.exists() ? snap.data() : null;
    },
    async updateFitnessData(uid, data) {
        if (!db)
            return;
        const docRef = doc(db, 'fitness_profiles', uid);
        await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
    },
    async patchFitnessData(uid, data) {
        if (!db)
            return;
        const docRef = doc(db, 'fitness_profiles', uid);
        await updateDoc(docRef, data);
    }
};
//# sourceMappingURL=fitnessService.js.map