import React from 'react'
import { TypingMetrics } from '@src/lib/tauri'
import './GatekeeperModal.css'

interface GatekeeperModalProps {
  metrics: TypingMetrics,
  targetWPM: number,
  passed: boolean,
  onClose: () => void,
  onNext?: () => void
}

export const GatekeeperModal = ({
  metrics,
  targetWPM,
  passed,
  onClose,
  onNext
}: GatekeeperModalProps) => {
  const accuracyOk = Math.round(metrics.accuracy) === 100
  const wpmOk = Math.round(metrics.raw_wpm) >= targetWPM

  return (
    <div className="modal-overlay">
      <div className="gatekeeper-card liquid-glass-card">
        <h2 className={`status-title ${passed ? 'passed' : 'failed'}`}>
          {passed ? 'Protocol Passed' : 'Protocol Failed'}
        </h2>

        <div className="result-grid">
          <div className={`result-item ${wpmOk ? 'ok' : 'fail'}`}>
            <span className="label">Speed</span>
            <span className="value">
              {Math.round(metrics.raw_wpm)} / {targetWPM} WPM
            </span>
          </div>
          <div className={`result-item ${accuracyOk ? 'ok' : 'fail'}`}>
            <span className="label">Accuracy</span>
            <span className="value">{Math.round(metrics.accuracy)}% / 100%</span>
          </div>
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
