/**
 * AI COACHING ENGINE - WEAKNESS ANALYZER
 * Tracks keystroke latency and error patterns to identify weak keys
 */

import { storeService } from './tauriStore'
import { SessionResult } from './store/statsStore'

export interface KeyLatency {
    key: string
    avgLatency: number // Average time to press (ms)
    errorRate: number // % of mistakes (0-100)
    lastSeen: number // Timestamp
    frequency: number // How often typed
    totalPresses: number
    totalErrors: number
}

export interface WeaknessProfile {
    keyData: Record<string, KeyLatency>
    slowKeys: KeyLatency[] // >200ms average
    errorProneKeys: KeyLatency[] // >10% error rate
    lastAnalyzed: number
    sessionsAnalyzed: number
    totalKeysTracked: number
}

export class WeaknessAnalyzer {
    private static SLOW_THRESHOLD_MS = 200
    private static ERROR_RATE_THRESHOLD = 10 // 10%
    private static MAX_SESSIONS_TO_ANALYZE = 10

    /**
     * Analyze the last N sessions and build a weakness profile
     */
    static async analyzeWeaknesses(sessions: SessionResult[]): Promise<WeaknessProfile> {
        // Get the most recent sessions
        const recentSessions = sessions.slice(0, this.MAX_SESSIONS_TO_ANALYZE)

        const keyData: Record<string, KeyLatency> = {}

        // Analyze each session
        for (const session of recentSessions) {
            if (!session.graphData || !session.replayData) continue

            const { replayData } = session

            // Calculate latency for each keystroke
            for (let i = 1; i < replayData.charAndTime.length; i++) {
                const currentChar = replayData.charAndTime[i].char
                const currentTime = replayData.charAndTime[i].time
                const prevTime = replayData.charAndTime[i - 1].time
                const latency = currentTime - prevTime

                // Initialize key data if not exists
                if (!keyData[currentChar]) {
                    keyData[currentChar] = {
                        key: currentChar,
                        avgLatency: 0,
                        errorRate: 0,
                        lastSeen: Date.now(),
                        frequency: 0,
                        totalPresses: 0,
                        totalErrors: 0
                    }
                }

                const data = keyData[currentChar]
                data.totalPresses++
                data.frequency++
                data.lastSeen = session.timestamp

                // Calculate running average latency
                data.avgLatency = ((data.avgLatency * (data.totalPresses - 1)) + latency) / data.totalPresses
            }
        }

        // Incorporate error data from character errors
        for (const session of recentSessions) {
            // Assume we can derive errors from accuracy and graphData
            // For now, use a simplified error tracking
            // TODO: Enhance with actual keystroke-level error tracking
        }

        // Calculate error rates
        Object.values(keyData).forEach(data => {
            if (data.totalPresses > 0) {
                data.errorRate = (data.totalErrors / data.totalPresses) * 100
            }
        })

        // Identify slow and error-prone keys
        const allKeys = Object.values(keyData)
        const slowKeys = allKeys
            .filter(k => k.avgLatency > this.SLOW_THRESHOLD_MS)
            .sort((a, b) => b.avgLatency - a.avgLatency)
            .slice(0, 10)

        const errorProneKeys = allKeys
            .filter(k => k.errorRate > this.ERROR_RATE_THRESHOLD)
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 10)

        const profile: WeaknessProfile = {
            keyData,
            slowKeys,
            errorProneKeys,
            lastAnalyzed: Date.now(),
            sessionsAnalyzed: recentSessions.length,
            totalKeysTracked: Object.keys(keyData).length
        }

        // Save to Tauri Store
        await this.saveProfile(profile)

        return profile
    }

    /**
     * Get critical keys (combination of slow + error-prone)
     */
    static getCriticalKeys(profile: WeaknessProfile): string[] {
        const criticalSet = new Set<string>()

        // Add top 5 slow keys
        profile.slowKeys.slice(0, 5).forEach(k => criticalSet.add(k.key))

        // Add top 5 error-prone keys
        profile.errorProneKeys.slice(0, 5).forEach(k => criticalSet.add(k.key))

        return Array.from(criticalSet)
    }

    /**
     * Save weakness profile to Tauri Store
     */
    static async saveProfile(profile: WeaknessProfile): Promise<void> {
        await storeService.set('weakness_profile', profile)
    }

    /**
     * Load weakness profile from Tauri Store
     */
    static async loadProfile(): Promise<WeaknessProfile | null> {
        return await storeService.get<WeaknessProfile>('weakness_profile')
    }

    /**
     * Analyze a single session and update the profile incrementally
     */
    static async updateProfileWithSession(session: SessionResult): Promise<void> {
        let profile = await this.loadProfile()

        if (!profile) {
            profile = {
                keyData: {},
                slowKeys: [],
                errorProneKeys: [],
                lastAnalyzed: Date.now(),
                sessionsAnalyzed: 0,
                totalKeysTracked: 0
            }
        }

        // Update key data with new session
        if (session.replayData) {
            const { replayData } = session

            for (let i = 1; i < replayData.charAndTime.length; i++) {
                const currentChar = replayData.charAndTime[i].char
                const currentTime = replayData.charAndTime[i].time
                const prevTime = replayData.charAndTime[i - 1].time
                const latency = currentTime - prevTime

                if (!profile.keyData[currentChar]) {
                    profile.keyData[currentChar] = {
                        key: currentChar,
                        avgLatency: latency,
                        errorRate: 0,
                        lastSeen: Date.now(),
                        frequency: 1,
                        totalPresses: 1,
                        totalErrors: 0
                    }
                } else {
                    const data = profile.keyData[currentChar]
                    data.totalPresses++
                    data.frequency++
                    data.avgLatency = ((data.avgLatency * (data.totalPresses - 1)) + latency) / data.totalPresses
                    data.lastSeen = Date.now()
                }
            }
        }

        profile.sessionsAnalyzed++
        profile.lastAnalyzed = Date.now()
        profile.totalKeysTracked = Object.keys(profile.keyData).length

        // Recalculate slow and error-prone keys
        const allKeys = Object.values(profile.keyData)
        profile.slowKeys = allKeys
            .filter(k => k.avgLatency > this.SLOW_THRESHOLD_MS)
            .sort((a, b) => b.avgLatency - a.avgLatency)
            .slice(0, 10)

        profile.errorProneKeys = allKeys
            .filter(k => k.errorRate > this.ERROR_RATE_THRESHOLD)
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 10)

        await this.saveProfile(profile)
    }

    /**
     * Get a summary of weaknesses for display
     */
    static getWeaknessSummary(profile: WeaknessProfile): string {
        const slowKeysList = profile.slowKeys.slice(0, 5).map(k =>
            `${k.key} (${Math.round(k.avgLatency)}ms)`
        ).join(', ')

        const errorKeysList = profile.errorProneKeys.slice(0, 5).map(k =>
            `${k.key} (${k.errorRate.toFixed(1)}%)`
        ).join(', ')

        return `Slow Keys: ${slowKeysList || 'None'}\nError-Prone: ${errorKeysList || 'None'}`
    }
}
