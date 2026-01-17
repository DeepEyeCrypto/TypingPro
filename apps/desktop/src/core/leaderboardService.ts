import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { UserProfile } from './userService';

export const leaderboardService = {
    // Subscribe to top 100 players by WPM
    subscribeToGlobalRankings(callback: (profiles: UserProfile[]) => void): () => void {
        const q = query(
            collection(db, 'profiles'),
            orderBy('highest_wpm', 'desc'),
            limit(50)
        );

        return onSnapshot(q, (snapshot) => {
            const profiles = snapshot.docs.map(doc => doc.data() as UserProfile);
            callback(profiles);
        });
    }
};
