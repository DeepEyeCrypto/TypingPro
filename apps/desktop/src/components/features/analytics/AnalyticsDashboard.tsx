// ═══════════════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD: VisionOS-style deep-eye neural analysis
// ═══════════════════════════════════════════════════════════════════

import React, { useEffect, useState, useMemo } from 'react';
import { useStatsStore } from '../../../core/store/statsStore';
import { useAuthStore } from '../../../core/store/authStore';
import { WeaknessAnalyzer, WeaknessProfile } from '../../../core/weaknessAnalyzer';
import { coachService, CoachVerdict } from '../../../core/coachService';
import { GlassCard } from '../../ui/GlassCard';
import { ArrowLeft, BarChart3, Binary, Activity, Sparkles, Brain, Zap, Target, ShieldCheck, Cpu } from 'lucide-react';
import { getRankForWPM, getLevelInfo } from '../../../core/rankSystem';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartTooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const EyeIcon = ({ pulsed = false }: { pulsed?: boolean }) => (
    <div className={`relative w-24 h-24 flex items-center justify-center ${pulsed ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-[var(--text-accent)] opacity-[0.05] rounded-full blur-3xl"></div>
        <div className="w-16 h-16 rounded-3xl border border-glass flex items-center justify-center glass-panel shadow-2xl overflow-hidden bg-[var(--glass-bg)]">
            <div className={`w-6 h-6 rounded-full bg-[var(--text-accent)] opacity-20 ${pulsed ? 'animate-ping' : ''}`}></div>
            <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"></div>
        </div>
    </div>
);

interface Props {
    onBack: () => void;
    onStartDrill: (text: string) => void;
}

export const AnalyticsDashboard: React.FC<Props> = React.memo(({ onBack, onStartDrill }) => {
    const { sessionHistory } = useStatsStore();

    const stats = useMemo(() => {
        if (sessionHistory.length === 0) return { bestWpm: 0, wpm: 0, accuracy: 100, streak: 0 };
        const bestWpm = Math.max(...sessionHistory.map(s => s.wpm));
        const avgWpm = Math.round(sessionHistory.reduce((a, b) => a + b.wpm, 0) / sessionHistory.length);
        const avgAcc = Math.round(sessionHistory.reduce((a, b) => a + b.accuracy, 0) / sessionHistory.length);
        return { bestWpm, wpm: avgWpm, accuracy: avgAcc, streak: 0 };
    }, [sessionHistory]);

    const {
        bestWpm,
        wpm,
        accuracy,
    } = stats;

    const streak = stats.streak; // Or pull from achievementStore if needed

    const levelInfo = getLevelInfo(useAuthStore.getState().profile?.rank_points || 0);
    const currentRank = getRankForWPM(bestWpm);

    const [profile, setProfile] = useState<WeaknessProfile | null>(null);
    const [verdict, setVerdict] = useState<CoachVerdict | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (sessionHistory.length > 0) {
                const p = await WeaknessAnalyzer.analyzeWeaknesses(sessionHistory);
                setProfile(p);
            }
        };
        load();
    }, [sessionHistory]);

    const askCoach = async () => {
        if (!profile) return;
        setIsAnalyzing(true);
        const start = Date.now();
        try {
            const result = await coachService.analyzeUser(profile, sessionHistory);
            const elapsed = Date.now() - start;
            if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
            setVerdict(result);
        } catch (e) {
            console.error("Coach failed", e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Prepare chart data (Last 30 sessions)
    const chartData = [...sessionHistory]
        .reverse()
        .slice(-30)
        .map((s, i) => ({
            name: `S-${i + 1}`,
            wpm: s.wpm,
            accuracy: s.accuracy,
            timestamp: s.timestamp
        }));

    return (
        <div className="w-full flex flex-col gap-10 p-4 md:p-6 max-w-7xl mx-auto pb-32 animate-in fade-in duration-700">
            {/* NEURAL STATUS HEADER */}
            <div className="relative overflow-hidden bg-[var(--glass-bg)] backdrop-blur-[64px] rounded-[2.5rem] p-6 flex flex-wrap items-center justify-between gap-6 border border-glass shadow-2xl">
                {/* Scan Beam */}
                <motion.div
                    animate={{ left: ['-10%', '110%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 w-1 h-full bg-gradient-to-b from-transparent via-[var(--text-accent)] to-transparent opacity-20 blur-md z-0"
                />

                <div className="flex items-center gap-6 relative z-10">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all opacity-40 hover:opacity-100"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic block mb-1" style={{ color: 'var(--text-primary)' }}>Integrity_Verification_Lock</span>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>Performance_Lab<span className="text-[var(--text-accent)]">.v4</span></h1>
                    </div>
                </div>

                <div className="flex gap-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-primary)' }}>Sync: <span className="text-green-400">Stable</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={14} className="text-[var(--text-accent)] opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-primary)' }}>Security: <span className="text-[var(--text-accent)]">Active</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-accent)] bg-[var(--accent-soft)] px-3 py-1 rounded-full border border-[var(--text-accent)]/20 shadow-lg shadow-[var(--text-accent)]/10">
                            PRO_TIER
                        </span>
                    </div>
                </div>
            </div>

            {/* Core Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Peak Spd", value: `${bestWpm}`, unit: "WPM" },
                    { label: "Mean Spd", value: `${wpm}`, unit: "WPM" },
                    { label: "Precision", value: `${Math.round(accuracy)}`, unit: "%" },
                    { label: "Neural Loop", value: `${streak}`, unit: "DAYS" }
                ].map((m, i) => (
                    <GlassCard key={i} variant="compact" className="text-center py-6 border-b-2 border-transparent hover:border-[var(--text-accent)] transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-40" style={{ color: 'var(--text-primary)' }}>{m.label}</span>
                        <div className="text-3xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                            {m.value} <small className="text-[10px] opacity-30 font-bold">{m.unit}</small>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* AI COACH SECTION */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <GlassCard variant="large" className="relative overflow-hidden py-12 px-8">
                        {isAnalyzing && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_4px_20px_rgba(34,211,238,0.8)] animate-[scan_3s_ease-in-out_infinite] z-20"></div>
                        )}

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                            <EyeIcon pulsed={isAnalyzing} />

                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">
                                    {isAnalyzing ? "Scanning Neural Pathways..." : "DeepEye Diagnostics"}
                                </span>

                                <div className="min-h-[140px]">
                                    {isAnalyzing ? (
                                        <div className="space-y-4 font-mono text-[10px] text-[var(--text-accent)]">
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 2 }}>_ EXECUTING_DEEP_NEURAL_RECONSTRUCTION...</motion.p>
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}>_ ISOLATING_KINEMATIC_INCOHERENCE...</motion.p>
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}>_ SIGNAL_SYNC: 98.4% COMPLETED...</motion.p>
                                        </div>
                                    ) : verdict ? (
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none" style={{ color: 'var(--text-primary)' }}>
                                                {verdict.identify_habit}
                                            </h3>
                                            <p className="text-lg opacity-60 leading-relaxed font-bold" style={{ color: 'var(--text-secondary)' }}>
                                                {verdict.insight}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none opacity-20" style={{ color: 'var(--text-primary)' }}>
                                                Neural Coach Dormant
                                            </h3>
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-bold uppercase tracking-widest opacity-40">
                                                Initiate scan to decompile mechanical interference patterns.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!isAnalyzing && (
                                    <button
                                        onClick={askCoach}
                                        className="bg-[var(--text-accent)] text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transform transition-all active:scale-95 shadow-xl shadow-[var(--text-accent)]/20 hover:scale-105"
                                    >
                                        {verdict ? "Recalibrate Scan" : "Initialize Diagnostics"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {/* VELOCITY CONTINUUM (30 Session Trend) */}
                    <GlassCard variant="large" className="p-8">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 block mb-1" style={{ color: 'var(--text-primary)' }}>Velocity Continuum</span>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>Neural Trend_Line</h3>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[var(--text-accent)] shadow-[0_0_8px_var(--text-accent)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Throughput (WPM)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 opacity-30 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Precision (%)</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--text-accent)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--text-accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        hide
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        orientation="left"
                                        stroke="rgba(255,255,255,0.1)"
                                        fontSize={10}
                                        tickFormatter={(val) => `${val}`}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="rgba(255,255,255,0.1)"
                                        fontSize={10}
                                        domain={[0, 100]}
                                        hide
                                    />
                                    <RechartTooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            fontSize: '10px',
                                            fontWeight: 'bold'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="wpm"
                                        stroke="var(--text-accent)"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorWpm)"
                                        animationDuration={2000}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke="rgba(34,211,238,0.3)"
                                        strokeWidth={2}
                                        dot={false}
                                        animationDuration={2500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* RECOMENDATIONS */}
                    {verdict && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            {verdict.recommended_drills.map((drill, idx) => (
                                <GlassCard
                                    key={idx}
                                    variant="compact"
                                    className="flex flex-col justify-between py-8 px-6 group h-full"
                                    interactive
                                >
                                    <div className="space-y-4">
                                        <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-xs font-black text-gray-900 shadow-md">
                                            0{idx + 1}
                                        </div>
                                        <h3 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">{drill.title}</h3>
                                        <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">{drill.reason}</p>
                                    </div>
                                    <button
                                        onClick={() => onStartDrill(drill.text)}
                                        className="mt-8 py-2 w-full text-[10px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.2em] border-t border-white/5 pt-4"
                                    >
                                        Inject Drill Protocol
                                    </button>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTTLENECK LISTS */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                    <GlassCard title="Signal Latency" subtitle="SLOWEST KEYS" variant="compact">
                        {profile ? (
                            <div className="space-y-6 mt-4">
                                {profile.slowKeys.slice(0, 5).map(k => (
                                    <div key={k.key} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black">
                                            <span className="px-2 py-0.5 glass-pill text-gray-900 text-[9px] uppercase tracking-widest">{k.key.toUpperCase()}</span>
                                            <span className="text-white/60 tabular-nums">{Math.round(k.avgLatency)}ms</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-cyan-400 transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                                style={{ width: `${Math.min(100, (k.avgLatency / 400) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Awaiting Data</div>
                        )}
                    </GlassCard>

                    <GlassCard title="Entropy Flux" subtitle="ERROR PRONE KEYS" variant="compact">
                        {profile ? (
                            <div className="space-y-4 mt-4">
                                {profile.errorProneKeys.slice(0, 5).map(k => (
                                    <div key={k.key} className="flex items-center justify-between p-3 glass-unified group hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-lg font-black text-gray-900 shadow-md">
                                                {k.key.toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Error Rate</span>
                                                <span className="text-sm font-black text-red-400 tabular-nums">{k.errorRate.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        <div className="text-[8px] font-black text-red-400/20 uppercase tracking-tighter">CRITICAL</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Data Stream Clear</div>
                        )}
                    </GlassCard>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(480px); }
                }
            `}</style>
        </div >
    );
});
