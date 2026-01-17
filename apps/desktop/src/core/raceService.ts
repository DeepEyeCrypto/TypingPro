import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

export interface ReplayEvent {
    char: string;
    time: number; // Relative time in ms
}

export interface RaceData {
    id: string;
    uid: string;
    username: string;
    wpm: number;
    accuracy: number;
    timestamp: number;
    replay: ReplayEvent[];
    lessonId: string; // To ensure we challenge on the same text
}

export const raceService = {
    async saveRace(race: RaceData): Promise<void> {
        // Save to top-level races collection
        await setDoc(doc(db, 'races', race.id), race);

        // Also could update "best_race" subcollection if it's a new personal best
        // avoiding complex logic for now, just saving all races
    },

    async getBestRace_Global(lessonId: string): Promise<RaceData | null> {
        const q = query(
            collection(db, 'races'),
            where('lessonId', '==', lessonId),
            orderBy('wpm', 'desc'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as RaceData;
    },

    async getBestRace_User(uid: string): Promise<RaceData | null> {
        const q = query(
            collection(db, 'races'),
            where('uid', '==', uid),
            orderBy('wpm', 'desc'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as RaceData;
    }
};
