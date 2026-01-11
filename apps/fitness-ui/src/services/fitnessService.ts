import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const fitnessService = {
    async getFitnessProfile(uid: string) {
        if (!db) return null;
        const docRef = doc(db, 'fitness_profiles', uid);
        const snap = await getDoc(docRef);
        return snap.exists() ? snap.data() : null;
    },

    async updateFitnessData(uid: string, data: any) {
        if (!db) return;
        const docRef = doc(db, 'fitness_profiles', uid);
        await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
    },

    async patchFitnessData(uid: string, data: any) {
        if (!db) return;
        const docRef = doc(db, 'fitness_profiles', uid);
        await updateDoc(docRef, data);
    }
};
