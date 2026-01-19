import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, AlertTriangle, ChevronRight, RotateCcw, Target, ShieldCheck, Activity, Clock } from 'lucide-react'

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
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`relative w-full max-w-2xl glass-panel p-10 shadow-2xl border-2 ${passed ? 'border-[var(--text-accent)]/30' : 'border-red-500/30'}`}
          style={{ color: 'var(--text-primary)' }}
        >
          {/* Status Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${passed ? 'bg-[var(--text-accent)]/20 text-[var(--text-accent)]' : 'bg-red-500/20 text-red-500'}`}
            >
              {passed ? <Trophy size={40} /> : <AlertTriangle size={40} />}
            </motion.div>
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">
              {passed ? 'Protocol Passed' : 'Protocol Failed'}
            </h2>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-[0.3em] uppercase ${passed ? 'bg-[var(--text-accent)]/10 text-[var(--text-accent)]' : 'bg-red-500/10 text-red-500'}`}>
              Session_Logs_Finalized
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <MetricItem icon={Activity} label="Net Speed" value={`${net} WPM`} active={wpmOk} highlight />
            <MetricItem icon={Target} label="Target" value={`${targetWPM} WPM`} dim />
            <MetricItem icon={ShieldCheck} label="Accuracy" value={`${Math.round(stats.accuracy)}%`} active={accuracyOk} />
            <MetricItem icon={Activity} label="Consistency" value={`${Math.round(stats.consistency)}%`} />
            <MetricItem icon={AlertTriangle} label="Errors" value={stats.errorCount} active={stats.errorCount === 0} danger={stats.errorCount > 0} />
            <MetricItem icon={Clock} label="Duration" value={formatTime(stats.timeTaken)} />
          </div>

          {/* Feedback & Errors */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <p className={`text-sm font-semibold tracking-wide uppercase italic mb-4 ${passed ? 'text-[var(--text-accent)]' : 'text-red-400'}`}>
              {feedbackMessage}
            </p>
            {topErrors.length > 0 && (
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>Critical Weaknesses:</span>
                <div className="flex gap-2">
                  {topErrors.map(([char, count]) => (
                    <span key={char} className="px-2 py-0.5 rounded-md bg-white/10 border border-white/5">
                      '{char}' ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              {passed ? 'Protocol Select' : 'Retry Protocol'}
            </button>
            {onNext && passed && (
              <button
                onClick={onNext}
                className="flex-1 py-4 rounded-2xl bg-[var(--text-accent)] text-white hover:opacity-90 transition-all font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-[var(--text-accent)]/20"
              >
                <span>Proceed_To_Next</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

const MetricItem = ({ icon: Icon, label, value, active, dim, highlight, danger }: any) => (
  <div className={`p-4 rounded-2xl border transition-all ${highlight ? 'bg-[var(--text-accent)]/10 border-[var(--text-accent)]/20' :
      danger ? 'bg-red-500/5 border-red-500/10' :
        'bg-white/5 border-white/10'
    } ${dim ? 'opacity-50' : ''}`}>
    <div className="flex items-center gap-2 mb-1 opacity-60">
      <Icon size={12} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className={`text-xl font-black tracking-tighter ${active ? 'text-[var(--text-accent)]' :
        danger ? 'text-red-400' :
          'text-[var(--text-primary)]'
      }`}>
      {value}
    </div>
  </div>
)
