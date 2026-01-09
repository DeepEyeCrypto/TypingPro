import { db, getFirebaseDebugInfo } from '@src/lib/firebase';
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
    unlocked_lessons?: string[];
    completed_lessons?: string[];
}

const withTimeout = <T>(promise: Promise<T>, ms: number, message: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(message)), ms)
        )
    ]);
};

export const userService = {
    async getProfile(uid: string): Promise<UserProfile | null> {
        try {
            if (!db || !db.type) return null;
            const docRef = doc(db, 'profiles', uid);
            // 5 second timeout for getting profile
            const snap = await withTimeout(getDoc(docRef), 5000, "GetProfile Timeout");
            return snap.exists() ? snap.data() as UserProfile : null;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    },

    async createProfile(uid: string, username: string, avatarUrl: string): Promise<boolean> {
        if (!db || !db.type) {
            const debug = getFirebaseDebugInfo();
            console.error("Firebase DB not initialized", debug);
            throw new Error(`System Error: Database not connected. (API: ${debug.apiKey}, PROJ: ${debug.projectId}). Please check internet/updates.`);
        }
        const lowerName = username.toLowerCase();

        console.log(`[UserService] Creating profile for ${username} (uid: ${uid})`);

        try {
            // Final check for uniqueness (5s timeout)
            const taken = await withTimeout(this.checkUsernameTaken(username), 5000, "Username check timed out");
            if (taken) {
                console.warn(`[UserService] Username ${username} is already taken`);
                return false;
            }

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

            // Reserve username first (8s timeout)
            console.log(`[UserService] Reserving username: ${lowerName}`);
            await withTimeout(setDoc(doc(db, 'usernames', lowerName), { uid }), 8000, "Failed to reserve username (Timeout)");

            // Create profile (8s timeout)
            console.log(`[UserService] Writing profile document for: ${uid}`);
            await withTimeout(setDoc(doc(db, 'profiles', uid), profile), 8000, "Failed to save profile document (Timeout)");

            console.log(`[UserService] Profile created successfully for ${username}`);
            return true;
        } catch (error: any) {
            console.error("[UserService] Error creating profile:", error);
            const msg = error.message || "Unknown Firestore Error";
            if (msg.includes("Timeout")) {
                throw new Error("Network is too slow or Firestore is unreachable. Please check your connection.");
            }
            throw new Error(msg);
        }
    },

    async updateStats(uid: string, wpm: number): Promise<void> {
        try {
            if (!db || !db.type) return;
            const docRef = doc(db, 'profiles', uid);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                const data = snap.data() as UserProfile;
                const newTotalRaces = (data.total_races || 0) + 1;
                const newHighest = Math.max(data.highest_wpm || 0, wpm);

                const oldTotalWpm = (data.avg_wpm || 0) * (data.total_races || 0);
                const newAvg = Math.round((oldTotalWpm + wpm) / newTotalRaces);

                await setDoc(docRef, {
                    ...data,
                    total_races: newTotalRaces,
                    highest_wpm: newHighest,
                    avg_wpm: newAvg,
                    rank_points: (newHighest * 10) + newTotalRaces
                }, { merge: true });
            }
        } catch (error) {
            console.error("Failed to update stats:", error);
        }
    },

    async updateProgress(uid: string, unlocked: string[], completed: string[]): Promise<void> {
        try {
            if (!db || !db.type) return;
            const docRef = doc(db, 'profiles', uid);
            await setDoc(docRef, {
                unlocked_lessons: unlocked,
                completed_lessons: completed
            }, { merge: true });
        } catch (error) {
            console.error("Failed to update progress:", error);
        }
    },

    async checkUsernameTaken(username: string): Promise<boolean> {
        if (!db || !db.type) return false;
        try {
            const docRef = doc(db, 'usernames', username.toLowerCase());
            const snap = await getDoc(docRef);
            return snap.exists();
        } catch (e) {
            console.warn("[UserService] Error checking username taken:", e);
            // If it's a timeout error from withTimeout wrapper, it will throw.
            // If it's a firestore error, we treat it as not taken but log it.
            return false;
        }
    },
};
