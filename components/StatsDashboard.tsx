
import React, { useState, useMemo, memo } from 'react';
import { HistoryEntry } from '../types';
import { X, TrendingUp, Activity, Target, Clock, Calendar } from 'lucide-react';
import { LESSONS } from '../constants';
import HeatmapAnalyzer from './stats/HeatmapAnalyzer';
import { useApp } from '../contexts/AppContext';

interface StatsDashboardProps {
    history: HistoryEntry[];
    onClose: () => void;
}

type TimeRange = 'week' | 'month' | 'all';
type Metric = 'wpm' | 'accuracy';

const StatsDashboard: React.FC<StatsDashboardProps> = memo(({ history, onClose }) => {
    const { fingerStats } = useApp();
    const [timeRange, setTimeRange] = useState<TimeRange>('all');
    const [metric, setMetric] = useState<Metric>('wpm');

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

    const lessonPerformance = useMemo(() => {
        const grouping: Record<number, { wpmSum: number, count: number, accSum: number }> = {};
        filteredHistory.forEach(h => {
            if (!grouping[h.lessonId]) grouping[h.lessonId] = { wpmSum: 0, count: 0, accSum: 0 };
            grouping[h.lessonId].wpmSum += h.wpm;
            grouping[h.lessonId].accSum += h.accuracy;
            grouping[h.lessonId].count += 1;
        });

        return Object.keys(grouping).map(id => {
            const g = grouping[Number(id)];
            return {
                id: Number(id),
                avgWpm: Math.round(g.wpmSum / g.count),
                avgAcc: Math.round(g.accSum / g.count)
            };
        }).sort((a, b) => a.id - b.id);
    }, [filteredHistory]);

    // --- SVG Charts Helper ---

    const getPoints = (data: number[], height: number, width: number) => {
        if (data.length < 2) return "";
        const max = Math.max(...data) * 1.1 || 100;
        const min = Math.min(...data) * 0.9 || 0;
        const range = max - min || 1;
        const stepX = width / (data.length - 1);

        return data.map((val, idx) => {
            const x = idx * stepX;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card-modern w-full max-w-5xl shadow-[0_32px_128px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] overflow-hidden border-white/40 dark:border-white/10 p-0">

                {/* Header */}
                <div className="flex items-center justify-between px-10 py-8 bg-white/30 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Performance</h2>
                        <p className="text-sm font-medium text-slate-400 dark:text-white/30">Your journey towards typing mastery</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="glass-segmented shadow-sm">
                            {(['all', 'month', 'week'] as TimeRange[]).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${timeRange === range
                                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50'
                                        }`}
                                >
                                    {range === 'all' ? 'All' : range === 'month' ? '30D' : '7D'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl text-slate-400 dark:text-white/20 transition-all active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="text-[10px] font-black text-slate-400 dark:text-white/20 mb-1 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-sky-500" /> Avg Speed
                            </div>
                            <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{stats.avgWpm} <span className="text-sm font-medium text-slate-400 dark:text-white/20">WPM</span></div>
                        </div>

                        <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="text-[10px] font-black text-slate-400 dark:text-white/20 mb-1 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Peak
                            </div>
                            <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{stats.bestWpm} <span className="text-sm font-medium text-slate-400 dark:text-white/20">WPM</span></div>
                        </div>

                        <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="text-[10px] font-black text-slate-400 dark:text-white/20 mb-1 uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-3.5 h-3.5 text-rose-500" /> Accuracy
                            </div>
                            <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{stats.avgAcc}%</div>
                        </div>

                        <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                            <div className="text-[10px] font-black text-slate-400 dark:text-white/20 mb-1 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-amber-500" /> Dedication
                            </div>
                            <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{stats.totalTime} <span className="text-sm font-medium text-slate-400 dark:text-white/20">MINS</span></div>
                        </div>
                    </div>

                    {/* Scientific Analytics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <div className="lg:col-span-1">
                            <HeatmapAnalyzer fingerStats={fingerStats} />
                        </div>
                        <div className="lg:col-span-2 bg-white/40 dark:bg-white/5 p-8 rounded-[32px] border border-black/5 dark:border-white/10 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Velocity Trend</h3>
                                <div className="glass-segmented shadow-sm">
                                    <button
                                        onClick={() => setMetric('wpm')}
                                        className={`px-4 py-1.5 text-[10px] font-bold rounded-xl transition-all ${metric === 'wpm' ? 'bg-white dark:bg-white/10 text-sky-500 shadow-sm' : 'text-slate-400 dark:text-white/20'}`}
                                    >WPM</button>
                                    <button
                                        onClick={() => setMetric('accuracy')}
                                        className={`px-4 py-1.5 text-[10px] font-bold rounded-xl transition-all ${metric === 'accuracy' ? 'bg-white dark:bg-white/10 text-emerald-500 shadow-sm' : 'text-slate-400 dark:text-white/20'}`}
                                    >ACC</button>
                                </div>
                            </div>

                            <div className="h-[250px] w-full flex items-end gap-2 relative">
                                {filteredHistory.length < 2 ? (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-white/10 text-sm border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
                                        Gathering data coordinates...
                                    </div>
                                ) : (
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 250">
                                        <polyline
                                            points={getPoints(filteredHistory.map(h => metric === 'wpm' ? h.wpm : h.accuracy), 250, 1000)}
                                            fill="none"
                                            stroke={metric === 'wpm' ? '#0ea5e9' : '#10b981'}
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lesson Breakdown */}
                        <div className="bg-white/40 dark:bg-white/5 p-8 rounded-[32px] border border-black/5 dark:border-white/10 shadow-sm flex flex-col">
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Milestones</h3>
                            <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                                {lessonPerformance.map(lp => (
                                    <div key={lp.id} className="group">
                                        <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest">
                                            <span className="text-slate-400 dark:text-white/30">Lesson {lp.id}</span>
                                            <span className="text-sky-500">{lp.avgWpm} WPM</span>
                                        </div>
                                        <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-sky-500/50 rounded-full transition-all group-hover:bg-sky-500"
                                                style={{ width: `${Math.min(100, (lp.avgWpm / (stats.bestWpm || 100)) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                {lessonPerformance.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-white/10 text-sm italic">No records found</div>
                                )}
                            </div>
                        </div>

                        {/* Recent Session List (iOS Style Table) */}
                        <div className="lg:col-span-2 bg-white/40 dark:bg-white/5 rounded-[32px] border border-black/5 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-8 py-6 border-b border-black/5 dark:border-white/5 font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">
                                Recent Activity
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[350px] scrollbar-hide">
                                <table className="w-full text-left text-xs">
                                    <thead className="text-slate-400 dark:text-white/20 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-8 py-4 font-bold">Date</th>
                                            <th className="px-8 py-4 font-bold">Session</th>
                                            <th className="px-8 py-4 font-bold">Speed</th>
                                            <th className="px-8 py-4 font-bold">Correctness</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                        {[...filteredHistory].reverse().slice(0, 10).map(entry => (
                                            <tr key={entry.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                                                <td className="px-8 py-4 text-slate-500 dark:text-white/40 font-medium">{new Date(entry.date).toLocaleDateString()}</td>
                                                <td className="px-8 py-4 text-slate-800 dark:text-white font-bold">{LESSONS.find(l => l.id === entry.lessonId)?.title || `Lesson ${entry.lessonId}`}</td>
                                                <td className="px-8 py-4 font-black text-sky-500">{entry.wpm}</td>
                                                <td className="px-8 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tight ${entry.accuracy >= 95 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                        {entry.accuracy}%
                                                    </span>
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
        </div>
    );
});

export default StatsDashboard;
