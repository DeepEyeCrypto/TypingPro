import React, { useState } from 'react'
import { TypingMetrics } from '@src/lib/tauri'
import { useAuthStore } from '@src/stores/authStore'
import { AuthButtonGoogle } from './AuthButtonGoogle'
import { AuthButtonGithub } from './AuthButtonGithub'
import { AccountAvatar } from './AccountAvatar'
import { SyncIndicator } from './SyncIndicator'
import { SettingsPanel } from './SettingsPanel'
import './TopBar.css'

interface TopBarProps {
  metrics: TypingMetrics,
  mode: string,
  onAnalyticsClick: () => void
}

export const TopBar = ({ metrics, mode, onAnalyticsClick }: TopBarProps) => {
  const { user } = useAuthStore()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="top-bar">
      <div className="mode-indicator">
        <span className="label">Mode</span>
        <span className="value">{mode}</span>
      </div>
      <div className="stats-indicator">
        <div className="stat">
          <span className="label">WPM</span>
          <span className="value text-white">{Math.round(metrics.raw_wpm)}</span>
        </div>
        <div className="stat">
          <span className="label">Accuracy</span>
          <span className="value text-white">{Math.round(metrics.accuracy)}%</span>
        </div>
      </div>
      <div className="top-bar-right">
        <SyncIndicator />

        <button className="icon-btn" onClick={onAnalyticsClick} title="Analytics">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
        </button>

        {user ? (
          <AccountAvatar />
        ) : (
          <div className="auth-icons">
            <AuthButtonGoogle />
            <AuthButtonGithub />
          </div>
        )}

        <button className="icon-btn gear-btn" onClick={() => setShowSettings(true)} title="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      <style>{`
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .icon-btn {
          background: transparent;
          border: none;
          color: #444444;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          padding: 4px;
        }
        .icon-btn:hover {
          color: #ffffff;
        }
        .gear-btn:hover {
          transform: rotate(45deg);
        }
        .auth-icons {
          display: flex;
          gap: 0.5rem;
        }
        .auth-btn {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.03);
          border: 0.5px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #888888;
        }
        .auth-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
      `}</style>
    </div>
  )
}
