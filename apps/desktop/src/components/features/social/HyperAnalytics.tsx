import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Target, Cpu, AlertTriangle, Info, Terminal, MousePointer2, Zap } from 'lucide-react';

interface AnalyticsSummary {
    average_latency: number;
    accuracy: number;
    heatmap: Record<string, number>;
}

export const HyperAnalytics: React.FC = () => {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await invoke<AnalyticsSummary>('get_analytics_summary');
                setSummary(data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 3000);
        return () => clearInterval(interval);
    }, []);

    const getKeyStyle = (latency: number) => {
        if (!latency) return { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.05)' };
        const intensity = Math.min(latency / 500, 1);
        const color = `color-mix(in srgb, var(--text-accent), #ff4d4d ${intensity * 100}%)`;
        return {
            backgroundColor: `rgba(255, 255, 255, 0.05)`,
            borderColor: color,
            boxShadow: `0 0 ${10 * intensity}px ${color}`,
            color: color
        };
    };

    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    return (
        <div className="relative overflow-hidden bg-white/5 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-3xl">
            {/* Internal Scan Beam */}
            <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--text-accent)] to-transparent opacity-10 blur-sm pointer-events-none z-0"
            />

            <div className="flex justify-between items-center mb-12 relative z-10">
                <div className="flex items-center gap-3">
                    <Activity size={14} className="text-[var(--text-accent)] opacity-40" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Neural_Hyper_Analytics</h2>
                </div>
                <div className="flex gap-6">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px] shadow-2xl">
                        <div className="flex items-center justify-center gap-2 mb-1 opacity-30">
                            <Zap size={10} />
                            <label className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Lat_Mean</label>
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{Math.round(summary?.average_latency || 0)}<small className="text-[10px] opacity-30 not-italic ml-1">MS</small></span>
                    </div>
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px] shadow-2xl">
                        <div className="flex items-center justify-center gap-2 mb-1 opacity-30">
                            <Target size={10} />
                            <label className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Sync_Acc</label>
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter text-[var(--text-accent)]">{Math.round(summary?.accuracy || 0)}<small className="text-[10px] opacity-30 not-italic ml-1">%</small></span>
                    </div>
                </div>
            </div>

            <div className="mb-12 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <Terminal size={12} className="opacity-20" />
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic" style={{ color: 'var(--text-primary)' }}>3D_Neural_Heatmap_Visualizer</label>
                </div>

                <div className="flex flex-col gap-3 scale-90 lg:scale-100 origin-left">
                    {keys.map((row, i) => (
                        <div key={i} className={`flex gap-3 ${i === 1 ? 'ml-8' : i === 2 ? 'ml-16' : ''}`}>
                            {row.map(key => {
                                const latency = summary?.heatmap[key.toLowerCase()] || 0;
                                const style = getKeyStyle(latency);
                                return (
                                    <motion.div
                                        layout
                                        key={key}
                                        className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center relative shadow-sm transition-all duration-700 overflow-hidden group"
                                        style={style}
                                    >
                                        <span className={`text-sm font-black uppercase tracking-widest ${latency > 0 ? '' : 'opacity-20'}`}>{key}</span>
                                        {latency > 0 && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.4 }}
                                                className="text-[8px] font-black absolute bottom-2"
                                            >
                                                {Math.round(latency)}
                                            </motion.span>
                                        )}
                                        {/* Internal glow for active keys */}
                                        {latency > 0 && (
                                            <div className="absolute inset-0 bg-current opacity-10 animate-pulse" />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Cpu size={14} className="opacity-30" />
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic" style={{ color: 'var(--text-primary)' }}>Neural_Fatigue_Monitor</label>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--text-accent)]/10 border border-[var(--text-accent)]/20 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)] shadow-[0_0_8px_var(--text-accent)] animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-accent)]">Active_Scan</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative w-full h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((summary?.average_latency || 0) / 10, 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--text-accent)] via-purple-500 to-red-500 shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                        />
                    </div>
                    <div className="flex justify-between px-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-20" style={{ color: 'var(--text-primary)' }}>Normal_Flow</span>
                            <div className="w-8 h-0.5 bg-green-500 opacity-20" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={10} className="text-red-500 opacity-40" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-20" style={{ color: 'var(--text-primary)' }}>Critical_Strain</span>
                            </div>
                            <div className="w-8 h-0.5 bg-red-500 opacity-20" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

