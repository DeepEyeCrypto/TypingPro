import React, { useEffect, useRef } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/core'
import { useAuthStore } from './core/store/authStore'
import { useTyping } from './hooks/useTyping'
import { useSettingsStore } from './core/store/settingsStore'
import { usePresenceStore } from './core/store/presenceStore'
import { useSyncStore } from './core/store/syncStore'
import { syncService } from './core/syncService'
import { TypingArea } from './components/features/typing/TypingArea'
import { TypingTestPage } from './components/pages/TypingTestPage'
import { LessonSelector } from './components/features/typing/LessonSelector'
import { GatekeeperModal } from './components/features/typing/GatekeeperModal'
import { MissionResult } from './components/features/dashboard/MissionResult'
import { AnalyticsDashboard } from './components/features/analytics/AnalyticsDashboard'
import { CURRICULUM, Lesson } from './data/lessons'
import { getRankForWPM } from './core/rankSystem'
import { friendService } from './core/friendService'
import { userService } from './core/userService'
import { matchmakingService } from './core/matchmakingService'
// import '@/styles/glass-blur.css' // Replaced by glass-unified.css imported in main.tsx
import './styles/themes.css'
import { TitleBar } from './components/layout/TitleBar'
import { useUpdater } from './hooks/useUpdater'
import { useLockdown } from './hooks/useLockdown'

import { SplashScreen } from './components/layout/SplashScreen'
import { WhatsNewModal } from './components/features/settings/WhatsNewModal'
import { UsernameModal } from './components/features/social/UsernameModal'
import { SocialDashboard } from './components/features/social/SocialDashboard'
import { RankCelebration } from './components/features/social/RankCelebration'
import Lobby from './components/features/social/Lobby'
import { DuelArena } from './components/features/social/DuelArena'
import { useDevChord } from './hooks/useDevChord'
import { DevHud } from './components/features/dev/DevHud'

// NEW UI PRIMITIVES
import { AppLayout } from './components/layout/AppLayout' // Unified Layout
import { SideNav } from './components/layout/SideNav'
import { TopBar as ModernTopBar } from './components/layout/TopBar'
import { Button } from './components/ui/Button'
import { AuthButtons } from './components/features/auth/AuthButtons'
import { AuthPage } from './components/pages/AuthPage'
import { ProfilePage } from './components/pages/ProfilePage'
import { useAuth } from './hooks/useAuth'

// WARM GLASS DASHBOARD
import { DashboardPage } from './components/features/dashboard/DashboardPage'
import { StorePage } from './components/features/store/StorePage'
import { SettingsPage } from './components/features/settings/SettingsPage'

// GAMIFICATION
import { GamificationPage } from './components/features/gamification/GamificationPage'
import { CertificationPage } from './components/features/certification/CertificationPage'
import { AchievementToast } from './components/features/gamification/AchievementToast'
import { useAchievementStore } from './core/store/achievementStore'

// GLOBAL TOAST NOTIFICATIONS
import { ToastContainer } from './components/ui/ToastContainer'

// ICONS for SideNav
const PracticeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" /></svg>;
const TestIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AnalyticsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const SocialIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const StoreIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const TrophyIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true) // Start with loading true
  const { isSyncing } = useSyncStore()


  // Init Hooks
  useLockdown()
  useAuth() // Initialize Auth Listeners (Deep Link)
  const { user, isGuest, checkSession } = useAuthStore()
  const { theme, fontFamily } = useSettingsStore()
  const typing = useTyping()
  const { unlockedBadges, streak: streakData, certifications, keystones } = useAchievementStore()
  useUpdater()
  useDevChord()
  const inputRef = useRef<HTMLInputElement>(null)

  // Auth & Session Initialization
  useEffect(() => {
    const initSession = async () => {
      // 1. Check persistence
      await checkSession()

      if (useAuthStore.getState().user) {
        await syncService.pullFromCloud()
      }
      setTimeout(() => setIsLoading(false), 500)
    }
    initSession()
  }, [])

  // Protected Route Logic
  if (!isLoading && !user && !isGuest) {
    return <AuthPage />;
  }

  // 📡 SOCIAL HEARTBEAT: Listen for requests and duels
  useEffect(() => {
    if (!user?.id) return

    const unsubRequests = friendService.listenToIncomingRequests(user.id, (requests) => {
      // Find new requests that weren't there before (simple comparison by length or ID)
      const lastCount = parseInt(localStorage.getItem('last_req_count') || '0')
      if (requests.length > lastCount) {
        const newest = requests[0]
        useAchievementStore.getState().addNotification({
          title: 'New Friend Request',
          message: `@${newest.fromUsername} wants to connect!`,
          icon: '👤',
          reward: 0
        })
      }
      localStorage.setItem('last_req_count', requests.length.toString())
    })

    const unsubDuels = friendService.listenToIncomingDuels(user.id, (duels) => {
      if (duels.length > 0) {
        const newest = duels[0]
        const notified = sessionStorage.getItem(`duel_notified_${newest.id}`)
        if (!notified) {
          useAchievementStore.getState().addNotification({
            title: newest.type === 'matchmade' ? 'Match Found!' : 'Duel Challenged!',
            message: newest.type === 'matchmade' ? 'Arena is ready for combat.' : `@${newest.challengerName || 'Someone'} challenged you!`,
            icon: '⚔️',
            reward: 0,
            actionLabel: 'ACCEPT',
            onAction: async () => {
              await friendService.acceptDuel(newest.id);
              typing.setActiveMatchId(newest.id);
              typing.setView('duel');
            }
          })
          sessionStorage.setItem(`duel_notified_${newest.id}`, 'true')
        }
      }
    })

    // 📡 MATCHMAKING LISTENER
    const unsubMatch = matchmakingService.listenForMatch((matchId) => {
      const notified = sessionStorage.getItem(`match_notified_${matchId}`);
      if (!notified) {
        typing.setActiveMatchId(matchId);
        typing.setView('duel');
        sessionStorage.setItem(`match_notified_${matchId}`, 'true');
      }
    });

    return () => {
      unsubRequests()
      unsubDuels()
      unsubMatch()
    }
  }, [user?.id, typing.setView, typing.setActiveMatchId])

  // 💓 PRESENCE HEARTBEAT: Update every 30s
  const { syncPresence, setStatus } = usePresenceStore()
  useEffect(() => {
    if (!user?.id) return;

    // Set initial status to LOBBY
    setStatus('LOBBY')

    const interval = setInterval(() => {
      syncPresence().catch(console.error)
    }, 30000)

    return () => clearInterval(interval)
  }, [user?.id, syncPresence, setStatus])

  // Focus management
  useEffect(() => {
    if (!isLoading && typing.view === 'typing') {
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [typing.view, isLoading])

  const gatekeeperPassed = typing.currentLesson
    ? (Math.round(typing.metrics.accuracy) === 100 && Math.round(typing.metrics.raw_wpm) >= Math.max(28, typing.currentLesson.targetWPM))
    : false

  return (
    <>
      {isLoading && <SplashScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <AppLayout
          activeView={typing.view}
          sidebar={
            <SideNav
              syncing={isSyncing}
              items={[
                { id: 'dashboard', icon: <HomeIcon />, label: 'Dashboard', onClick: () => typing.setView('dashboard'), active: typing.view === 'dashboard' },
                { id: 'practice', icon: <PracticeIcon />, label: 'Practice', onClick: () => typing.setView('selection'), active: typing.view === 'selection' || typing.view === 'typing' },
                { id: 'analytics', icon: <AnalyticsIcon />, label: 'Analytics', onClick: () => typing.setView('analytics'), active: typing.view === 'analytics' },
                { id: 'social', icon: <SocialIcon />, label: 'Social', onClick: () => typing.setView('social'), active: typing.view === 'social' || typing.view === 'lobby' || typing.view === 'duel' },
                { id: 'achievements', icon: <TrophyIcon />, label: 'Achievements', onClick: () => typing.setView('achievements'), active: typing.view === 'achievements' || typing.view === 'certification' },
                { id: 'store', icon: <StoreIcon />, label: 'Store', onClick: () => typing.setView('store'), active: typing.view === 'store' },
                { id: 'settings', icon: <SettingsIcon />, label: 'Settings', onClick: () => typing.setView('settings'), active: typing.view === 'settings' },
              ]}
              footer={
                <div className="flex flex-col items-center space-y-4 pb-2">
                  {user ? (
                    <div className="w-8 h-8 rounded-full border border-black/20 overflow-hidden">
                      <img src={user.avatar_url || ''} alt="User" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-black/5 border border-black/10" />
                  )}
                </div>
              }
            />
          }
          topbar={
            <ModernTopBar
              title="TYPINGPRO EXPERT ENGINE"
              stats={{
                wpm: Math.round(typing.metrics.adjusted_wpm),
                accuracy: Math.round(typing.metrics.accuracy),
                rank: useAuthStore.getState().profile
                  ? getRankForWPM(useAuthStore.getState().profile?.avg_wpm || 0).name
                  : 'UNRANKED'
              }}
              actions={
                <div className="flex items-center space-x-2">
                  <AuthButtons />
                  <div className="cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors" onClick={() => typing.setView('profile')}>
                    {user?.avatar_url ? <img src={user.avatar_url} className="w-8 h-8 rounded-full border border-white/20" /> : <div className="w-8 h-8 rounded-full bg-white/10" />}
                  </div>
                </div>
              }
            />
          }
        >
          <TitleBar />
          <WhatsNewModal />
          <UsernameModal />
          <RankCelebration />
          <AchievementToast />
          <DevHud />
          <ToastContainer />

          {typing.view === 'dashboard' ? (
            <DashboardPage
              username={user?.displayName?.split(' ')[0] || 'Typist'}
              wpm={Math.round(typing.metrics.adjusted_wpm)}
              accuracy={typing.metrics.accuracy}
              keystones={keystones}
              streak={streakData.current_streak}
              bestWpm={useAuthStore.getState().profile?.highest_wpm || 0}
              rank={getRankForWPM(useAuthStore.getState().profile?.avg_wpm || 0).name}
              level={Math.floor((useAuthStore.getState().profile?.avg_wpm || 0) / 10) + 1}
              currentLesson={{
                title: CURRICULUM[typing.unlockedIds.length - 1]?.title || 'Home Row: F & J',
                stage: CURRICULUM[typing.unlockedIds.length - 1]?.stage || 'Home Row',
                targetWpm: CURRICULUM[typing.unlockedIds.length - 1]?.targetWPM || 28,
                index: typing.completedIds.length,
                total: CURRICULUM.length,
              }}
              onStartLesson={() => {
                const nextLesson = CURRICULUM[typing.unlockedIds.length - 1] || CURRICULUM[0];
                typing.startLesson(nextLesson);
              }}
              onStartMission={(lesson, targetWpm, minAcc) => {
                typing.startMission(lesson, targetWpm, minAcc, ["STRICT_NO_BACKSPACE_MODE", "PERMANENT_FOCUS_LOCK"]);
              }}
              missionState={typing.missionState}
              onDeployMission={typing.deployMission}
              onResetMission={typing.resetMission}
            />
          ) : typing.view === 'profile' ? (
            <ProfilePage />
          ) : typing.view === 'store' ? (
            <StorePage onBack={() => typing.setView('dashboard')} />
          ) : typing.view === 'settings' ? (
            <SettingsPage onBack={() => typing.setView('dashboard')} />
          ) : typing.view === 'achievements' ? (
            <GamificationPage
              userStats={{
                best_wpm: useAuthStore.getState().profile?.highest_wpm || 0,
                perfect_sessions: useAchievementStore.getState().perfectSessions,
                current_streak: streakData.current_streak,
                longest_streak: streakData.longest_streak,
                lessons_completed: typing.completedIds.length,
                total_keystrokes: useAchievementStore.getState().totalKeystrokes,
              }}
              unlockedBadgeIds={unlockedBadges}
              streakData={streakData}
              earnedCertifications={certifications}
              challengeProgress={useAchievementStore.getState().challengeProgress}
              onBack={() => typing.setView('dashboard')}
              onCertificationAttempt={() => typing.setView('certification')}
            />
          ) : typing.view === 'certification' ? (
            <CertificationPage
              userId={user?.id || 'guest'}
              username={user?.name || 'Typist'}
              earnedCertifications={certifications}
              onCertificationEarned={(cert, reward) => {
                useAchievementStore.getState().addCertification(cert);
                useAchievementStore.getState().addKeystones(reward);
                syncService.pushToCloud();
              }}
              onBack={() => typing.setView('achievements')}
            />
          ) : typing.view === 'selection' ? (
            <LessonSelector
              unlockedIds={typing.unlockedIds}
              completedIds={typing.completedIds}
              onSelect={typing.startLesson}
            />
          ) : typing.view === 'analytics' ? (
            <AnalyticsDashboard
              onBack={() => typing.setView('selection')}
              onStartDrill={(text) => {
                const drillLesson: any = {
                  id: `drill-${Date.now()}`,
                  title: 'AI Prescribed Drill',
                  description: 'Dynamic correction based on your recent errors.',
                  text: text,
                  targetWPM: 0,
                  focusFingers: [],
                  stage: 'Drill',
                  unlocks: []
                };
                typing.startLesson(drillLesson);
              }}
            />
          ) : typing.view === 'social' ? (
            <SocialDashboard
              onBack={() => typing.setView('selection')}
              onPlayGhost={(lessonId, ghostData) => {
                const lesson = CURRICULUM.find((l: any) => l.id === lessonId)
                if (lesson) {
                  typing.startLesson(lesson, ghostData)
                } else {
                  console.error("Lesson not found for ghost replay:", lessonId)
                }
              }}
              onNavigateToLobby={() => typing.setView('lobby')}
            />
          ) : typing.view === 'lobby' ? (
            <Lobby
              onBack={() => typing.setView('social')}
              onMatchFound={(matchId) => {
                typing.setActiveMatchId(matchId)
                typing.setView('duel');
              }}
            />
          ) : typing.view === 'duel' && typing.activeMatchId ? (
            <DuelArena
              duelId={typing.activeMatchId}
              onEnd={() => {
                typing.setActiveMatchId(null)
                typing.setView('social')
              }}
            />
          ) : (
            <TypingTestPage
              targetText={typing.currentLesson?.text || ''}
              input={typing.input}
              active={!typing.isPaused}
              onKeyDown={(e) => typing.onKeyDown(e.nativeEvent)}
              stats={{
                wpm: Math.round(typing.metrics.adjusted_wpm),
                accuracy: Math.round(typing.metrics.accuracy),
                rawKpm: Math.round(typing.metrics.raw_wpm * 5)
              }}
              onReset={() => typing.retryLesson()}
              missionData={{
                isMission: typing.missionData.isMission,
                targetWpm: typing.missionData.targetWpm,
                minAccuracy: typing.missionData.minAccuracy,
                stressLevel: typing.stressLevel
              }}
            />
          )}

          {typing.showResult && typing.currentLesson && typing.missionState !== 'IDLE' ? (
            <MissionResult
              isOpen={typing.showResult}
              state={(typing.missionState as 'SUCCESS' | 'FAILURE')}
              wpm={typing.finalStats.netWpm}
              accuracy={Math.round(typing.metrics.accuracy)}
              failureReason={typing.failureReason}
              onClose={() => {
                typing.setShowResult(false);
                typing.resetMission();
                typing.setView('dashboard');
              }}
              onShare={() => {
                console.log("Sharing Certification...");
              }}
            />
          ) : typing.showResult && typing.currentLesson && (
            <GatekeeperModal
              stats={{
                ...typing.finalStats,
                accuracy: typing.metrics.accuracy,
                errorsDetail: typing.errors
              }}
              targetWPM={Math.max(28, typing.currentLesson.targetWPM)}
              passed={gatekeeperPassed}
              onClose={() => {
                if (!gatekeeperPassed) {
                  typing.retryLesson()
                } else {
                  typing.setView('selection')
                }
                typing.setShowResult(false)
              }}
              onNext={() => {
                typing.setShowResult(false)
                const currentIndex = CURRICULUM.findIndex((l: any) => l.id === typing.currentLesson?.id)
                if (currentIndex < CURRICULUM.length - 1) {
                  typing.startLesson(CURRICULUM[currentIndex + 1]);
                }
              }}
            />
          )}
        </AppLayout>
      )}
    </>
  )
}

export default App
