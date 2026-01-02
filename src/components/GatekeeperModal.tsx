import React from 'react'
import { TypingMetrics } from '@src/lib/tauri'
import './GatekeeperModal.css'

interface GatekeeperModalProps {
  stats: {
    rawWpm: number
    netWpm: number
    accuracy: number
    consistency: number
    errorCount: number
    timeTaken: number
    totalKeystrokes: number
  },
  targetWPM: number
  passed: boolean
  onClose: () => void
  onNext?: () => void
}

export const GatekeeperModal = ({
  stats,
  targetWPM,
  passed,
  onClose,
  onNext
}: GatekeeperModalProps) => {
  const accuracyOk = Math.round(stats.accuracy) === 100
  const wpmOk = Math.round(stats.rawWpm) >= targetWPM

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="modal-overlay">
      <div className={`gatekeeper-card liquid-glass-card ${passed ? 'passed-glow' : 'failed-glow'}`}>
        <h2 className={`status-title ${passed ? 'passed' : 'failed'}`}>
          {passed ? 'Protocol Passed' : 'Protocol Failed'}
        </h2>

        <div className="result-grid">
          {/* Row 1 */}
          <div className={`result-item ${wpmOk ? 'ok' : 'fail'}`}>
            <span className="label">Raw WPM</span>
            <span className="value">{Math.round(stats.rawWpm)}</span>
          </div>
          <div className="result-item ok">
            <span className="label">Net WPM</span>
            <span className="value">{Math.round(stats.netWpm)}</span>
          </div>

          {/* Row 2 */}
          <div className={`result-item ${accuracyOk ? 'ok' : 'fail'}`}>
            <span className="label">Accuracy</span>
            <span className="value">{Math.round(stats.accuracy)}%</span>
          </div>
          <div className="result-item ok">
            <span className="label">Consistency</span>
            <span className="value">{Math.round(stats.consistency)}%</span>
          </div>

          {/* Row 3 */}
          <div className="result-item fail">
            <span className="label">Errors</span>
            <span className="value">{stats.errorCount}</span>
          </div>
          <div className="result-item ok">
            <span className="label">Time</span>
            <span className="value">{formatTime(stats.timeTaken)}</span>
          </div>
        </div>

        <div className="keystrokes-bar">
          <span>Keystrokes: {stats.totalKeystrokes}</span>
        </div>

        {!passed && (
          <p className="failure-hint">
            Precision is non-negotiable. 100% accuracy and target speed are required to unlock next stage.
          </p>
        )}

        <div className="button-group">
          <button onClick={onClose} className="btn-secondary">
            {passed ? 'Manual Select' : 'Retry Protocol'}
          </button>
          {passed && onNext && (
            <button onClick={onNext} className="btn-primary">
              Next Lesson
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
