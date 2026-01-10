import { db } from '@src/lib/firebase';
import {
    collection, doc, getDoc, getDocs, setDoc, updateDoc,
    query, where, serverTimestamp, deleteDoc, limit
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
        const duelId = `${Date.now()}_${fromUid}`;
        const duelRef = doc(db, 'active_duels', duelId);

        await setDoc(duelRef, {
            id: duelId,
            challenger: fromUid,
            opponent: toUid,
            status: 'pending',
            timestamp: serverTimestamp()
        });

        return duelId;
    },

    async updateDuelProgress(duelId: string, uid: string, progress: number, wpm: number): Promise<void> {
        const duelRef = doc(db, 'active_duels', duelId);
        const updateKey = uid === 'challenger' ? 'challengerProgress' : 'opponentProgress';
        const wpmKey = uid === 'challenger' ? 'challengerWPM' : 'opponentWPM';

        await updateDoc(duelRef, {
            [updateKey]: progress,
            [wpmKey]: wpm,
            lastUpdate: Date.now()
        });
    }
};
