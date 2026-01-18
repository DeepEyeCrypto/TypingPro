// ═══════════════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD: VisionOS-style deep-eye neural analysis
// ═══════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { useStatsStore } from '../../../core/store/statsStore';
import { WeaknessAnalyzer, WeaknessProfile } from '../../../core/weaknessAnalyzer';
import { coachService, CoachVerdict } from '../../../core/coachService';
import { GlassCard } from '../../ui/GlassCard';
import { ArrowLeft } from 'lucide-react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const EyeIcon = ({ pulsed = false }: { pulsed?: boolean }) => (
    <div className={`relative w-24 h-24 flex items-center justify-center ${pulsed ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center glass-unified shadow-2xl">
            <div className={`w-5 h-5 rounded-full bg-cyan-400 opacity-40 ${pulsed ? 'animate-ping' : ''}`}></div>
            <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"></div>
        </div>
    </div>
);

interface Props {
    onBack: () => void;
    onStartDrill: (text: string) => void;
}

export const AnalyticsDashboard: React.FC<Props> = React.memo(({ onBack, onStartDrill }) => {
    const { sessionHistory, stats } = useStatsStore();

    const {
        bestWpm = 0,
        wpm = 0,
        accuracy = 100,
        streak = 0,
        rank = 'UNRANKED',
        level = 1
    } = stats || {};

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

    return (
        <div className="w-full flex flex-col gap-10 p-4 md:p-6 max-w-7xl mx-auto pb-32 animate-in fade-in duration-700">

            {/* Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="glass-pill p-3 text-gray-900 shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block mb-1">Neural Statistics</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                            DeepEye<span className="not-italic text-white/20">.Analytics</span>
                        </h1>
                    </div>
                </div>

                <div className="flex gap-6 items-center">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Protocol Rank</span>
                        <span className="text-xl font-black text-white italic">{rank}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Growth Level</span>
                        <span className="text-xl font-black text-cyan-400">LVL {level}</span>
                    </div>
                </div>
            </header>

            {/* Core Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Peak Spd", value: `${bestWpm}`, unit: "WPM" },
                    { label: "Mean Spd", value: `${wpm}`, unit: "WPM" },
                    { label: "Precision", value: `${Math.round(accuracy)}`, unit: "%" },
                    { label: "Neural Loop", value: `${streak}`, unit: "DAYS" }
                ].map((m, i) => (
                    <GlassCard key={i} variant="compact" className="text-center py-6">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">{m.label}</span>
                        <div className="text-3xl font-black text-white tracking-tighter">
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
                                        <div className="space-y-4 font-mono text-xs text-cyan-400/60">
                                            <p className="animate-pulse">_ DECODING_PHYSIOLOGICAL_BOTTLENECKS...</p>
                                            <p className="animate-pulse delay-700">_ SYNCING_SIGNAL_VELOCITY_CURVES...</p>
                                            <p className="animate-pulse delay-1000">_ CALIBRATING_INTERFERENCE_MAP...</p>
                                        </div>
                                    ) : verdict ? (
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                                                {verdict.identify_habit}
                                            </h3>
                                            <p className="text-lg text-white/60 leading-relaxed font-bold">
                                                {verdict.insight}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black text-white/20 tracking-tighter uppercase italic leading-none">
                                                Neural Coach Dormant
                                            </h3>
                                            <p className="text-white/40 text-sm leading-relaxed font-bold uppercase tracking-widest">
                                                Initiate scan to decompile mechanical interference patterns.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!isAnalyzing && (
                                    <button
                                        onClick={askCoach}
                                        className="glass-pill px-10 py-4 text-xs font-black text-gray-900 shadow-xl uppercase tracking-widest transform transition-all active:scale-95"
                                    >
                                        {verdict ? "Recalibrate Scan" : "Initialize Diagnostics"}
                                    </button>
                                )}
                            </div>
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
        </div>
    );
});
