import { db } from '@src/lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface UserProfile {
    uid: string;
    username: string;
    username_lowercase: string;
    avatar_url: string;
    created_at: number;
    // Stats
    highest_wpm: number;
    avg_wpm: number;
    total_races: number;
    rank_points: number;
}

export const userService = {
    async checkUsernameTaken(username: string): Promise<boolean> {
        // Check reserved usernames collection
        const docRef = doc(db, 'usernames', username.toLowerCase());
        const snap = await getDoc(docRef);
        return snap.exists();
    },

    async getProfile(uid: string): Promise<UserProfile | null> {
        try {
            const docRef = doc(db, 'profiles', uid);
            const snap = await getDoc(docRef);
            return snap.exists() ? snap.data() as UserProfile : null;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    },

    async createProfile(uid: string, username: string, avatarUrl: string): Promise<boolean> {
        const lowerName = username.toLowerCase();

        // Final check for uniqueness
        const taken = await this.checkUsernameTaken(username);
        if (taken) return false;

        const profile: UserProfile = {
            uid,
            username,
            username_lowercase: lowerName,
            avatar_url: avatarUrl,
            created_at: Date.now(),
            highest_wpm: 0,
            avg_wpm: 0,
            total_races: 0,
            rank_points: 0
        };

        try {
            // Reserve username first
            await setDoc(doc(db, 'usernames', lowerName), { uid });
            // Create profile
            await setDoc(doc(db, 'profiles', uid), profile);
            return true;
        } catch (error: any) {
            console.error("Error creating profile:", error);
            // THROW the error so UI can see "Permission Denied" etc.
            throw new Error(error.message || "Unknown Firestore Error");
        }
    },

    async updateStats(uid: string, wpm: number): Promise<void> {
        try {
            const docRef = doc(db, 'profiles', uid);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                const data = snap.data() as UserProfile;
                const newTotalRaces = (data.total_races || 0) + 1;
                const newHighest = Math.max(data.highest_wpm || 0, wpm);

                // Simple moving average for now, ideally store total WPM sum
                // Re-calculating proper average requires previous sum.
                // Assuming current avg is accurate:
                const oldTotalWpm = (data.avg_wpm || 0) * (data.total_races || 0);
                const newAvg = Math.round((oldTotalWpm + wpm) / newTotalRaces);

                await setDoc(docRef, {
                    ...data,
                    total_races: newTotalRaces,
                    highest_wpm: newHighest,
                    avg_wpm: newAvg,
                    // Rank points = Highest WPM * 10 + Races (simple formula)
                    rank_points: (newHighest * 10) + newTotalRaces
                }, { merge: true });
            }
        } catch (error) {
            console.error("Failed to update stats:", error);
        }
    }
};
