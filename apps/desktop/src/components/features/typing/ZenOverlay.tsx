import { useState, useEffect, useCallback, useRef } from 'react'
import { SmartLessonGenerator } from '../../../utils/SmartLessonGenerator'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Target, X, Maximize2 } from 'lucide-react'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { useRustAudio } from '../../../hooks/useRustAudio'

export const ZenOverlay = () => {
    const { playTypingSound } = useRustAudio()
    const [text, setText] = useState('')
    const [input, setInput] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0 })
    const [startTime, setStartTime] = useState<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const loadDrill = useCallback(async () => {
        const drill = await SmartLessonGenerator.generateIntelligentDrill(12)
        setText(drill)
        setInput('')
        setIsComplete(false)
        setStartTime(null)
        setStats({ wpm: 0, accuracy: 0 })
    }, [])

    useEffect(() => {
        loadDrill()
    }, [loadDrill])

    const calculateStats = useCallback((currentInput: string) => {
        if (!startTime) return

        const now = Date.now()
        const minutes = (now - startTime) / 1000 / 60
        const wordsTyped = currentInput.length / 5
        const currentWpm = Math.round(wordsTyped / minutes) || 0

        let correctChars = 0
        for (let i = 0; i < currentInput.length; i++) {
            if (currentInput[i] === text[i]) correctChars++
        }
        const currentAccuracy = Math.round((correctChars / currentInput.length) * 100) || 0

        setStats({ wpm: currentWpm, accuracy: currentAccuracy })
    }, [startTime, text])

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isComplete) return

        if (e.key === 'Escape') {
            const win = WebviewWindow.getCurrent()
            win.hide()
            return
        }

        if (e.key.length === 1 && input.length < text.length) {
            if (!startTime) setStartTime(Date.now())

            const char = e.key
            const targetChar = text[input.length]

            if (char === targetChar) {
                playTypingSound('mechanical')
            } else {
                playTypingSound('error')
            }

            const newInput = input + char
            setInput(newInput)
            calculateStats(newInput)

            if (newInput.length === text.length) {
                setIsComplete(true)
                playTypingSound('mechanical') // Extra confirmation
                setTimeout(() => loadDrill(), 1500)
            }
        } else if (e.key === 'Backspace') {
            const newInput = input.slice(0, -1)
            setInput(newInput)
            playTypingSound('backspace')
            if (newInput.length > 0) calculateStats(newInput)
        }
    }, [input, text, isComplete, startTime, calculateStats, playTypingSound, loadDrill])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 flex flex-col items-center justify-center p-8 select-none overflow-hidden"
            style={{
                background: 'var(--bg-color)',
                color: 'var(--text-primary)'
            }}
            data-tauri-drag-region
        >
            {/* 1. Background Layers */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-transparent" style={{ backgroundImage: 'var(--bg-image)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1, filter: 'blur(20px)' }} />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px]" />

                {/* Neural Pulse Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[var(--text-accent)] blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.1, 0.05],
                        rotate: [360, 180, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-[var(--text-accent)] blur-[150px]"
                />
            </div>
            {/* Top Bar / Drag Handle */}
            <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-8 z-50 group/top" data-tauri-drag-region>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--text-accent)] animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 group-hover/top:opacity-100 transition-opacity italic">Neural.Zen_v1.2</span>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => WebviewWindow.getCurrent().hide()}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--text-accent)] transition-all"
                    >
                        <X size={16} className="opacity-40" />
                    </button>
                </div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                <AnimatePresence mode="wait">
                    {!isComplete ? (
                        <motion.div
                            key="typing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-8"
                        >
                            <div className="text-4xl lg:text-5xl font-black tracking-tighter leading-snug text-center">
                                {text.split('').map((char, idx) => {
                                    const inputChar = input[idx]
                                    const isCurrent = idx === input.length
                                    let statusColor = 'opacity-20'
                                    if (inputChar !== undefined) {
                                        statusColor = inputChar === char ? 'text-[var(--text-primary)]' : 'text-red-500 underline decoration-red-500/50'
                                    }

                                    return (
                                        <span
                                            key={idx}
                                            className={`transition-all duration-300 ${statusColor} ${isCurrent ? 'border-b-4 border-[var(--text-accent)] shadow-[0_4px_10px_var(--text-accent)]/20 px-0.5' : ''} ${char === ' ' ? 'mx-2' : ''}`}
                                        >
                                            {char === ' ' && isCurrent ? '_' : char}
                                        </span>
                                    )
                                })}
                            </div>

                            <div className="flex items-center justify-center gap-12 pt-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-1">Velocity</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black italic">{stats.wpm}</span>
                                        <span className="text-[10px] font-bold opacity-40">WPM</span>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-current opacity-10" />
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-1">Precision</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black italic">{stats.accuracy}</span>
                                        <span className="text-[10px] font-bold opacity-40">%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-4 py-8"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-[var(--text-accent)] flex items-center justify-center text-white shadow-2xl shadow-[var(--text-accent)]/40 mb-2">
                                <Zap size={32} strokeWidth={3} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic">Drill Decoded</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Synchronizing neural pathways...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--text-accent)]/5 blur-[120px] rounded-full pointer-events-none" />
        </div>
    )
}
