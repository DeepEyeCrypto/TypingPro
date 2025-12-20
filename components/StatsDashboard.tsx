import React, { useState, useMemo, memo } from 'react';
import { HistoryEntry } from '../types';
import { X, TrendingUp, Activity, Target, Clock, Calendar, BarChart3, Fingerprint, AlertCircle } from 'lucide-react';
import { LESSONS } from '../constants';
import { useApp } from '../contexts/AppContext';
import PerformanceGraph from './analytics/PerformanceGraph';
import { useHeatmap } from './analytics/HeatmapOverlay';
import VirtualKeyboard from './VirtualKeyboard';

interface StatsDashboardProps {
    history: HistoryEntry[];
    onClose: () => void;
}

type TimeRange = 'week' | 'month' | 'all';

const StatsDashboard: React.FC<StatsDashboardProps> = memo(({ history, onClose }) => {
    const { settings } = useApp();
    const [timeRange, setTimeRange] = useState<TimeRange>('all');
    const heatmapData = useHeatmap(history);

    // --- Data Processing ---

    const filteredHistory = useMemo(() => {
        const now = new Date();
        return history.filter(entry => {
            const date = new Date(entry.date);
            if (timeRange === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return date >= weekAgo;
            }
            if (timeRange === 'month') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return date >= monthAgo;
            }
            return true;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [history, timeRange]);

    const stats = useMemo(() => {
        if (filteredHistory.length === 0) return { avgWpm: 0, bestWpm: 0, avgAcc: 0, totalTime: 0 };

        const totalWpm = filteredHistory.reduce((acc, curr) => acc + curr.wpm, 0);
        const totalAcc = filteredHistory.reduce((acc, curr) => acc + curr.accuracy, 0);
        const maxWpm = filteredHistory.reduce((acc, curr) => Math.max(acc, curr.wpm), 0);
        const totalDuration = filteredHistory.reduce((acc, curr) => acc + curr.durationSeconds, 0);

        return {
            avgWpm: Math.round(totalWpm / filteredHistory.length),
            bestWpm: maxWpm,
            avgAcc: Math.round(totalAcc / filteredHistory.length),
            totalTime: Math.round(totalDuration / 60) // minutes
        };
    }, [filteredHistory]);

    const enemyKeys = useMemo(() => {
        const errors: Record<string, number> = {};
        filteredHistory.forEach(h => {
            h.keystrokeLog?.filter(k => k.isError).forEach(k => {
                errors[k.expectedChar] = (errors[k.expectedChar] || 0) + 1;
            });
        });
        return Object.entries(errors)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
    }, [filteredHistory]);

    const historicalWpmData = useMemo(() => {
        return filteredHistory.map(h => ({
            timestamp: new Date(h.date).getTime(),
            wpm: h.wpm
        }));
    }, [filteredHistory]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/60 backdrop-blur-2xl p-4 md:p-8 animate-in fade-in zoom-in duration-300">
            <div className="w-full max-w-6xl glass-card-modern shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border-white/20 dark:border-white/10 p-0">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 bg-white/10 dark:bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <BarChart3 className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Performance Insight</h2>
                            <p className="text-xs font-bold text-slate-500 dark:text-white/20 uppercase tracking-widest">Premium Analytics Suite</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="glass-segmented">
                            {(['all', 'month', 'week'] as TimeRange[]).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${timeRange === range
                                        ? 'bg-white dark:bg-white/10 text-sky-500 shadow-xl'
                                        : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50'
                                        }`}
                                >
                                    {range === 'all' ? 'All Time' : range === 'month' ? '30 Days' : '7 Days'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl text-slate-400 dark:text-white/30 transition-all active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Avg Speed', val: `${stats.avgWpm} WPM`, icon: Activity, color: 'text-sky-500' },
                            { label: 'Personal Best', val: `${stats.bestWpm} WPM`, icon: TrendingUp, color: 'text-emerald-500' },
                            { label: 'Accuracy', val: `${stats.avgAcc}%`, icon: Target, color: 'text-rose-500' },
                            { label: 'Total Practice', val: `${stats.totalTime}m`, icon: Clock, color: 'text-amber-500' },
                        ].map((kpi, idx) => (
                            <div key={idx} className="glass-card p-6 rounded-[32px] border border-white/10 relative overflow-hidden group">
                                <div className="text-[10px] font-black text-slate-400 dark:text-white/20 mb-2 uppercase tracking-widest flex items-center gap-2">
                                    <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} /> {kpi.label}
                                </div>
                                <div className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">{kpi.val}</div>
                                <div className="absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform">
                                    <kpi.icon className="w-24 h-24" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Performance Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <PerformanceGraph data={historicalWpmData} height={300} />
                        </div>

                        {/* Error Forensics */}
                        <div className="glass-card p-8 rounded-[40px] border border-white/10 flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertCircle className="text-rose-500 w-5 h-5" />
                                <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Error Forensics</h3>
                            </div>
                            <div className="space-y-4 flex-1">
                                {enemyKeys.length > 0 ? enemyKeys.map(([char, count]) => (
                                    <div key={char} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5 group hover:border-rose-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center font-black text-rose-500 text-lg border border-rose-500/20">
                                                {char === ' ' ? '␣' : char}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">Enemy Key</p>
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase">Mistyped {count} times</p>
                                            </div>
                                        </div>
                                        <div className="text-rose-500 font-black text-xs">{(count / filteredHistory.length).toFixed(1)}/session</div>
                                    </div>
                                )) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-30">
                                        <Target className="w-12 h-12 mb-4" />
                                        <p className="text-sm font-bold uppercase tracking-widest">No flaws detected yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Keyboard Heatmap Analysis */}
                    <div className="glass-card p-10 rounded-[48px] border border-white/10 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Keystroke Heatmap</h3>
                                <p className="text-sm font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">Speed & Accuracy Distribution</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 group">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                    <span className="text-[10px] font-black text-white/40 uppercase">Elite</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500/50" />
                                    <span className="text-[10px] font-black text-white/40 uppercase">Lagging</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 scale-95 origin-center">
                            <VirtualKeyboard
                                activeKey={null}
                                pressedKeys={new Set()}
                                layout={settings.keyboardLayout}
                                osLayout={settings.osLayout}
                                heatmapData={heatmapData}
                            />
                        </div>

                        {/* Background Polish */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />
                    </div>

                    {/* Historical Activity Table */}
                    <div className="glass-card rounded-[40px] border border-white/10 overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Recent Activity</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Lesson</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">WPM</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Accuracy</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Efficiency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[...filteredHistory].reverse().slice(0, 8).map(entry => (
                                        <tr key={entry.id} className="hover:bg-white/5 transition-all group">
                                            <td className="px-8 py-5 text-sm font-bold text-slate-400 dark:text-white/40">
                                                {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-5 text-sm font-black text-slate-800 dark:text-white">
                                                {LESSONS.find(l => l.id === entry.lessonId)?.title || `Lesson ${entry.lessonId}`}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-lg font-black text-sky-500">{entry.wpm}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-tight ${entry.accuracy >= 98 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                                                    {entry.accuracy}%
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-white/40 uppercase">L: {entry.handEfficiency?.left || 0}%</span>
                                                    <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                        <div className="h-full bg-sky-500" style={{ width: `${entry.handEfficiency?.left || 0}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default StatsDashboard;
