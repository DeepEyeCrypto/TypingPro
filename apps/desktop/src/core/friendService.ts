import { db, auth } from '../lib/firebase';
import { CURRICULUM } from '../data/lessons';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    setDoc,
    doc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    getDoc,
    orderBy,
    limit
} from 'firebase/firestore';
import { UserProfile } from './userService';

export interface FriendRequest {
    id: string;
    fromUid: string;
    fromUsername: string;
    fromAvatar: string;
    toUid: string;
    status: 'pending' | 'accepted' | 'rejected';
    timestamp: number;
}

export const friendService = {
    // Search users by username (exact or prefix if using Algolia, but simple Firestore for now)
    async searchUsers(searchQuery: string): Promise<UserProfile[]> {
        if (searchQuery.length < 3) return [];
        const lowerQuery = searchQuery.toLowerCase();

        // Simple Firestore prefix search (requires username_lowercase field)
        const q = query(
            collection(db, 'profiles'),
            where('username_lowercase', '>=', lowerQuery),
            where('username_lowercase', '<=', lowerQuery + '\uf8ff'),
            limit(5)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as UserProfile);
    },

    async sendFriendRequest(fromUser: UserProfile, toUid: string): Promise<string> {
        // Check if already friends or request pending
        // For simplicity, we create a composite ID or let Firestore generate
        const requestId = `${fromUser.uid}_${toUid}`;
        const requestRef = doc(db, 'friend_requests', requestId);

        const existing = await getDoc(requestRef);
        if (existing.exists()) {
            return 'Request already exists';
        }

        const request: FriendRequest = {
            id: requestId,
            fromUid: fromUser.uid,
            fromUsername: fromUser.username,
            fromAvatar: fromUser.avatar_url,
            toUid: toUid,
            status: 'pending',
            timestamp: Date.now()
        };

        await setDoc(requestRef, request);
        return 'success';
    },

    async acceptFriendRequest(requestId: string): Promise<void> {
        const reqRef = doc(db, 'friend_requests', requestId);
        const reqSnap = await getDoc(reqRef);

        if (!reqSnap.exists()) return;
        const data = reqSnap.data() as FriendRequest;

        // Add to both users' friend subcollections
        const friend1Ref = doc(db, `profiles/${data.fromUid}/friends/${data.toUid}`);
        const friend2Ref = doc(db, `profiles/${data.toUid}/friends/${data.fromUid}`);

        await setDoc(friend1Ref, { uid: data.toUid, since: Date.now() });
        await setDoc(friend2Ref, { uid: data.fromUid, since: Date.now() });

        // Delete request
        await deleteDoc(reqRef);
    },

    async rejectFriendRequest(requestId: string): Promise<void> {
        await deleteDoc(doc(db, 'friend_requests', requestId));
    },

    async getIncomingRequests(myUid: string): Promise<FriendRequest[]> {
        const q = query(
            collection(db, 'friend_requests'),
            where('toUid', '==', myUid),
            where('status', '==', 'pending')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as FriendRequest);
    },

    async getFriends(myUid: string): Promise<UserProfile[]> {
        // Get IDs from subcollection
        const friendsSnap = await getDocs(collection(db, `profiles/${myUid}/friends`));
        const friendIds = friendsSnap.docs.map(d => d.id);

        if (friendIds.length === 0) return [];

        // Fetch actual profiles (Firestore 'in' query supports max 10, need batching for production)
        const promises = friendIds.map(fid => getDoc(doc(db, 'profiles', fid)));
        const docs = await Promise.all(promises);

        return docs
            .filter(d => d.exists())
            .map(d => d.data() as UserProfile);
    },

    // --- PHASE 4: DUELS & MATCHMAKING ---

    async createDuelChallenge(fromUid: string, toUid: string): Promise<string> {
        // Pick random text
        const suitableLessons = CURRICULUM.filter(l => l.text.length > 100);
        const randomLesson = suitableLessons[Math.floor(Math.random() * suitableLessons.length)];

        // Get names/avatars for the duel doc (optimization)
        let fromName = 'Typist';
        let fromAvatar = '';
        let toName = 'Opponent';
        let toAvatar = '';

        try {
            const [fromSnap, toSnap] = await Promise.all([
                getDoc(doc(db, 'profiles', fromUid)),
                getDoc(doc(db, 'profiles', toUid))
            ]);
            if (fromSnap.exists()) {
                fromName = fromSnap.data().username;
                fromAvatar = fromSnap.data().avatar_url;
            }
            if (toSnap.exists()) {
                toName = toSnap.data().username;
                toAvatar = toSnap.data().avatar_url;
            }
        } catch (e) {
            console.error("Error fetching profiles for duel:", e);
        }

        const duelId = `direct_${Date.now()}_${fromUid}`;
        const duelRef = doc(db, 'active_duels', duelId);

        await setDoc(duelRef, {
            id: duelId,
            challenger: fromUid,
            opponent: toUid,
            challengerName: fromName,
            challengerAvatar: fromAvatar,
            opponentName: toName,
            opponentAvatar: toAvatar,
            status: 'pending',
            type: 'direct',
            text: randomLesson.text,
            timestamp: serverTimestamp(),
            players: [fromUid, toUid],
            challengerProgress: 0,
            opponentProgress: 0,
            challengerWPM: 0,
            opponentWPM: 0
        });

        return duelId;
    },

    async updateDuelProgress(duelId: string, role: 'challenger' | 'opponent', progress: number, wpm: number): Promise<void> {
        const duelRef = doc(db, 'active_duels', duelId);
        const updateKey = role === 'challenger' ? 'challengerProgress' : 'opponentProgress';
        const wpmKey = role === 'challenger' ? 'challengerWPM' : 'opponentWPM';

        await updateDoc(duelRef, {
            [updateKey]: progress,
            [wpmKey]: wpm,
            lastUpdate: Date.now()
        });
    },

    async acceptDuel(duelId: string): Promise<void> {
        const duelRef = doc(db, 'active_duels', duelId);
        await updateDoc(duelRef, {
            status: 'in_progress',
            startTime: Date.now()
        });
    },

    async rejectDuel(duelId: string): Promise<void> {
        const duelRef = doc(db, 'active_duels', duelId);
        await updateDoc(duelRef, {
            status: 'rejected'
        });
    },

    async finalizeDuel(duelId: string, winnerUid: string, loserUid: string): Promise<void> {
        const duelRef = doc(db, 'active_duels', duelId);
        await updateDoc(duelRef, {
            status: 'finished',
            winnerUid,
            loserUid,
            endTime: Date.now()
        });

        // Update stats for both
        import('./userService').then(({ userService }) => {
            userService.getProfile(winnerUid).then(p => {
                if (p) {
                    const current = p.duel_stats || { wins: 0, losses: 0 };
                    userService.updateAchievements(winnerUid, { duel_stats: { ...current, wins: current.wins + 1 } });
                }
            });
            userService.getProfile(loserUid).then(p => {
                if (p) {
                    const current = p.duel_stats || { wins: 0, losses: 0 };
                    userService.updateAchievements(loserUid, { duel_stats: { ...current, losses: current.losses + 1 } });
                }
            });
        });
    },

    listenToIncomingRequests(myUid: string, callback: (requests: FriendRequest[]) => void) {
        const q = query(
            collection(db, 'friend_requests'),
            where('toUid', '==', myUid),
            where('status', '==', 'pending')
        );
        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => doc.data() as FriendRequest);
            callback(requests);
        });
    },

    listenToIncomingDuels(myUid: string, callback: (duels: any[]) => void) {
        const q = query(
            collection(db, 'active_duels'),
            where('opponent', '==', myUid),
            where('status', '==', 'pending'),
            limit(1)
        );
        return onSnapshot(q, (snapshot) => {
            const duels = snapshot.docs.map(doc => doc.data());
            callback(duels);
        });
    },

    listenToFriendsPresence(myUid: string, callback: (friends: UserProfile[]) => void) {
        // First get the friend IDs from the subcollection
        const q = query(collection(db, `profiles/${myUid}/friends`));

        return onSnapshot(q, (snap) => {
            const friendIds = snap.docs.map(d => d.id);
            if (friendIds.length === 0) {
                callback([]);
                return;
            }

            // Sub-query for profiles (handling 'in' limit)
            const profileQ = query(
                collection(db, 'profiles'),
                where('uid', 'in', friendIds.slice(0, 30))
            );

            return onSnapshot(profileQ, (pSnap) => {
                const profiles = pSnap.docs.map(d => d.data() as UserProfile);
                callback(profiles);
            });
        });
    }
};
