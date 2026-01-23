import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Target, ArrowRight, ShieldCheck, Activity, Award, ChevronRight } from 'lucide-react';
import { coachService, CoachVerdict } from '../../../core/coachService';
import { WeaknessAnalyzer, WeaknessProfile } from '../../../core/weaknessAnalyzer';
import { useStatsStore } from '../../../core/store/statsStore';
import { Button } from '../../ui/Button';

interface NeuralCoachProps {
    onStartDrill: (drill: { title: string, text: string }) => void;
}

export const NeuralCoach: React.FC<NeuralCoachProps> = ({ onStartDrill }) => {
    const [verdict, setVerdict] = useState<CoachVerdict | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { sessionHistory } = useStatsStore();

    const fetchAnalysis = async () => {
        setIsLoading(true);
        const profile = await WeaknessAnalyzer.loadProfile();
        if (profile) {
            const result = await coachService.analyzeUser(profile, sessionHistory);
            setVerdict(result);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 rounded-full border-t-2 border-[var(--text-accent)] mb-6 shadow-[0_0_20px_var(--text-accent)]"
                />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse" style={{ color: 'var(--text-primary)' }}>
                    Analyzing_Neural_Patterns...
                </p>
            </div>
        );
    }

    if (!verdict) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-3xl bg-[var(--text-accent)] flex items-center justify-center text-white shadow-2xl">
                    <Brain size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic" style={{ color: 'var(--text-primary)' }}>Neural_Coach</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40" style={{ color: 'var(--text-primary)' }}>Generative_Expert_Intelligence_v5.4</p>
                </div>
            </div>

            {/* Main Insight Card */}
            <div className="glass-panel rounded-[4rem] p-12 lg:p-16 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-1" style={{ color: 'var(--text-primary)' }}>Habit_Severity</span>
                        <div className="text-4xl font-black italic text-[var(--text-accent)]">{verdict.habit_score}/10</div>
                    </div>
                </div>

                <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-[var(--text-accent)]" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic" style={{ color: 'var(--text-primary)' }}>Core_Diagnostic</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-6 leading-none" style={{ color: 'var(--text-primary)' }}>
                        {verdict.identify_habit}
                    </h2>
                    <p className="text-xl font-bold opacity-60 leading-relaxed mb-12" style={{ color: 'var(--text-primary)' }}>
                        "{verdict.insight}"
                    </p>
                </div>
            </div>

            {/* Recommended Drills */}
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40" style={{ color: 'var(--text-primary)' }}>Correction_Protocols</h2>
                    <div className="flex-1 h-px border-t border-white/10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {verdict.recommended_drills.map((drill, i) => (
                        <div
                            key={i}
                            className="glass-panel rounded-[3rem] p-8 transition-all hover:bg-[var(--glass-hover)] group cursor-pointer"
                            onClick={() => onStartDrill({ title: drill.title, text: drill.text })}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] border border-[var(--text-accent)]/20 flex items-center justify-center text-[var(--text-accent)] mb-6 transition-transform group-hover:scale-110">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-lg font-black uppercase italic mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>{drill.title}</h3>
                            <p className="text-[10px] font-bold opacity-50 mb-6 leading-relaxed" style={{ color: 'var(--text-primary)' }}>{drill.reason}</p>

                            <div className="flex items-center gap-2 text-[var(--text-accent)] font-black text-[9px] uppercase tracking-widest group-hover:gap-4 transition-all">
                                Initialize_Drill <ChevronRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Refresh Button */}
            <div className="pt-8 flex justify-center">
                <button
                    onClick={fetchAnalysis}
                    className="px-8 py-3 rounded-2xl glass-panel hover:bg-[var(--glass-hover)] text-[10px] font-black uppercase tracking-[0.4em] transition-all opacity-40 hover:opacity-100"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Recalibrate_Coach
                </button>
            </div>
        </div>
    );
};
