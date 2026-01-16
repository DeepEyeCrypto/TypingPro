import React, { useEffect, useState } from 'react';
import { useStatsStore } from '../../stores/statsStore';
import { WeaknessAnalyzer, WeaknessProfile } from '../../services/weaknessAnalyzer';
import { coachService, CoachVerdict } from '../../services/coachService';
import { useTyping } from '../../hooks/useTyping';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft } from 'lucide-react';
import { StatMinimal as StatItem } from '../layout/TopBar';

// Icons
const EyeIcon = ({ pulsed = false }: { pulsed?: boolean }) => (
    <div className={`relative w-20 h-20 flex items-center justify-center ${pulsed ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl"></div>
        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-xl shadow-2xl">
            <div className={`w-4 h-4 rounded-full bg-white opacity-40 ${pulsed ? 'animate-ping' : ''}`}></div>
            <div className="absolute w-1 h-1 rounded-full bg-white"></div>
        </div>
    </div>
);

interface Props {
    onBack: () => void;
    onStartDrill: (text: string) => void;
}

export const AnalyticsDashboard: React.FC<Props> = React.memo(({ onBack, onStartDrill }) => {
    const { sessionHistory, stats } = useStatsStore();

    // Safely destructure with defaults to prevent crash if stats is undefined
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
        <div className="w-full h-full text-white p-4 sm:p-6 lg:p-10 overflow-y-auto custom-scrollbar animate-in fade-in duration-700">
            {/* Header Profile Summary */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 lg:mb-16">
                <div className="flex items-center gap-4 lg:gap-8">
                    <button
                        onClick={onBack}
                        className="p-3 lg:p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all group border border-white/10"
                    >
                        <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h3 className="text-[10px] font-black opacity-30 tracking-[0.5em] uppercase mb-1 lg:mb-2">Intelligence_Terminal</h3>
                        <h1 className="text-3xl lg:text-6xl font-black tracking-tighter uppercase leading-none">
                            ANALYTICS_<span className="opacity-20">CORE</span>
                        </h1>
                    </div>
                </div>

                <div className="flex gap-4 lg:gap-6 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <StatItem label="RANK" value={rank} />
                    <StatItem label="LEVEL" value={level} />
                </div>
            </header>

            {/* Primary Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-16">
                <MetricCard label="PEAK_VELOCITY" value={`${bestWpm} WPM`} subtext="HISTORICAL_MAX" />
                <MetricCard label="AVG_VELOCITY" value={`${wpm} WPM`} subtext="CONSISTENCY_INDEX" />
                <MetricCard label="PRECISION_INDEX" value={`${Math.round(accuracy)}%`} subtext="MECHANICAL_ACCURACY" className="hidden sm:flex" />
                <MetricCard label="STREAK_STABILITY" value={`${streak}D`} subtext="OPERATIONAL_CONTINUITY" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
                {/* 1. DeepEye Insight (Hero) */}
                <div className="lg:col-span-3 space-y-8 lg:space-y-12">
                    <Card className="relative overflow-hidden p-8 lg:p-16 glass-perfect">
                        {/* Scan Line Animation */}
                        {isAnalyzing && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] animate-[scan_3s_ease-in-out_infinite] z-20"></div>
                        )}

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12 relative z-10">
                            <EyeIcon pulsed={isAnalyzing} />

                            <div className="flex-1 space-y-4 lg:space-y-6 text-center md:text-left">
                                <h2 className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.4em]">
                                    {isAnalyzing ? "Processing_Neuro_Latency..." : "Intelligence_Briefing"}
                                </h2>

                                <div className="min-h-[120px]">
                                    {isAnalyzing ? (
                                        <div className="space-y-4 font-mono text-sm text-white opacity-60">
                                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                                <span className="animate-pulse opacity-40">_</span>
                                                <span className="tracking-widest uppercase text-[10px] font-black">Syncing kinetic velocity curves...</span>
                                            </div>
                                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                                <span className="animate-pulse opacity-40">_</span>
                                                <span className="tracking-widest uppercase text-[10px] font-black">Decompiling mechanical interference...</span>
                                            </div>
                                        </div>
                                    ) : verdict ? (
                                        <div className="space-y-4 lg:space-y-6">
                                            <h3 className="text-2xl lg:text-4xl font-bold tracking-tighter text-white leading-none uppercase">
                                                {verdict.identify_habit}
                                            </h3>
                                            <p className="text-lg lg:text-xl text-white opacity-60 leading-relaxed font-medium">
                                                {verdict.insight}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 lg:space-y-6">
                                            <h3 className="text-2xl lg:text-4xl font-black text-white leading-none tracking-tighter uppercase italic">
                                                AI_COACHING_STANDBY
                                            </h3>
                                            <p className="text-white opacity-40 text-lg leading-relaxed font-medium">
                                                Synthesizing session data to uncover physiological bottlenecks.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!isAnalyzing && (
                                    <div className="pt-6 lg:pt-10 flex justify-center md:justify-start border-t border-white/5">
                                        <Button
                                            onClick={askCoach}
                                            variant="primary"
                                            className="w-full sm:w-auto min-w-[200px] lg:min-w-[240px] !py-4 lg:!py-5 !rounded-full shadow-2xl"
                                        >
                                            {verdict ? "REFRESH_TACTICAL_SCAN" : "INITIATE_TACTICAL_SCAN"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Drills Section */}
                    {verdict && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
                            {verdict.recommended_drills.map((drill, idx) => (
                                <Card
                                    key={idx}
                                    className="p-6 lg:p-10 flex flex-col justify-between group hover:bg-white/10 glass-perfect"
                                >
                                    <div className="space-y-3 lg:space-y-4">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <span className="text-[10px] font-black text-white">0{idx + 1}</span>
                                        </div>
                                        <h3 className="text-lg lg:text-xl font-bold text-white tracking-tighter uppercase leading-none">
                                            {drill.title}
                                        </h3>
                                        <p className="text-[11px] lg:text-xs text-white opacity-40 leading-relaxed font-medium">
                                            {drill.reason}
                                        </p>
                                    </div>
                                    <div className="mt-8 lg:mt-10">
                                        <Button
                                            onClick={() => onStartDrill(drill.text)}
                                            variant="secondary"
                                            className="w-full !rounded-full !py-2.5 lg:!py-3 backdrop-blur-md"
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
                <div className="space-y-8 lg:space-y-12">
                    {/* Weakness Map List */}
                    <Card className="p-6 lg:p-10 space-y-6 lg:space-y-8 glass-perfect">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.4em]">Heat_Map</h3>
                            <span className="text-[8px] font-black text-white opacity-60 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/10">LATENCY</span>
                        </div>

                        {profile ? (
                            <div className="space-y-5 lg:space-y-6">
                                {profile.slowKeys.slice(0, 5).map(k => (
                                    <div key={k.key} className="space-y-2 lg:space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black">
                                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-white opacity-60 uppercase tracking-widest">
                                                {k.key.toUpperCase()}
                                            </span>
                                            <span className="text-white tabular-nums tracking-[0.2em]">{Math.round(k.avgLatency)}ms</span>
                                        </div>
                                        <div className="h-1.5 lg:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white/40 transition-all duration-1000 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                                                style={{ width: `${Math.min(100, (k.avgLatency / 400) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 lg:py-20 flex flex-col items-center justify-center text-center space-y-4 lg:space-y-6">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-white/5 rounded-full blur-xl animate-pulse" />
                                    <span className="text-white opacity-20 text-xl lg:text-2xl relative z-10">?</span>
                                </div>
                                <p className="text-[10px] font-black text-white opacity-20 tracking-[0.4em] uppercase">Standby_For_Data</p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6 lg:p-10 space-y-6 lg:space-y-8 glass-perfect">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white opacity-30 uppercase tracking-[0.4em]">Fracture_Points</h3>
                            <span className="text-[8px] font-black text-white opacity-60 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/10">PRECISION</span>
                        </div>

                        {profile ? (
                            <div className="space-y-5 lg:space-y-6">
                                {profile.errorProneKeys.slice(0, 5).map(k => (
                                    <div key={k.key} className="flex items-center justify-between group p-3 lg:p-4 border border-white/10 bg-white/[0.03] rounded-xl lg:rounded-2xl hover:bg-white/5 transition-all">
                                        <div className="flex items-center gap-4 lg:gap-5">
                                            <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl text-white font-black text-base lg:text-lg shadow-xl backdrop-blur-md">
                                                {k.key.toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-white opacity-30 uppercase tracking-widest">ERROR_RATE</span>
                                                <span className="text-base lg:text-lg font-black text-white tabular-nums tracking-tighter">{k.errorRate.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        <div className="text-[8px] lg:text-[10px] font-black text-white/40 uppercase tracking-tighter">Critical</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 lg:py-20 flex flex-col items-center justify-center text-center space-y-4 lg:space-y-6">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-white/5 rounded-full blur-xl animate-pulse" />
                                    <span className="text-white opacity-20 text-xl lg:text-2xl relative z-10">✓</span>
                                </div>
                                <p className="text-[10px] font-black text-white opacity-20 tracking-[0.4em] uppercase">Clean_Biosync</p>
                            </div>
                        )}
                    </Card>
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

const MetricCard: React.FC<{ label: string; value: string; subtext: string; className?: string }> = ({ label, value, subtext, className }) => (
    <div className={`p-4 lg:p-8 bg-black/5 border border-black/10 rounded-xl lg:rounded-[2.5rem] flex flex-col relative overflow-hidden group hover:bg-white/10 transition-all ${className}`}>
        <span className="text-[8px] lg:text-[10px] font-black opacity-30 tracking-widest uppercase mb-2 lg:mb-4">{label}</span>
        <span className="text-xl lg:text-3xl font-black mb-1 lg:mb-2">{value}</span>
        <span className="text-[7px] lg:text-[9px] font-bold opacity-20 uppercase tracking-wider">{subtext}</span>
    </div>
);

const InsightItem: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => (
    <div className="flex gap-4 items-start group">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <h4 className="text-sm lg:text-base font-black text-white opacity-80 uppercase tracking-tight mb-1">{title}</h4>
            <p className="text-[11px] lg:text-xs text-white opacity-40 font-medium leading-relaxed">{description}</p>
        </div>
    </div>
);
