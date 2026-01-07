import { db, auth } from '../lib/firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    serverTimestamp,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy
} from 'firebase/firestore';

export interface MatchmakingRequest {
    uid: string;
    username: string;
    avatarUrl: string;
    wpmAverage: number;
    timestamp: any;
}

export interface Match {
    id: string;
    player1: { uid: string, username: string, avatarUrl: string };
    player2: { uid: string, username: string, avatarUrl: string };
    status: 'waiting' | 'in_progress' | 'finished';
    lessonId: string;
    timestamp: number;
}

class MatchmakingService {
    private queueRef = collection(db, 'matchmaking_queue');
    private matchesRef = collection(db, 'matches');
    private unsubscribeQueue: (() => void) | null = null;
    private unsubscribeMatch: (() => void) | null = null;

    /**
     * Join the matchmaking queue
     */
    async joinQueue(username: string, avatarUrl: string, wpmAverage: number): Promise<string> {
        if (!auth.currentUser) throw new Error("Must be logged in");

        // Remove any existing queue entries for this user
        await this.leaveQueue();

        const request: MatchmakingRequest = {
            uid: auth.currentUser.uid,
            username,
            avatarUrl,
            wpmAverage,
            timestamp: serverTimestamp()
        };

        const docRef = await addDoc(this.queueRef, request);
        console.log("MATCHMAKING: Joined queue", docRef.id);
        return docRef.id;
    }

    /**
     * Leave the matchmaking queue
     */
    async leaveQueue() {
        if (!auth.currentUser) return;

        const q = query(this.queueRef, where("uid", "==", auth.currentUser.uid));
        const snapshot = await getDocs(q);

        const promises = snapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(promises);
        console.log("MATCHMAKING: Left queue");
    }

    /**
     * Listen for a match assignment
     */
    listenForMatch(onMatchFound: (matchId: string) => void) {
        if (!auth.currentUser) return;

        // Listen for matches where user is player1 or player2
        // Note: Firestore OR queries can be tricky, might need two listeners or a unified 'players' array field
        // For MVP, we'll try a simple query for now.

        // Strategy: The backend function usually creates the match. 
        // Since we don't have Cloud Functions, we use a Client-Side "Host" strategy?
        // OR: We use the simpler "First in queue gets picked" logic client-side.

        // simpler client-side logic:
        // 1. Join Queue.
        // 2. Watch Queue. If I see someone else, I match with them.
        // 3. Create Match doc.
        // 4. Delete both from queue.

        // This is complex without a trusted server. 
        // For simplicity in this demo, we'll assume a "Host" creates the match.
        // Let's listen to the `matches` collection where we are listed.

        const q1 = query(this.matchesRef, where("player1.uid", "==", auth.currentUser.uid), where("status", "==", "waiting"));
        const q2 = query(this.matchesRef, where("player2.uid", "==", auth.currentUser.uid), where("status", "==", "waiting"));

        // merging listeners is messy. let's just allow users to query regularly.
        // actually onSnapshot is best.

        this.unsubscribeMatch = onSnapshot(query(this.matchesRef,
            where("players", "array-contains", auth.currentUser.uid),
            orderBy("timestamp", "desc"),
            limit(1)
        ), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("MATCHMAKING: Match found!", change.doc.id);
                    onMatchFound(change.doc.id);
                }
            });
        });
    }

    stopListening() {
        if (this.unsubscribeMatch) {
            this.unsubscribeMatch();
            this.unsubscribeMatch = null;
        }
    }
}

export const matchmakingService = new MatchmakingService();
