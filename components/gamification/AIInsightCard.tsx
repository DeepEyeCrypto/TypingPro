import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, AlertTriangle, Play } from 'lucide-react';

interface AIInsightCardProps {
    insights: {
        enemyKeys: { char: string; avgHold: number }[];
        bottlenecks: { pair: string; avgLat: number }[];
    };
    onStartDrill: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insights, onStartDrill }) => {
    const hasData = insights.enemyKeys.length > 0 || insights.bottlenecks.length > 0;

    if (!hasData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-8 p-6 rounded-[24px] bg-sky-500/5 border border-sky-500/10 backdrop-blur-sm overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Brain size={120} />
            </div>

            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                    <Brain size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">AI Coaching Analysis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Bottlenecks */}
                {insights.bottlenecks.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-2 mb-3 text-amber-500">
                            <Zap size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Speed Bottlenecks</span>
                        </div>
                        <div className="space-y-3">
                            {insights.bottlenecks.map((b, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-slate-700 dark:text-white font-mono uppercase tracking-[0.2em]">{b.pair}</span>
                                    <span className="text-xs font-bold text-slate-400">{Math.round(b.avgLat)}ms transition</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hesitation Keys */}
                {insights.enemyKeys.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-2 mb-3 text-rose-500">
                            <AlertTriangle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Hesitation Keys</span>
                        </div>
                        <div className="space-y-3">
                            {insights.enemyKeys.map((k, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-slate-700 dark:text-white font-mono uppercase">{k.char === ' ' ? 'SPC' : k.char}</span>
                                    <span className="text-xs font-bold text-slate-400">{Math.round(k.avgHold)}ms hold</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={onStartDrill}
                className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-sky-500/20 group"
            >
                <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                    <Play size={14} fill="currentColor" />
                </div>
                <span>START ADAPTIVE REMEDIAL DRILL</span>
            </button>
        </motion.div>
    );
};
