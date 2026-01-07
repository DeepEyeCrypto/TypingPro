import React, { useEffect, useRef } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/core'
import { useAuthStore } from '../../../src/stores/authStore'
import { useTyping } from '../../../src/hooks/useTyping'
import { useSettingsStore } from '../../../src/stores/settingsStore'
import { syncService } from '../../../src/services/syncService'
import { TopBar } from '../../../src/components/TopBar'
import { TypingArea } from '../../../src/components/TypingArea'
import { LessonSelector } from '../../../src/components/LessonSelector'
import { GatekeeperModal } from '../../../src/components/GatekeeperModal'
import { AnalyticsDashboard } from '../../../src/components/AnalyticsDashboard'
import { CURRICULUM } from '../../../src/data/lessons'
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
import DuelArena from '../../../src/components/social/DuelArena'

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
              // Store persistence is handled by setAuthenticated now

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
      }).catch(e => console.error('Deep link init failed:', e))

      // 4. Initial Sync if logged in
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
        <div
          className={`main-layout theme-${theme} glass-root dynamic-bg`}
          style={{ fontFamily: `'${fontFamily}', sans-serif` }}
          onClick={() => inputRef.current?.focus()}
        >
          <TitleBar />
          <WhatsNewModal />
          <UsernameModal />
          <RankCelebration />
          <TopBar
            metrics={typing.metrics}
            mode={typing.currentLesson ? typing.currentLesson.stage : 'Curriculum'}
            onAnalyticsClick={() => typing.setView('analytics')}
            onSocialClick={() => typing.setView('social')}
          />

          <main className="main-content">
            {typing.view === 'selection' ? (
              <LessonSelector
                unlockedIds={typing.unlockedIds}
                completedIds={typing.completedIds}
                onSelect={typing.startLesson}
              />
            ) : typing.view === 'analytics' ? (
              <AnalyticsDashboard onBack={() => typing.setView('selection')} />
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
                // Add navigation to Lobby
                onNavigateToLobby={() => typing.setView('lobby')}
              />
            ) : typing.view === 'lobby' ? (
              <Lobby
                onBack={() => typing.setView('social')}
                onMatchFound={(matchId) => {
                  typing.setActiveMatchId(matchId)
                  // Start a specific lesson for the duel? 
                  // For MVP, just random lesson or lesson_1
                  const duelLesson = CURRICULUM[0]; // TODO: Getting lesson from match data is better
                  typing.startLesson(duelLesson);
                  typing.setView('duel');
                }}
              />
            ) : typing.view === 'duel' && typing.activeMatchId ? (
              <DuelArena
                matchId={typing.activeMatchId}
                onBack={() => {
                  typing.setActiveMatchId(null)
                  typing.setView('social')
                }}
                typingProps={typing}
              />
            ) : (
              <TypingArea
                targetText={typing.currentLesson?.text || ''}
                input={typing.input}
                activeChar={typing.activeChar}
                onBack={() => typing.setView('selection')}
                onKeyDown={(e) => typing.onKeyDown(e.nativeEvent)} // Pass event handler
                isPaused={typing.isPaused}
                ghostReplay={typing.ghostReplay}
              />
            )}
          </main>

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

          <footer className="status-bar">
            <span>DeepEyeSniper v2.0 // Focus Protocol: Active</span>
          </footer>

          <style>{`
            .main-layout {
              height: 100vh;
              width: 100vw;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              position: relative;
              transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                          color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                          backdrop-filter 0.5s ease;
              backdrop-filter: blur(0px);
            }
            
            /* ... existing styles ... */
            .theme-classic { background-color: #050505; color: #d1d0c5; }
            .theme-glass { background-color: #000000; color: #ffffff; }
            .theme-high-contrast { background-color: #ffffff; color: #000000; }
            
            .theme-high-contrast .status-bar { border-color: #eeeeee; color: #666666; }
            .theme-high-contrast .top-bar { border-color: #eeeeee; }

            .main-content {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 64px 5% 32px 5%;
            }
            .status-bar {
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.5rem;
              text-transform: uppercase;
              letter-spacing: 0.5em;
              color: #222222;
              border-top: 0.5px solid rgba(255, 255, 255, 0.03);
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export default App
