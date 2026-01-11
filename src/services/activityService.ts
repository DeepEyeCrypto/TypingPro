import { db } from '../lib/firebase';
import {
    collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp
} from 'firebase/firestore';

export interface GlobalEvent {
    id?: string;
    type: 'certification' | 'streak' | 'record' | 'badge';
    userId: string;
    username: string;
    avatarUrl: string;
    data: any; // e.g. { tier: 'Gold' } or { speed: 120 }
    timestamp?: any;
}

export const activityService = {
    /**
     * Report an event to the global community
     */
    async reportEvent(event: GlobalEvent): Promise<void> {
        if (!db) return;
        try {
            await addDoc(collection(db, 'global_activity'), {
                ...event,
                timestamp: serverTimestamp()
            });
        } catch (e) {
            console.error('Failed to report global event:', e);
        }
    },

    /**
     * Listen to the last 50 global events
     */
    listenToGlobalEvents(callback: (events: GlobalEvent[]) => void) {
        if (!db) return () => { };

        const q = query(
            collection(db, 'global_activity'),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        return onSnapshot(q, (snapshot) => {
            const events = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as GlobalEvent));
            callback(events);
        });
    }
};
