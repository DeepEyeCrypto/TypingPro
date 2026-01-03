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
    errorsDetail?: Record<string, number>
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


  const net = Math.round(stats.netWpm)
  const gap = Math.max(0, targetWPM - net)

  // Dynamic Feedback
  let feedbackMessage = ''
  if (!wpmOk) {
    feedbackMessage = `You were ${gap} WPM short of the target. Pick up the pace!`
  } else if (!accuracyOk) {
    feedbackMessage = `Precision is non-negotiable. 100% accuracy is required to advance.`
  } else {
    // Success Messages
    const successMessages = [
      "Hypersonic speed achieved. Systems nominal.",
      "Target destroyed. You are ready for the next protocol.",
      "Synchronization complete. Performance exceeds expectations.",
      "Neural link stable. Excellent work."
    ]
    feedbackMessage = successMessages[Math.floor(Math.random() * successMessages.length)]
  }

  // Top Errors Analysis
  const topErrors = stats.errorsDetail
    ? Object.entries(stats.errorsDetail)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
    : []

  return (
    <div className="modal-overlay">
      <div className={`gatekeeper-card liquid-glass-card ${passed ? 'passed-glow' : 'failed-glow'}`}>
        <h2 className={`status-title ${passed ? 'passed' : 'failed'}`}>
          {passed ? 'Protocol Passed' : 'Protocol Failed'}
        </h2>

        <div className="result-grid">
          {/* Row 1: Net vs Target */}
          <div className="result-item ok">
            <span className="label">Net WPM</span>
            <span className="value">{net}</span>
          </div>
          <div className={`result-item ${wpmOk ? 'dim' : 'fail'}`} style={{ opacity: wpmOk ? 0.6 : 1 }}>
            <span className="label">Target</span>
            <span className="value">{targetWPM}</span>
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
          {topErrors.length > 0 && (
            <span className="error-summary">
              | Missed: {topErrors.map(([char, count]) => (
                <span key={char} className="missed-key">'{char}' ({count}) </span>
              ))}
            </span>
          )}
        </div>

        <p className={`status-message ${passed ? 'passed' : 'failed'}`}>
          {feedbackMessage}
        </p>

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
