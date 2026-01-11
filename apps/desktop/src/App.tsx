import React, { useEffect, useRef } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/core'
import { useAuthStore } from '../../../src/stores/authStore'
import { useTyping } from '../../../src/hooks/useTyping'
import { useSettingsStore } from '../../../src/stores/settingsStore'
import { syncService } from '../../../src/services/syncService'
import { TypingArea } from '../../../src/components/TypingArea'
import { TypingTestPage } from '../../../src/components/pages/TypingTestPage'
import { LessonSelector } from '../../../src/components/LessonSelector'
import { GatekeeperModal } from '../../../src/components/GatekeeperModal'
import { AnalyticsDashboard } from '../../../src/components/analytics/AnalyticsDashboard'
import { CURRICULUM, Lesson } from '../../../src/data/lessons'
import { getRankForWPM } from '../../../src/services/rankSystem'
import '../../../src/styles/glass.css'
import '../../../src/styles/themes.css'
import { TitleBar } from '../../../src/components/TitleBar'
import { useUpdater } from '../../../src/hooks/useUpdater'
import { useLockdown } from '../../../src/hooks/useLockdown'

import { SplashScreen } from '../../../src/components/SplashScreen'
import { WhatsNewModal } from '../../../src/components/WhatsNewModal'
import { UsernameModal } from '../../../src/components/social/UsernameModal'
import { SocialDashboard } from '../../../src/components/social/SocialDashboard'
import { RankCelebration } from '../../../src/components/social/RankCelebration'
import Lobby from '../../../src/components/social/Lobby'
import { DuelArena } from '../../../src/components/social/DuelArena'
import { NetworkTest } from '../../../src/components/NetworkTest'

// NEW UI PRIMITIVES
import { AppShell } from '../../../src/components/layout/AppShell'
import { SideNav } from '../../../src/components/layout/SideNav'
import { TopBar as ModernTopBar } from '../../../src/components/layout/TopBar'
import { Button } from '../../../src/components/ui/Button'

// WARM GLASS DASHBOARD
import { DashboardPage } from '../../../src/components/dashboard/DashboardPage'
import { StorePage } from '../../../src/components/store/StorePage'

// GAMIFICATION
import { GamificationPage } from '../../../src/components/gamification/GamificationPage'

// ICONS for SideNav
const PracticeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>;
const TestIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AnalyticsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const SocialIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const StoreIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const TrophyIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true) // Start with loading true

  useLockdown() // Enforce UI Security
  const { user, setAuthenticated, checkSession } = useAuthStore()
  const { theme, fontFamily } = useSettingsStore()
  const typing = useTyping()
  useUpdater() // Initialize auto-updater check
  const inputRef = useRef<HTMLInputElement>(null)

  // Auth & Session Initialization
  useEffect(() => {
    const initSession = async () => {
      // 1. Check persistent store first
      const hasSession = await checkSession()

      // 2. Handle specific OAuth Callbacks (Overwrites session if present)
      const handleAuth = async (urlStr: string) => {
        try {
          const url = new URL(urlStr)
          const code = url.searchParams.get('code')
          const path = url.pathname || url.hostname + url.pathname

          if (code) {
            let provider: 'google' | 'github' | null = null
            if (path.includes('google')) provider = 'google'
            if (path.includes('github')) provider = 'github'

            if (provider) {
              const userData = await invoke<any>(`${provider}_auth_finish`, { code })
              setAuthenticated(userData, userData.token)

              syncService.pullFromCloud()

              if (window.location.protocol.startsWith('http')) {
                window.history.replaceState({}, document.title, '/')
              }
            }
          }
        } catch (err) {
          console.error('Auth failed:', err)
        }
      }

      await handleAuth(window.location.href)

      // 3. Deep Link Listener
      import('@tauri-apps/plugin-deep-link').then(({ onOpenUrl }) => {
        onOpenUrl(async (urls) => {
          console.log('Deep link received:', urls)
          try {
            await getCurrentWindow().setFocus()
          } catch (e) {
            console.error('Failed to focus window:', e)
          }
          urls.forEach(handleAuth)
        })
      }).catch(e => {
        console.error('Deep link init failed:', e)
      })

      if (useAuthStore.getState().user) {
        syncService.pullFromCloud()
      }

      // Done loading
      setTimeout(() => setIsLoading(false), 500) // Small buffer for splash smoothness
    }

    initSession()
  }, []) // Run once on mount

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
        <AppShell
          activeView={typing.view}
          sidebar={
            <SideNav
              items={[
                { id: 'dashboard', icon: <HomeIcon />, label: 'Dashboard', onClick: () => typing.setView('dashboard'), active: typing.view === 'dashboard' },
                { id: 'practice', icon: <PracticeIcon />, label: 'Practice', onClick: () => typing.setView('selection'), active: typing.view === 'selection' || typing.view === 'typing' },
                { id: 'analytics', icon: <AnalyticsIcon />, label: 'Analytics', onClick: () => typing.setView('analytics'), active: typing.view === 'analytics' },
                { id: 'social', icon: <SocialIcon />, label: 'Social', onClick: () => typing.setView('social'), active: typing.view === 'social' || typing.view === 'lobby' || typing.view === 'duel' },
                { id: 'achievements', icon: <TrophyIcon />, label: 'Achievements', onClick: () => typing.setView('achievements'), active: typing.view === 'achievements' },
                { id: 'store', icon: <StoreIcon />, label: 'Store', onClick: () => typing.setView('store'), active: typing.view === 'store' },
                { id: 'settings', icon: <SettingsIcon />, label: 'Settings', onClick: () => { }, active: false },
              ]}
              footer={
                <div className="flex flex-col items-center space-y-4">
                  {user ? (
                    <div className="w-8 h-8 rounded-full border border-hacker/30 overflow-hidden">
                      <img src={user.avatar_url || ''} alt="User" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
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
                  <NetworkTest />
                  {user && <Button variant="ghost" size="sm" onClick={() => useAuthStore.getState().logout()}>LOGOUT</Button>}
                </div>
              }
            />
          }
        >
          <TitleBar />
          <WhatsNewModal />
          <UsernameModal />
          <RankCelebration />

          {typing.view === 'dashboard' ? (
            <DashboardPage
              username={user?.displayName?.split(' ')[0] || 'Typist'}
              wpm={Math.round(typing.metrics.adjusted_wpm)}
              accuracy={typing.metrics.accuracy}
              keystones={useAuthStore.getState().profile?.keystones || 0}
              streak={useAuthStore.getState().profile?.streak || 0}
              bestWpm={useAuthStore.getState().profile?.best_wpm || 0}
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
            />
          ) : typing.view === 'store' ? (
            <StorePage onBack={() => typing.setView('dashboard')} />
          ) : typing.view === 'achievements' ? (
            <GamificationPage
              userStats={{
                best_wpm: Math.round(typing.metrics.adjusted_wpm),
                perfect_sessions: 0,
                current_streak: 0,
                longest_streak: 0,
                lessons_completed: typing.completedIds.length,
                total_keystrokes: 0,
              }}
              unlockedBadgeIds={[]}
              streakData={{
                current_streak: 0,
                longest_streak: 0,
              }}
              challengeProgress={{}}
              onBack={() => typing.setView('dashboard')}
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
                const duelLesson = CURRICULUM[0];
                typing.startLesson(duelLesson);
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
            />
          )}

          {typing.showResult && typing.currentLesson && (
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
                  typing.startLesson(CURRICULUM[currentIndex + 1])
                }
              }}
            />
          )}
        </AppShell>
      )}
    </>
  )
}

export default App
