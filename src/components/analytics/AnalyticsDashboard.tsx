import React, { useEffect, useState } from 'react';
import { useStatsStore } from '../../stores/statsStore';
import { WeaknessAnalyzer, WeaknessProfile } from '../../services/weaknessAnalyzer';
import { coachService, CoachVerdict } from '../../services/coachService';
import { useTyping } from '../../hooks/useTyping';
import { Card } from '../ui/Card';
import { StatDisplay } from '../ui/StatDisplay';
import { Button } from '../ui/Button';

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

export const AnalyticsDashboard: React.FC<Props> = React.memo(({ onBack, onStartDrill }) => {
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
        <div className="w-full h-full text-white/90 p-8 overflow-y-auto animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" onClick={onBack} className="text-white/40 hover:text-white">
                        ← BACK_TO_STRATEGY
                    </Button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase">
                        Tactical <span className="text-hacker">Analysis</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-hacker/10 border border-hacker/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-hacker animate-pulse"></div>
                        <span className="text-[10px] font-bold text-hacker tracking-widest uppercase">Biometric_Feed_Live</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* 1. DeepEye Insight (Hero) */}
                <div className="lg:col-span-3 space-y-8">
                    <Card
                        className="relative overflow-hidden p-8 bg-midnight/40"
                    >
                        {/* Scan Line Animation */}
                        {isAnalyzing && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-hacker/50 shadow-[0_0_20px_#00ffc3] animate-[scan_2s_ease-in-out_infinite]"></div>
                        )}

                        <div className="flex items-start gap-8">
                            <EyeIcon pulsed={isAnalyzing} />

                            <div className="flex-1 space-y-4">
                                <h2 className="text-xs font-black text-hacker uppercase tracking-[0.3em]">
                                    {isAnalyzing ? "Processing_Micro_Latency..." : "Intelligence_Briefing"}
                                </h2>

                                <div className="min-h-[100px]">
                                    {isAnalyzing ? (
                                        <div className="space-y-2 font-mono text-sm text-hacker/60">
                                            <div className="flex items-center gap-2">
                                                <span className="animate-pulse">_</span>
                                                <span>Extracting keystroke velocity curves...</span>
                                            </div>
                                            <div className="flex items-center gap-2 delay-700 animate-in fade-in fill-mode-both">
                                                <span className="animate-pulse">_</span>
                                                <span>Calculating error-distribution entropy...</span>
                                            </div>
                                            <div className="flex items-center gap-2 delay-1000 animate-in fade-in fill-mode-both">
                                                <span className="animate-pulse">_</span>
                                                <span>Synchronizing with tactical database...</span>
                                            </div>
                                        </div>
                                    ) : verdict ? (
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">
                                                {verdict.identify_habit}
                                            </h3>
                                            <p className="text-lg text-white/60 leading-relaxed font-medium">
                                                {verdict.insight}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-bold text-white/40 italic leading-tight">
                                                AI_COACHING_STANDBY
                                            </h3>
                                            <p className="text-white/30 text-lg leading-relaxed">
                                                Analyze your last {sessionHistory.length} sessions to uncover mechanical patterns and optimize your muscle memory through deep-learning heuristics.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!isAnalyzing && !verdict && (
                                    <div className="pt-6 border-t border-white/5">
                                        <Button
                                            onClick={askCoach}
                                            variant="primary"
                                        >
                                            INITIATE_TACTICAL_SCAN
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Drills Section */}
                    {verdict && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
                            {verdict.recommended_drills.map((drill, idx) => (
                                <Card
                                    key={idx}
                                    className="p-6 flex flex-col justify-between group hover:border-hacker/30"
                                >
                                    <div className="space-y-3">
                                        <div className="w-8 h-8 rounded bg-hacker/5 border border-hacker/10 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-hacker">0{idx + 1}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-hacker transition-colors">
                                            {drill.title}
                                        </h3>
                                        <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
                                            {drill.reason}
                                        </p>
                                    </div>
                                    <div className="mt-6">
                                        <Button
                                            onClick={() => onStartDrill(drill.text)}
                                            variant="secondary"
                                            size="sm"
                                            className="w-full"
                                        >
                                            START_DRILL
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Stats Column */}
                <div className="space-y-8">
                    {/* Weakness Map List */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Hotspots</h3>
                            <span className="text-[10px] font-bold text-hacker bg-hacker/10 px-2 py-0.5 rounded">LATENCY</span>
                        </div>

                        {profile ? (
                            <div className="space-y-4">
                                {profile.slowKeys.slice(0, 5).map(k => (
                                    <div key={k.key} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white uppercase">
                                                KEY_{k.key.toUpperCase()}
                                            </span>
                                            <span className="text-white/40 tabular-nums tracking-widest">{Math.round(k.avgLatency)}ms</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-hacker transition-all duration-1000"
                                                style={{ width: `${Math.min(100, (k.avgLatency / 300) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-10 h-10 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                                    <span className="text-white/10">?</span>
                                </div>
                                <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase">Waiting_For_Data</p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Frequent_Errors</h3>
                            <span className="text-[10px] font-bold text-warn bg-warn/10 px-2 py-0.5 rounded text-rose-400">PRECISION</span>
                        </div>

                        {profile ? (
                            <div className="space-y-5">
                                {profile.errorProneKeys.slice(0, 5).map(k => (
                                    <div key={k.key} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 flex items-center justify-center bg-rose-500/5 border border-rose-500/20 rounded text-rose-400 font-black text-xs group-hover:bg-rose-500/20 transition-colors">
                                                {k.key.toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-white/60">ERROR_RATE</span>
                                                <span className="text-xs font-black text-white tabular-nums">{k.errorRate.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        <div className="h-6 w-px bg-white/5"></div>
                                        <div className="text-[10px] font-bold text-rose-400/50 uppercase tracking-tighter">Critical</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-10 h-10 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                                    <span className="text-white/10">!</span>
                                </div>
                                <p className="text-[10px] font-bold text-white/20 tracking-widest uppercase">Clean_Record</p>
                            </div>
                        )}
                    </Card>
                </div>

            </div>
        </div>
    );
}); // End memo
