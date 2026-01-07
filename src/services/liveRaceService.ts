import { rtdb, auth } from '../lib/firebase';
import { ref, set, onValue, update, serverTimestamp, push, child, get, DatabaseReference } from 'firebase/database';

export interface RaceState {
    status: 'waiting' | 'starting' | 'in_progress' | 'finished';
    lessonId: string;
    startTime: number | null;
    players: Record<string, PlayerState>;
}

export interface PlayerState {
    progress: number;
    wpm: number;
    cursorIndex: number;
    isFinished: boolean;
    username: string;
    avatarUrl: string;
}

class LiveRaceService {
    private currentMatchId: string | null = null;
    private raceRef: DatabaseReference | null = null;
    private unsubscribe: (() => void) | null = null;

    /**
     * Initialize a race room
     */
    async createRace(matchId: string, lessonId: string, player1: PlayerState, player2: PlayerState) {
        const raceData: RaceState = {
            status: 'waiting',
            lessonId,
            startTime: null,
            players: {
                [auth.currentUser!.uid]: player1, // assuming creator is P1, but keys should be UIDs
                // We need to know P2's UID here. 
                // This logic needs to be tightly coupled with Matchmaking.
            }
        };

        // Actually, better pattern:
        // just set the initial state.

        await set(ref(rtdb, `races/${matchId}`), {
            status: 'waiting',
            lessonId,
            players: {} // Players join explicitly?
        });
    }

    /**
     * Join a race and subscribe to updates
     */
    joinRace(matchId: string, callbacks: {
        onStateChange: (state: RaceState) => void,
        onFinish: (winnerId: string) => void
    }) {
        if (!auth.currentUser) return;
        this.currentMatchId = matchId;
        this.raceRef = ref(rtdb, `races/${matchId}`);

        // Set initial player state
        const playerRef = child(this.raceRef, `players/${auth.currentUser.uid}`);
        update(playerRef, {
            progress: 0,
            wpm: 0,
            cursorIndex: 0,
            isFinished: false,
            // username/avatar assumed present or added earlier
        });

        // Listen for changes
        this.unsubscribe = onValue(this.raceRef, (snapshot) => {
            const data = snapshot.val() as RaceState;
            if (data) {
                callbacks.onStateChange(data);

                // Check win condition locally or rely on server status
                // If status is 'finished', trigger onFinish
            }
        });

        console.log(`RACE: Joined ${matchId}`);
    }

    /**
     * Send real-time updates (Debounce this in UI layer!)
     */
    updateProgress(wpm: number, cursorIndex: number, progress: number, isFinished: boolean) {
        if (!this.currentMatchId || !auth.currentUser) return;

        const updates: any = {};
        const path = `races/${this.currentMatchId}/players/${auth.currentUser.uid}`;

        updates[`${path}/wpm`] = wpm;
        updates[`${path}/cursorIndex`] = cursorIndex;
        updates[`${path}/progress`] = progress;

        if (isFinished) {
            updates[`${path}/isFinished`] = true;
            // potential race condition on who finished first if we don't have server timestamps
            // acceptable for MVP
        }

        update(ref(rtdb), updates);
    }

    leaveRace() {
        if (this.unsubscribe) {
            this.unsubscribe(); // This returns void, onValue defines return as unsubscribe fn
        }
        this.currentMatchId = null;
        this.raceRef = null;
    }
}

export const liveRaceService = new LiveRaceService();
