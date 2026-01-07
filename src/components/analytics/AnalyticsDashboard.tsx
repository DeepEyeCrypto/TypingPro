import React, { useEffect, useState } from 'react';
import { useStatsStore } from '../../stores/statsStore';
import { WeaknessAnalyzer, WeaknessProfile } from '../../services/weaknessAnalyzer';
import { coachService, CoachVerdict } from '../../services/coachService';
import { useTyping } from '../../hooks/useTyping';

// Icons
const EyeIcon = ({ pulsed = false }: { pulsed?: boolean }) => (
    <div className={`relative w-12 h-12 flex items-center justify-center ${pulsed ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-black">
            <div className={`w-3 h-3 rounded-full bg-cyan-400 ${pulsed ? 'animate-ping' : ''}`}></div>
        </div>
    </div>
);

interface Props {
    onBack: () => void;
    onStartDrill: (text: string) => void;
}

export const AnalyticsDashboard: React.FC<Props> = ({ onBack, onStartDrill }) => {
    const { sessionHistory, lessonStats } = useStatsStore();
    const [profile, setProfile] = useState<WeaknessProfile | null>(null);
    const [verdict, setVerdict] = useState<CoachVerdict | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Initial Load: Standard Weakness Analysis
    useEffect(() => {
        const load = async () => {
            if (sessionHistory.length > 0) {
                const p = await WeaknessAnalyzer.analyzeWeaknesses(sessionHistory);
                setProfile(p);
            }
        };
        load();
    }, [sessionHistory]);

    // AI Trigger
    const askCoach = async () => {
        if (!profile) return;
        setIsAnalyzing(true);
        // Add artificial delay for effect if response is too fast
        const start = Date.now();

        try {
            const result = await coachService.analyzeUser(profile, sessionHistory);

            // Ensure at least 1.5s "thinking" time
            const elapsed = Date.now() - start;
            if (elapsed < 1500) await new Promise(r => setTimeout(r, 1500 - elapsed));

            setVerdict(result);
        } catch (e) {
            console.error("Coach failed", e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full h-full bg-[#050505] text-white p-8 overflow-y-auto font-mono">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
                        ← BACK
                    </button>
                    <h1 className="text-2xl font-bold tracking-wider text-cyan-400">TACTICAL ANALYSIS</h1>
                </div>
                <div className="text-xs text-white/30">
                    DEEPEYE v1.2 // CONNECTED
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. DeepEye Insight (Hero) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                        {/* Scan Line Animation */}
                        {isAnalyzing && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]"></div>
                        )}

                        <div className="flex items-start gap-6">
                            <EyeIcon pulsed={isAnalyzing} />

                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-cyan-400 mb-2">
                                    {isAnalyzing ? "ANALYZING BIOMETRICS..." : verdict ? verdict.identify_habit : "COACH STATUS: STANDBY"}
                                </h2>

                                <div className="text-white/80 min-h-[80px] leading-relaxed">
                                    {isAnalyzing ? (
                                        <span className="animate-pulse text-cyan-500/50 block mt-2">
                                            > Extracting keystroke latency patterns...<br />
                                            > correlating error spikes...<br />
                                            > querying tactical database...
                                        </span>
                                    ) : verdict ? (
                                        <p className="typing-effect text-lg">{verdict.insight}</p>
                                    ) : (
                                        <p className="text-white/40 italic">
                                            "I can analyze your last {sessionHistory.length} sessions to identify subtle mechanical weaknesses invisible to the naked eye."
                                        </p>
                                    )}
                                </div>

                                {!isAnalyzing && !verdict && (
                                    <button
                                        onClick={askCoach}
                                        className="mt-6 bg-cyan-900/30 border border-cyan-500/50 px-6 py-2 rounded text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all font-bold tracking-widest text-sm"
                                    >
                                        [ INITIATE ANALYSIS ]
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Drills Section (Only shows if verdict exists) */}
                    {verdict && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            {verdict.recommended_drills.map((drill, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded hover:bg-white/10 transition-colors flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-cyan-400 font-bold text-sm mb-1 line-clamp-1">{drill.title}</h3>
                                        <p className="text-white/50 text-xs mb-4 h-10 overflow-hidden">{drill.reason}</p>
                                    </div>
                                    <button
                                        onClick={() => onStartDrill(drill.text)}
                                        className="w-full py-2 bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 text-xs tracking-wider transition-all"
                                    >
                                        START DRILL
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Stats Column */}
                <div className="space-y-6">
                    {/* Weakness Map List (Mini) */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white/50 text-xs uppercase mb-4 tracking-widest">Latency Hotspots</h3>
                        {profile ? (
                            <div className="space-y-3">
                                {profile.slowKeys.slice(0, 5).map(k => (
                                    <div key={k.key} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 flex items-center justify-center bg-red-900/50 border border-red-500/30 rounded text-red-400 font-bold">
                                                {k.key.toUpperCase()}
                                            </span>
                                            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-500"
                                                    style={{ width: `${Math.min(100, (k.avgLatency / 300) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className="text-white/40 tabular-nums">{Math.round(k.avgLatency)}ms</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-white/30 text-xs">No data available.</div>
                        )}
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white/50 text-xs uppercase mb-4 tracking-widest">Error Frequent</h3>
                        {profile ? (
                            <div className="space-y-3">
                                {profile.errorProneKeys.slice(0, 5).map(k => (
                                    <div key={k.key} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 flex items-center justify-center bg-amber-900/50 border border-amber-500/30 rounded text-amber-400 font-bold">
                                                {k.key.toUpperCase()}
                                            </span>
                                            <span className="text-white/60 text-xs">{k.errorRate.toFixed(1)}% Error Rate</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-white/30 text-xs">No data.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
