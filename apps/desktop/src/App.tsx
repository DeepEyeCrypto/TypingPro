import React, { useEffect, useRef, useState } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/core'
import { useAuthStore, initializeAuthListener } from './core/store/authStore'
import { ArrowLeft, Brain, Home, Keyboard, BarChart3, Users2, Trophy, ShoppingBag, Settings, CheckCircle2 } from 'lucide-react'
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
import { getRankForWPM, calculateLevel } from './core/rankSystem'
import { friendService } from './core/friendService'
import { userService } from './core/userService'
import { matchmakingService } from './core/matchmakingService'
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
import { ThemeSwitcher } from './components/ThemeSwitcher'
import { Button } from './components/ui/Button'
import { AuthButtons } from './components/features/auth/AuthButtons'
import { AuthPage } from './components/pages/AuthPage'
import { ProfilePage } from './components/pages/ProfilePage'
import { useAuth } from './hooks/useAuth'

// WARM GLASS DASHBOARD
import { DashboardPage } from './components/features/dashboard/DashboardPage'
import { StorePage } from './components/features/store/StorePage'
import { SettingsPage } from './components/features/settings/SettingsPage'
import { SmartLessonGenerator } from './utils/SmartLessonGenerator'
import { WeaknessAnalyzer } from './core/weaknessAnalyzer'

// GAMIFICATION
import { GamificationPage } from './components/features/gamification/GamificationPage'
import { CertificationPage } from './components/features/certification/CertificationPage'
import { AchievementToast } from './components/features/gamification/AchievementToast'
import { useAchievementStore } from './core/store/achievementStore'
import { useStatsStore } from './core/store/statsStore'
import { NeuralCoach } from './components/features/dashboard/NeuralCoach'

// GLOBAL TOAST NOTIFICATIONS
import { ToastContainer } from './components/ui/ToastContainer'

// AUTH PROTECTION
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// ICONS for SideNav
const PracticeIcon = ({ size = 20 }: { size?: number }) => <Keyboard size={size} />;
const TestIcon = ({ size = 20 }: { size?: number }) => <CheckCircle2 size={size} />;
const AnalyticsIcon = ({ size = 20 }: { size?: number }) => <BarChart3 size={size} />;
const SocialIcon = ({ size = 20 }: { size?: number }) => <Users2 size={size} />;
const SettingsIcon = ({ size = 20 }: { size?: number }) => <Settings size={size} />;
const HomeIcon = ({ size = 20 }: { size?: number }) => <Home size={size} />;
const StoreIcon = ({ size = 20 }: { size?: number }) => <ShoppingBag size={size} />;
const TrophyIcon = ({ size = 20 }: { size?: number }) => <Trophy size={size} />;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [weaknessProfile, setWeaknessProfile] = useState<any>(null)
  const { isSyncing } = useSyncStore()


  // Init Hooks
  useLockdown()
  useAuth() // Initialize Auth Listeners (Deep Link)
  const { user, isGuest, checkSession } = useAuthStore()
  const typing = useTyping()
  const { unlockedBadges, streak: streakData, certifications, keystones } = useAchievementStore()
  useUpdater()
  useDevChord()
  const inputRef = useRef<HTMLInputElement>(null)

  // Auth & Session Initialization
  useEffect(() => {
    const initSession = async () => {
      // 0. Transition FAST to UI (non-blocking approach)
      // We show the splash screen for a minimum duration but let the app start
      setTimeout(() => setIsLoading(false), 800);

      // 1. Initialize Stores (Deferred Hydration) - Hardened with per-store catch
      try { useStatsStore.getState().initialize(); } catch (e) { console.error("StatsStore Init Fail", e); }
      try { useSettingsStore.getState().initialize(); } catch (e) { console.error("SettingsStore Init Fail", e); }
      try { useAchievementStore.getState().initialize(); } catch (e) { console.error("AchievementStore Init Fail", e); }

      // 2. Initialize Firebase auth listener (non-blocking)
      console.log("[App] Initializing Auth Listener...");
      initializeAuthListener()

      // 3. Check persistence & validate session (Background)
      try {
        const hasSession = await checkSession();
        console.log("[App] Session Check Result:", hasSession);

        if (useAuthStore.getState().user) {
          console.log("[App] Validating existing session...");
          await useAuthStore.getState().validateSession()
          await syncService.pullFromCloud()
        }
      } catch (e) { console.error("Session initialization fail", e); }

      // 4. Load weakness profile
      try {
        const profile = await WeaknessAnalyzer.loadProfile()
        setWeaknessProfile(profile)
      } catch (e) { console.error("Weakness profile fail", e); }

      console.log("[App] Background Startup Sequence Complete.");
    }
    initSession()
  }, [])

  // Periodic token refresh (every 50 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (useAuthStore.getState().user) {
        useAuthStore.getState().validateSession()
      }
    }, 50 * 60 * 1000) // 50 minutes

    return () => clearInterval(interval)
  }, [])

  // Refresh weakness profile when returning to dashboard
  useEffect(() => {
    if (typing.view === 'dashboard') {
      WeaknessAnalyzer.loadProfile().then(profile => {
        setWeaknessProfile(profile)
      })
    }
  }, [typing.view])

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

  // 10. Global Discord Presence (Tauri RPC)
  useEffect(() => {
    const updatePresence = async () => {
      let state = 'Idle';
      let details = 'In the mainframe';

      switch (typing.view) {
        case 'typing':
          state = 'Training';
          details = typing.currentLesson?.title || 'Active Session';
          break;
        case 'social':
          state = 'Community Hub';
          details = 'Browsing the matrix';
          break;
        case 'coach':
          state = 'AI Consultation';
          details = 'Recalibrating neural pathways';
          break;
        case 'certification':
          state = 'Credentialing';
          details = 'Validating elite status';
          break;
        case 'duel':
          state = 'Arena Battle';
          details = 'Engaged in combat';
          break;
        case 'selection':
          state = 'Mission Selection';
          details = 'Choosing next objective';
          break;
        case 'analytics':
          state = 'Performance Lab';
          details = 'Analyzing synaptic throughput';
          break;
      }

      try {
        await invoke('update_presence', { state, details });
      } catch (e) {
        // Silent fail if Discord not open or command fails in web
      }
    };

    updatePresence();
  }, [typing.view]);

  // 11. Background Image Sync: Apply custom background to CSS variable
  const { backgroundImage } = useSettingsStore();
  useEffect(() => {
    if (backgroundImage) {
      document.body.style.setProperty('--bg-image', `url("${backgroundImage}")`);
    } else {
      document.body.style.removeProperty('--bg-image');
    }
  }, [backgroundImage]);

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
            (typing.view === 'typing' || typing.view === 'duel') ? undefined : (
              <SideNav
                syncing={isSyncing}
                items={[
                  { id: 'dashboard', icon: <HomeIcon />, label: 'Dashboard', onClick: () => typing.setView('dashboard'), active: typing.view === 'dashboard' },
                  { id: 'practice', icon: <PracticeIcon />, label: 'Practice', onClick: () => typing.setView('selection'), active: typing.view === 'selection' || typing.view === 'typing' },
                  { id: 'analytics', icon: <AnalyticsIcon />, label: 'Analytics', onClick: () => typing.setView('analytics'), active: typing.view === 'analytics' },
                  { id: 'coach', icon: <Brain size={20} />, label: 'AI Coach', onClick: () => typing.setView('coach'), active: typing.view === 'coach' },
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
            )
          }
          topbar={
            <ModernTopBar
              title="TYPINGPRO EXPERT ENGINE"
              typing={typing}
              stats={{
                wpm: (typing.view === 'typing' || typing.view === 'duel')
                  ? Math.round(typing.metrics.adjusted_wpm)
                  : (useAuthStore.getState().profile?.highest_wpm || 0),
                accuracy: (typing.view === 'typing' || typing.view === 'duel')
                  ? Math.round(typing.metrics.accuracy)
                  : (useAuthStore.getState().profile?.avg_accuracy || 100),
                rank: getRankForWPM(useAuthStore.getState().profile?.highest_wpm || 0).name,
                rankIcon: getRankForWPM(useAuthStore.getState().profile?.highest_wpm || 0).icon,
                streak: useAchievementStore.getState().streak.current_streak || 0
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
          {/* ThemeSwitcher already integrated in TopBar */}
          <TitleBar />
          <WhatsNewModal />
          <UsernameModal />
          <RankCelebration />
          <AchievementToast />
          <DevHud />
          <ToastContainer />

          {typing.view === 'dashboard' ? (
            <DashboardPage
              username={user?.name || 'Pro Typist'}
              wpm={Math.round(typing.metrics.adjusted_wpm) || (useAuthStore.getState().profile?.avg_wpm || 0)}
              accuracy={Math.round(typing.metrics.accuracy) || 100}
              keystones={keystones}
              streak={streakData.current_streak}
              bestWpm={useAuthStore.getState().profile?.highest_wpm || 0}
              rank={getRankForWPM(useAuthStore.getState().profile?.highest_wpm || 0).name}
              level={calculateLevel(useAuthStore.getState().profile?.rank_points || 0)}
              rankPoints={useAuthStore.getState().profile?.rank_points || 0}
              currentLesson={{
                title: typing.currentLesson?.title || 'Home Row Basics',
                stage: typing.currentLesson?.stage || 'Novice',
                targetWpm: typing.currentLesson?.targetWPM || 30,
                index: CURRICULUM.findIndex(l => l.id === typing.currentLesson?.id) + 1 || 1,
                total: CURRICULUM.length
              }}
              onStartLesson={async () => {
                const text = await SmartLessonGenerator.generateIntelligentDrill(50);
                const title = await SmartLessonGenerator.getIntelligentDrillTitle();
                const smartLesson: any = {
                  id: 'smart-ai-drill',
                  title: title,
                  description: 'AI-targeted practice based on your neural weaknesses.',
                  text: text,
                  targetWPM: Math.max(30, Math.round((useAuthStore.getState().profile?.avg_wpm || 30) + 5)),
                  focusFingers: ['All'],
                  stage: 'AI Coach'
                };
                typing.startLesson(smartLesson);
              }}
              onStartMission={(lesson: any, targetWpm: number, minAcc: number) => {
                // If lesson is null, it's a Certification Test
                if (!lesson) {
                  const certLesson: any = {
                    id: 'cert-test-current',
                    title: 'Elite Certification',
                    description: 'Official performance validation session.',
                    text: SmartLessonGenerator.generate([], 80), // Long random text for certification
                    targetWPM: targetWpm,
                    focusFingers: ['All'],
                    stage: 'Certification'
                  };
                  typing.startMission(certLesson, targetWpm, minAcc);
                } else {
                  typing.startMission(lesson, targetWpm, minAcc);
                }
              }}
              missionState={typing.missionState}
              onDeployMission={typing.deployMission}
              onResetMission={typing.resetMission}
              onConsultCoach={() => typing.setView('coach')}
              onOpenAnalytics={() => typing.setView('analytics')}
              weaknessProfile={weaknessProfile}
            />
          ) : typing.view === 'profile' ? (
            <ProtectedRoute fallbackMessage="Sign in to view your profile and stats">
              <ProfilePage />
            </ProtectedRoute>
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
              username={user?.name || 'Typist'}
              userId={user?.id || 'guest'}
              keystones={keystones}
              avgAccuracy={(() => {
                const history = useStatsStore.getState().sessionHistory;
                if (history.length === 0) return 100;
                return Math.round(history.reduce((a, b) => a + b.accuracy, 0) / history.length);
              })()}
              onBack={() => typing.setView('dashboard')}
              onCertificationAttempt={() => typing.setView('certification')}
            />
          ) : typing.view === 'certification' ? (
            <ProtectedRoute fallbackMessage="Sign in to earn and track certifications">
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
            </ProtectedRoute>
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
          ) : typing.view === 'coach' ? (
            <div className="animate-in fade-in duration-700">
              <button
                onClick={() => typing.setView('dashboard')}
                className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-primary)' }}
              >
                <ArrowLeft size={14} /> Back_To_Mainframe
              </button>
              <NeuralCoach
                onStartDrill={(drill) => {
                  const lesson: any = {
                    id: 'coach-drill-' + drill.title.toLowerCase().replace(/\s+/g, '-'),
                    title: drill.title,
                    description: 'Specially calibrated drill by your AI Coach.',
                    text: drill.text,
                    targetWPM: Math.max(30, Math.round((useAuthStore.getState().profile?.avg_wpm || 30) + 5)),
                    focusFingers: ['All'],
                    stage: 'Coach Recommendation'
                  };
                  typing.startLesson(lesson);
                }}
              />
            </div>
          ) : typing.view === 'social' ? (
            <ProtectedRoute fallbackMessage="Sign in to connect with other typists">
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
            </ProtectedRoute>
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
              juice={typing.juice}
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
