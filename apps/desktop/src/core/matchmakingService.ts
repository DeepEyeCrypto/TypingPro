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
    orderBy,
    setDoc
} from 'firebase/firestore';
import { CURRICULUM } from '../data/lessons';

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
    private get queueRef() {
        if (!db) throw new Error("Database not initialized");
        return collection(db, 'matchmaking_queue');
    }

    private get matchesRef() {
        if (!db) throw new Error("Database not initialized");
        return collection(db, 'active_duels');
    }

    private unsubscribeMatch: (() => void) | null = null;

    /**
     * Join the matchmaking queue
     */
    async joinQueue(username: string, avatarUrl: string, wpmAverage: number): Promise<string> {
        if (!auth.currentUser) throw new Error("Must be logged in");

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
    }

    /**
     * Client-side matching logic:
     * Try to find another user in queue and create a match doc.
     */
    async findAndCreateMatch(myUsername: string, myAvatar: string): Promise<string | null> {
        if (!auth.currentUser) return null;

        // 1. Get everyone in the queue (limited to avoid huge fetches)
        const q = query(this.queueRef, orderBy("timestamp", "asc"), limit(2));
        const snapshot = await getDocs(q);

        if (snapshot.docs.length >= 2) {
            const docs = snapshot.docs;
            const meDoc = docs.find(d => d.data().uid === auth.currentUser?.uid);
            const otherDoc = docs.find(d => d.data().uid !== auth.currentUser?.uid);

            if (meDoc && otherDoc) {
                // I'm one of the first two! Host strategy.
                const other = otherDoc.data() as MatchmakingRequest;

                // Pick a random lesson text (prefer Pro/Speed lessons)
                const suitableLessons = CURRICULUM.filter(l => l.text.length > 100);
                const randomLesson = suitableLessons[Math.floor(Math.random() * suitableLessons.length)];

                const duelId = `match_${Date.now()}_${auth.currentUser.uid}`;
                const matchData = {
                    id: duelId,
                    challenger: auth.currentUser.uid,
                    opponent: other.uid,
                    challengerName: myUsername,
                    opponentName: other.username,
                    challengerAvatar: myAvatar,
                    opponentAvatar: other.avatarUrl,
                    status: 'in_progress', // Matchmade duels start immediately
                    type: 'matchmade',
                    text: randomLesson.text,
                    timestamp: serverTimestamp(),
                    players: [auth.currentUser.uid, other.uid] // For easy querying
                };

                await setDoc(doc(db, 'active_duels', duelId), matchData);

                // Cleanup queue
                await deleteDoc(meDoc.ref);
                await deleteDoc(otherDoc.ref);

                return duelId;
            }
        }
        return null;
    }

    /**
     * Listen for a match assignment
     */
    listenForMatch(onMatchFound: (matchId: string) => void) {
        if (!auth.currentUser) return;

        // Listen for active_duels where I am a player
        const q = query(
            collection(db, 'active_duels'),
            where("players", "array-contains", auth.currentUser.uid),
            where("status", "==", "in_progress"),
            orderBy("timestamp", "desc"),
            limit(1)
        );

        this.unsubscribeMatch = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
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
