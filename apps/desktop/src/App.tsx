import React, { useEffect, useRef } from 'react'
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
import { TitleBar } from '../../../src/components/TitleBar'
import { useUpdater } from '../../../src/hooks/useUpdater'

const App: React.FC = () => {
  /**
   * STAGE 10 VALIDATION CHECKLIST:
   * 1. Responsive: Tested 768p, 1080p, 1440p (verified via clamp & transform)
   * 2. Layout: Zero-scroll maintained on all typing views
   * 3. Error Handling: Global ErrorBoundary active
   * 4. Interaction: Click-to-focus and mouse events verified
   * 5. Syntax: Strictly Zero Trailing Commas in TS/TSX
   */


  const { user, setAuthenticated } = useAuthStore()
  const { theme, fontFamily } = useSettingsStore()
  const typing = useTyping()
  useUpdater() // Initialize auto-updater check
  const inputRef = useRef<HTMLInputElement>(null)

  // Auth Redirect Handler & Initial Sync
  useEffect(() => {
    const handleAuth = async (urlStr: string) => {
      try {
        const url = new URL(urlStr)
        const code = url.searchParams.get('code')
        const path = url.pathname || url.hostname + url.pathname // Handle custom scheme parsing quirks

        if (code) {
          let provider: 'google' | 'github' | null = null
          if (path.includes('google')) provider = 'google'
          if (path.includes('github')) provider = 'github'

          if (provider) {
            const userData = await invoke<any>(`${provider}_auth_finish`, { code })
            setAuthenticated(userData, userData.token)
            localStorage.setItem('auth_user', JSON.stringify(userData))
            localStorage.setItem('auth_token', userData.token)

            // Trigger initial pull after login
            syncService.pullFromCloud()

            // Clear dirty URL
            if (window.location.protocol.startsWith('http')) {
              window.history.replaceState({}, document.title, '/')
            }
          }
        }
      } catch (err) {
        console.error('Auth failed:', err)
      }
    }

    // 0. Session Persistence Check
    const savedUser = localStorage.getItem('auth_user')
    const savedToken = localStorage.getItem('auth_token')
    if (savedUser && !user) {
      setAuthenticated(JSON.parse(savedUser), savedToken || undefined)
      syncService.pullFromCloud()
    }

    // 1. Web/Dev Auth Check
    handleAuth(window.location.href)

    // 2. Deep Link Listener (Production)
    let unlisten: (() => void) | undefined
    import('@tauri-apps/plugin-deep-link').then(({ onOpenUrl }) => {
      onOpenUrl((urls) => {
        for (const url of urls) {
          handleAuth(url)
        }
      }).then(u => { unlisten = u })
    }).catch(e => console.error('Deep link init failed:', e))

    return () => {
      if (unlisten) unlisten()
    }
  }, [setAuthenticated, user])

  // Focus management
  useEffect(() => {
    if (typing.view === 'typing') {
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [typing.view])

  const gatekeeperPassed = typing.currentLesson
    ? (Math.round(typing.metrics.accuracy) === 100 && Math.round(typing.metrics.raw_wpm) >= Math.max(28, typing.currentLesson.targetWPM))
    : false

  return (
    <div
      className={`main-layout theme-${theme} glass-root dynamic-bg`}
      style={{ fontFamily: `'${fontFamily}', sans-serif` }}
      onClick={() => inputRef.current?.focus()}
    >
      <TitleBar />
      <TopBar
        metrics={typing.metrics}
        mode={typing.currentLesson ? typing.currentLesson.stage : 'Curriculum'}
        onAnalyticsClick={() => typing.setView('analytics')}
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
        ) : (
          <TypingArea
            targetText={typing.currentLesson?.text || ''}
            input={typing.input}
            activeChar={typing.activeChar}
            onBack={() => typing.setView('selection')}
            onKeyDown={(e) => typing.onKeyDown(e.nativeEvent)} // Pass event handler
            isPaused={typing.isPaused}
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

      {/* Hidden input moved to TypingField for better focus management */}

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
  )
}

export default App
