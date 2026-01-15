import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { startSession, handleKeystroke, TypingMetrics } from '@src/lib/tauri'
import { CURRICULUM, Lesson } from '@src/data/lessons'
import { useStatsStore } from '@src/stores/statsStore'
import { WeaknessAnalyzer } from '@src/services/weaknessAnalyzer'

import { syncService } from '@src/services/syncService'
import { useRustAudio } from '@src/hooks/useRustAudio'

import { raceService } from '@src/services/raceService'
import { liveRaceService } from '@src/services/liveRaceService';
import { useAuthStore } from '@src/stores/authStore'
import { useAchievementStore } from '@src/stores/achievementStore'
import { checkBadgeEligibility } from '@src/services/badgeService'
import { updateStreak } from '@src/services/streakService'
import { userService } from '@src/services/userService'
import { generateDailyChallenges, updateChallengeProgress } from '@src/services/challengeService'
import { activityService } from '@src/services/activityService'
import { useMissionStore } from '@src/stores/missionStore'
import { usePresenceStore } from '@src/stores/presenceStore'

export const useTyping = () => {
    const { playTypingSound } = useRustAudio()
    const { user } = useAuthStore() // Get user to attach to race
    const [view, setView] = useState<'selection' | 'typing' | 'analytics' | 'social' | 'lobby' | 'duel' | 'dashboard' | 'store' | 'achievements' | 'certification' | 'settings'>('selection')
    const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [challengerGhost, setChallengerGhost] = useState<{ charAndTime: { char: string, time: number }[] } | undefined>(undefined)

    const [metrics, setMetrics] = useState<TypingMetrics>({
        raw_wpm: 0,
        adjusted_wpm: 0,
        accuracy: 100,
        consistency: 100,
        is_bot: false,
        cheat_flags: ''
    })
    const [input, setInput] = useState('')
    const [startTime, setStartTime] = useState<number>(0)
    const [totalKeystrokes, setTotalKeystrokes] = useState(0)
    const [finalStats, setFinalStats] = useState({
        netWpm: 0,
        errorCount: 0,
        timeTaken: 0,
        rawWpm: 0,
        consistency: 0,
        totalKeystrokes: 0
    })
    const [errors, setErrors] = useState<Record<string, number>>({})
    const [showResult, setShowResult] = useState(false)
    const { unlockedIds, completedIds, setProgress, recordAttempt } = useStatsStore()
    const {
        unlockedBadges,
        streak: localStreak,
        unlockBadge,
        updateStreak: setLocalStreak,
        addKeystones,
        totalKeystrokes: totalCumulativeKeystrokes,
        perfectSessions,
        challengeProgress,
        incrementStats,
        updateChallengeProgress: setChallengeProgress,
        addNotification
    } = useAchievementStore()

    // MISSION STATE
    const [missionData, setMissionData] = useState<{
        isMission: boolean,
        targetWpm: number,
        minAccuracy: number,
    }>({
        isMission: false,
        targetWpm: 0,
        minAccuracy: 0,
    })

    // ... (Initialization effects same as before) ...



    const activeChar = useMemo(() => {
        if (!currentLesson) return ''
        return currentLesson.text[input.length] || ''
    }, [input, currentLesson])

    // Mission Store Integration
    const mission = useMissionStore()

    // State for Idle Timer & Graph
    const [isPaused, setIsPaused] = useState(false)
    const [totalPausedTime, setTotalPausedTime] = useState(0)
    const [lastPauseStart, setLastPauseStart] = useState<number | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const graphDataRef = useRef<{ time: number, wpm: number, raw: number }[]>([])
    const metricsRef = useRef(metrics)
    const lastSyncTimeRef = useRef<number>(0) // ⚡️ Throttling Ref

    // Sync metricsRef
    useEffect(() => { metricsRef.current = metrics }, [metrics])

    // 📡 PRESENCE: Broadcast WPM when typing
    useEffect(() => {
        const { status, setWpm } = usePresenceStore.getState()
        if (status === 'TYPING' && metrics.raw_wpm > 0) {
            setWpm(Math.round(metrics.raw_wpm))
        }
    }, [metrics.raw_wpm])

    // Reset status to LOBBY when test ends or unmounts
    useEffect(() => {
        return () => {
            usePresenceStore.getState().setStatus('LOBBY')
        }
    }, [])

    // Clear timer
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const startIdleTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setIsPaused(true)
            setLastPauseStart(Date.now())
        }, 2000)
    }, [])

    const resumeTimer = useCallback(() => {
        if (isPaused && lastPauseStart) {
            const pausedDuration = Date.now() - lastPauseStart
            setTotalPausedTime(prev => prev + pausedDuration)
            setIsPaused(false)
            setLastPauseStart(null)
        }
        startIdleTimer()
    }, [isPaused, lastPauseStart, startIdleTimer])

    // Graph Sampling
    useEffect(() => {
        let interval: NodeJS.Timeout
        // CRITICAL FIX: Stop sampling if result is showing to prevent infinite timer
        if (view === 'typing' && !isPaused && startTime > 0 && !showResult) {
            interval = setInterval(() => {
                const elapsed = (Date.now() - startTime - totalPausedTime) / 1000
                if (elapsed > 0) {
                    graphDataRef.current.push({
                        time: Math.round(elapsed),
                        wpm: Math.round(metricsRef.current.adjusted_wpm),
                        raw: Math.round(metricsRef.current.raw_wpm)
                    })
                }
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [view, isPaused, startTime, totalPausedTime, showResult])

    // Ghost Replay Logic
    const currentReplayRef = useRef<{ char: string, time: number }[]>([])

    // Preference: Challenger > Local Best
    const bestReplays = useStatsStore((s: any) => s.bestReplays)
    const ghostReplay = useMemo(() => {
        if (!currentLesson) return undefined
        if (challengerGhost) return challengerGhost

        const data = bestReplays[currentLesson.id]
        if (!data) return undefined
        return data
    }, [currentLesson, bestReplays, challengerGhost])

    const startLesson = async (lesson: Lesson, ghostData?: { charAndTime: { char: string, time: number }[] }) => {
        usePresenceStore.getState().setStatus('TYPING')
        setCurrentLesson(lesson)
        setChallengerGhost(ghostData) // Set challenger if provided
        setInput('')
        setErrors({})
        setMetrics({ raw_wpm: 0, adjusted_wpm: 0, accuracy: 100, consistency: 100, is_bot: false, cheat_flags: '' })
        setStartTime(Date.now())
        setTotalKeystrokes(0)
        setFinalStats({ netWpm: 0, errorCount: 0, timeTaken: 0, rawWpm: 0, consistency: 0, totalKeystrokes: 0 })

        setIsPaused(false)
        setTotalPausedTime(0)
        setLastPauseStart(null)
        graphDataRef.current = []
        currentReplayRef.current = []

        await startSession(lesson.text)
        setView('typing')
        setShowResult(false)
        startIdleTimer()
    }

    const startMission = async (lesson: Lesson, targetWpm: number, minAccuracy: number, constraints: string[]) => {
        mission.setBriefing({ lesson, targetWpm, minAccuracy, constraints })
        // The UI will handle the transition to OPERATIONAL via mission.startMission()
    }

    const deployMission = async () => {
        if (mission.state !== 'BRIEFING' || !mission.data.lesson) return
        mission.startMission()
        await startLesson(mission.data.lesson)
    }

    const retryLesson = async () => {
        if (currentLesson) {
            await startLesson(currentLesson)
        }
    }

    const handleResult = useCallback(async () => {
        if (!currentLesson) return
        if (timerRef.current) clearTimeout(timerRef.current)

        const endTime = Date.now()
        // Deduct paused time from total duration
        const activeDuration = Math.max(0, endTime - startTime - totalPausedTime)
        const timeTaken = activeDuration / 1000 // Seconds
        const totalErrors = (Object.values(errors) as number[]).reduce((a: number, b: number) => a + b, 0)

        // Formulas
        const calculatedRawWpm = timeTaken > 0 ? ((totalKeystrokes / 5) / (timeTaken / 60)) : 0
        const netWpm = timeTaken > 0 ? Math.max(0, ((totalKeystrokes - totalErrors) / 5) / (timeTaken / 60)) : 0

        setFinalStats({
            rawWpm: Math.round(calculatedRawWpm),
            netWpm: Math.round(netWpm),
            errorCount: totalErrors,
            consistency: Math.round(metrics.consistency),
            timeTaken: timeTaken,
            totalKeystrokes: totalKeystrokes
        })

        // Record stats including errors, graph data, and REPLAY data
        const replayData = { charAndTime: currentReplayRef.current }
        const sessionResult = {
            id: `${currentLesson.id}-${Date.now()}`,
            lessonId: currentLesson.id,
            wpm: metrics.raw_wpm,
            accuracy: metrics.accuracy,
            timestamp: Date.now(),
            errors,
            graphData: graphDataRef.current,
            replayData
        }
        recordAttempt(currentLesson.id, metrics.raw_wpm, metrics.accuracy, errors, graphDataRef.current, replayData)

        // 🧠 AI COACHING: Update weakness profile with this session
        WeaknessAnalyzer.updateProfileWithSession(sessionResult).catch(err =>
            console.error('Failed to update weakness profile:', err)
        )

        // 🔥 Save Race to Cloud (if logged in and speed > 10 wpm)
        const currentUser = useAuthStore.getState().user;
        if (currentUser && metrics.raw_wpm > 10) {
            // 1. Save Replay
            raceService.saveRace({
                id: `${currentUser.id}_${Date.now()}`,
                uid: currentUser.id || 'unknown',
                username: currentUser.name || 'Anonymous',
                wpm: Math.round(netWpm),
                accuracy: Math.round(metrics.accuracy),
                timestamp: Date.now(),
                replay: currentReplayRef.current,
                lessonId: currentLesson.id
            }).catch(e => console.error("Failed to save race", e))

            // 2. Update Profile Stats (Leaderboard Sync)
            // Import userService dynamically to avoid circular deps if any, 
            // or just ensure import is at top. Assuming top import available.
            import('@src/services/userService').then(({ userService }) => {
                userService.updateStats(currentUser.id, Math.round(netWpm), Math.round(metrics.accuracy))
            }).catch(console.error)
        }

        // 🏆 Achievements: Update Streak & Stats
        const nextStreak = updateStreak(localStreak);

        if (nextStreak.current_streak !== localStreak.current_streak) {
            setLocalStreak(nextStreak);

            // Global Report: Streak Milestone
            if (currentUser && nextStreak.current_streak > 0 && nextStreak.current_streak % 7 === 0) {
                activityService.reportEvent({
                    type: 'streak',
                    userId: currentUser.id,
                    username: currentUser.name || 'Typist',
                    avatarUrl: currentUser.avatar_url || '',
                    data: { days: nextStreak.current_streak }
                });
            }
        }

        const isPerfect = metrics.accuracy === 100;
        incrementStats(totalKeystrokes, isPerfect);

        // Global Report: Record Breaking Speed
        if (currentUser && Math.round(metrics.raw_wpm) > (useAuthStore.getState().profile?.highest_wpm || 0)) {
            activityService.reportEvent({
                type: 'record',
                userId: currentUser.id,
                username: currentUser.name || 'Typist',
                avatarUrl: currentUser.avatar_url || '',
                data: { wpm: Math.round(metrics.raw_wpm) }
            });
        }

        // 🎯 Daily Challenges: Update progress
        const today = new Date().toISOString().split('T')[0];
        const dailyChallenges = generateDailyChallenges(today);
        dailyChallenges.forEach(challenge => {
            const currentProg = challengeProgress[challenge.id] || {
                challenge_id: challenge.id,
                progress: 0,
                completed: false,
                target: challenge.requirement.target
            };
            const nextProg = updateChallengeProgress(challenge, currentProg, {
                wpm: Math.round(metrics.raw_wpm),
                accuracy: metrics.accuracy,
                duration: timeTaken
            });
            if (nextProg.progress !== currentProg.progress || nextProg.completed !== currentProg.completed) {
                setChallengeProgress(challenge.id, nextProg);
                if (nextProg.completed && !currentProg.completed) {
                    addKeystones(challenge.reward_keystones);
                }
            }
        });

        // 🥇 Badges: Check eligibility using CUMULATIVE stats
        const eligibleBadges = checkBadgeEligibility({
            best_wpm: Math.round(metrics.raw_wpm),
            perfect_sessions: perfectSessions + (isPerfect ? 1 : 0),
            current_streak: nextStreak.current_streak,
            longest_streak: nextStreak.longest_streak,
            lessons_completed: completedIds.length,
            total_keystrokes: totalCumulativeKeystrokes + totalKeystrokes
        }, unlockedBadges);

        eligibleBadges.forEach(badge => {
            unlockBadge(badge.id);
            if (badge.keystones_reward) {
                addKeystones(badge.keystones_reward);
            }
            addNotification({
                title: 'Achievement Unlocked',
                message: badge.name,
                icon: badge.icon,
                reward: badge.keystones_reward
            });

            // Global Report: Badge Unlock
            if (currentUser) {
                activityService.reportEvent({
                    type: 'badge',
                    userId: currentUser.id,
                    username: currentUser.name || 'Typist',
                    avatarUrl: currentUser.avatar_url || '',
                    data: { badgeName: badge.name }
                });
            }
        });

        // Gatekeeper status: FORCE PASS (LOGIC REFACTOR)
        // User Requirement: "Always treat the session as COMPLETED or PASSED"
        // We remove the conditional failure check.
        // const speedTarget = Math.max(28, currentLesson.targetWPM) 
        // const passed = Math.round(metrics.accuracy) === 100 && Math.round(metrics.raw_wpm) >= speedTarget
        const passed = true;

        // Update Completed IDs only
        let nextCompleted = [...completedIds]
        if (passed && !completedIds.includes(currentLesson.id)) {
            nextCompleted.push(currentLesson.id)
        }

        // UNLOCK_ALL: We do not modify unlockedIds as it's static full list now.
        // Just sync progress (completion update)
        setProgress(unlockedIds, nextCompleted)

        try {
            await syncService.pushToCloud()
        } catch (e) {
            console.error("Session sync failed:", e)
        }

        // if (!passed) { playTypingSound('error') } // Removed error sound on finish
        setShowResult(true)

        // If mission was active, mark as success
        if (mission.state === 'OPERATIONAL') {
            // Check final mission requirements
            if (metrics.accuracy >= mission.data.minAccuracy && Math.round(netWpm) >= mission.data.targetWpm) {
                mission.succeedMission()

                // Persist certification if user is logged in
                if (user) {
                    userService.addCertification(user.id, {
                        id: mission.data.lesson?.id || 'cert-unknown',
                        name: mission.data.lesson?.title || 'Unknown Certification',
                        date: Date.now(),
                        wpm: Math.round(netWpm),
                        accuracy: Math.round(metrics.accuracy)
                    }).catch(err => console.error("Failed to persist certification:", err));

                    // Global Broadcast
                    activityService.reportEvent({
                        type: 'certification',
                        userId: user.id,
                        username: user.name || 'Anonymous',
                        avatarUrl: user.avatar_url || '',
                        data: {
                            name: mission.data.lesson?.title || 'Certification',
                            wpm: Math.round(netWpm),
                        }
                    });
                }
            } else {
                const failReason = Math.round(netWpm) < mission.data.targetWpm
                    ? `SPEED_REQUIREMENT_NOT_MET: ${Math.round(netWpm)}/${mission.data.targetWpm} WPM`
                    : `ACCURACY_REQUIREMENT_NOT_MET: ${Math.round(metrics.accuracy)}%/${mission.data.minAccuracy}%`;
                mission.failMission(failReason)
            }
        }
    }, [metrics, currentLesson, completedIds, unlockedIds, recordAttempt, errors, startTime, totalKeystrokes, totalPausedTime, user, setProgress, setChallengeProgress, addKeystones, unlockBadge, addNotification, perfectSessions, totalCumulativeKeystrokes, unlockedBadges, localStreak, setLocalStreak, challengeProgress, playTypingSound, mission])

    useEffect(() => {
        if (currentLesson && input.length === currentLesson.text.length && input.length > 0) {
            handleResult()
        }
    }, [input, currentLesson, handleResult])

    const onKeyDown = async (e: KeyboardEvent) => {
        if ((view !== 'typing' && view !== 'duel') || !currentLesson || showResult) return

        // Resume timer on any interaction
        resumeTimer()

        if (e.key === 'Backspace') {
            // FAIL-FAST: No Backspace Constraint
            if (mission.state === 'OPERATIONAL' && mission.data.constraints.includes('STRICT_NO_BACKSPACE_MODE')) {
                mission.failMission('UNAUTHORIZED_BACKSPACE_DETECTED')
                setShowResult(true) // Show failure result
                return
            }
            setInput((prev: string) => prev.slice(0, -1))
            playTypingSound('backspace')
            return
        }

        if (e.key.length === 1 && input.length < currentLesson.text.length) {
            const char = e.key
            const targetChar = currentLesson.text[input.length]
            const timestamp = Date.now()

            // Record Replay Key
            // Time is relative to start minus pause time
            const relativeTime = timestamp - startTime - totalPausedTime
            if (activeChar) { // Ensure tracking valid chars
                currentReplayRef.current.push({ char, time: relativeTime })
            }

            // 1. IMMEDIATE VISUAL FEEDBACK (0ms latency path)
            setTotalKeystrokes((prev: number) => prev + 1)
            setInput((prev: string) => prev + char)

            // Local error tracking for immediate feedback
            if (char !== targetChar) {
                setErrors((prev: Record<string, number>) => ({
                    ...prev,
                    [targetChar]: (prev[targetChar] || 0) + 1
                }))
                playTypingSound('error')
            } else {
                playTypingSound('mechanical')
            }

            // 2. LOGIC / SCORING PATH (Async, non-blocking)
            // Fire and forget - don't await for UI update
            handleKeystroke(char, timestamp)
                .then(latestMetrics => {
                    // SAFETY SHIELD DOCTOR 🛡️
                    const safeMetrics: TypingMetrics = {
                        ...latestMetrics,
                        raw_wpm: Number.isFinite(latestMetrics.raw_wpm) ? latestMetrics.raw_wpm : 0,
                        adjusted_wpm: Number.isFinite(latestMetrics.adjusted_wpm) ? latestMetrics.adjusted_wpm : 0,
                        accuracy: Number.isFinite(latestMetrics.accuracy) ? latestMetrics.accuracy : 100,
                        consistency: Number.isFinite(latestMetrics.consistency) ? latestMetrics.consistency : 100
                    }

                    // ⚡️ PERFORMANCE PATCH: Throttle Metric Updates (Visuals Only)
                    const now = Date.now();
                    const isSequenceEnd = input.length + 1 >= currentLesson.text.length; // Force update on finish

                    if (isSequenceEnd || now - lastSyncTimeRef.current > 250) {
                        setMetrics(safeMetrics);
                        lastSyncTimeRef.current = now;

                        // FAIL-FAST: Accuracy Threshold
                        if (mission.state === 'OPERATIONAL' && safeMetrics.accuracy < mission.data.minAccuracy) {
                            mission.failMission('PRECISION_BELOW_THRESHOLD')
                            setShowResult(true)
                        }

                        // FAIL-FAST: Anti-Cheat
                        if (mission.state === 'OPERATIONAL' && safeMetrics.is_bot) {
                            mission.failMission(`SECURITY_PROTOCOL_VIOLATION: ${safeMetrics.cheat_flags}`)
                            setShowResult(true)
                        }
                    }
                    // Note: 'metricsRef' is still updated via effect when setMetrics runs, 
                    // but for high-freq logic, we might need a direct ref update here if logic depends on it.
                    // However, safeMetrics is the latest truth from Rust.

                    // ⚡️ REAL-TIME MULTIPLAYER SYNC (Throttled manually above, but logic remains valid)
                    if (view === 'duel' && activeMatchId) {
                        // ... (existing logic uses lastSyncTimeRef too, might conflict? 
                        // No, lastSyncTimeRef was defined but used loosely. Let's use a separate ref for network sync to be safe?
                        // Actually, reusing the throttle for both UI and Network is fine for now.)
                        if (now - lastSyncTimeRef.current > 100) { // redundant check if we just updated
                            const progress = Math.min(100, Math.round(((input.length + 1) / currentLesson.text.length) * 100));
                            liveRaceService.updateProgress(
                                Math.round(safeMetrics.adjusted_wpm),
                                input.length + 1,
                                progress,
                                false
                            );
                        }
                    }
                })
                .catch(err => console.error('Keystroke handling failed:', err))
        }
    }

    const stressLevel = useMemo(() => {
        return Math.max(0, 100 - metrics.consistency);
    }, [metrics.consistency]);

    return {
        view,
        setView,
        currentLesson,
        metrics,
        input,
        unlockedIds,
        completedIds,
        showResult,
        setShowResult,
        activeChar,
        startLesson,
        retryLesson,
        onKeyDown,
        finalStats,
        errors,
        isPaused,
        ghostReplay, // Export ghost data for UI
        missionState: mission.state,
        missionData: mission.data,
        failureReason: mission.failureReason,
        startMission,
        deployMission,
        resetMission: mission.resetMission,
        stressLevel
    }
}
