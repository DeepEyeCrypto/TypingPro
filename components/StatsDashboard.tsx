
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-5xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/5">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stats Dashboard</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Deep dive into your typing performance</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                            {(['all', 'month', 'week'] as TimeRange[]).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeRange === range
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {range === 'all' ? 'All Time' : range === 'month' ? '30 Days' : '7 Days'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="glass-card p-6 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Target className="w-24 h-24" />
                            </div>
                            <div className="text-sm font-medium text-white/40 mb-1 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-500" /> Avg Speed
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.avgWpm} <span className="text-sm font-normal text-white/20">WPM</span></div>
                        </div>

                        <div className="glass-card p-6 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp className="w-24 h-24" />
                            </div>
                            <div className="text-sm font-medium text-white/40 mb-1 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" /> Top Speed
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.bestWpm} <span className="text-sm font-normal text-white/20">WPM</span></div>
                        </div>

                        <div className="glass-card p-6 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Target className="w-24 h-24" />
                            </div>
                            <div className="text-sm font-medium text-white/40 mb-1 flex items-center gap-2">
                                <Target className="w-4 h-4 text-orange-500" /> Accuracy
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.avgAcc}%</div>
                        </div>

                        <div className="glass-card p-6 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Clock className="w-24 h-24" />
                            </div>
                            <div className="text-sm font-medium text-white/40 mb-1 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-500" /> Practice Time
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.totalTime} <span className="text-sm font-normal text-white/20">mins</span></div>
                        </div>
                    </div>

                    {/* Scientific Analytics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-1">
                            <HeatmapAnalyzer fingerStats={fingerStats} />
                        </div>
                        <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performance Trend</h3>
                                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setMetric('wpm')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${metric === 'wpm' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}
                                    >WPM</button>
                                    <button
                                        onClick={() => setMetric('accuracy')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${metric === 'accuracy' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500'}`}
                                    >Accuracy</button>
                                </div>
                            </div>

                            <div className="h-[250px] w-full flex items-end gap-2 relative">
                                {filteredHistory.length < 2 ? (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                                        Not enough data for trend
                                    </div>
                                ) : (
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 250">
                                        <line x1="0" y1="0" x2="1000" y2="0" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="1" />
                                        <line x1="0" y1="125" x2="1000" y2="125" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="1" />
                                        <line x1="0" y1="250" x2="1000" y2="250" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="1" />

                                        <polyline
                                            points={getPoints(filteredHistory.map(h => metric === 'wpm' ? h.wpm : h.accuracy), 250, 1000)}
                                            fill="none"
                                            stroke={metric === 'wpm' ? '#3B82F6' : '#10B981'}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="drop-shadow-sm"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                                <span>{filteredHistory.length > 0 ? new Date(filteredHistory[0].date).toLocaleDateString() : ''}</span>
                                <span>{filteredHistory.length > 0 ? new Date(filteredHistory[filteredHistory.length - 1].date).toLocaleDateString() : ''}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Lesson Breakdown */}
                        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Lesson Breakdown</h3>
                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[250px] pr-2 scrollbar-thin">
                                {lessonPerformance.map(lp => (
                                    <div key={lp.id} className="group">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Lesson {lp.id}</span>
                                            <span className="text-gray-500">{lp.avgWpm} wpm</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all group-hover:bg-blue-400"
                                                style={{ width: `${Math.min(100, (lp.avgWpm / (stats.bestWpm || 100)) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                {lessonPerformance.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">No lesson data</div>
                                )}
                            </div>
                        </div>

                        {/* Recent Session List (Compact) */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 font-bold text-gray-900 dark:text-white">
                                Recent Sessions
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Date</th>
                                            <th className="px-6 py-3 font-medium">Lesson</th>
                                            <th className="px-6 py-3 font-medium">WPM</th>
                                            <th className="px-6 py-3 font-medium">Accuracy</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {[...filteredHistory].reverse().slice(0, 10).map(entry => (
                                            <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{new Date(entry.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-3 text-gray-900 dark:text-white font-medium">Lesson {entry.lessonId}</td>
                                                <td className="px-6 py-3 font-mono text-gray-700 dark:text-gray-300">{entry.wpm}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${entry.accuracy >= 95 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
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
