import React from 'react';
import { FingerStats } from '../../types';

interface HeatmapAnalyzerProps {
    fingerStats: Record<string, FingerStats>;
}

const FINGERS = [
    'left-pinky', 'left-ring', 'left-middle', 'left-index',
    'right-index', 'right-middle', 'right-ring', 'right-pinky'
];

const HeatmapAnalyzer: React.FC<HeatmapAnalyzerProps> = ({ fingerStats }) => {
    const totalPresses = Object.values(fingerStats).reduce((acc, curr) => acc + curr.totalPresses, 0);

    const getIntensityColor = (finger: string) => {
        const stats = fingerStats[finger];
        if (!stats || totalPresses === 0) return 'bg-blue-500/10';

        // Target distribution is ~12.5% per finger (excluding thumbs for now or adding them)
        const usage = stats.totalPresses / totalPresses;

        if (usage > 0.20) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'; // Overused
        if (usage > 0.15) return 'bg-orange-500';
        if (usage > 0.08) return 'bg-green-500';
        return 'bg-blue-400/40'; // Underused
    };

    return (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-black tracking-tight text-white/80">Finger Usage Heatmap</h3>
                <span className="text-[10px] uppercase tracking-widest text-white/20">Target: Balanced (12-15%)</span>
            </div>

            <div className="flex justify-between items-end h-32 gap-2 px-2">
                {FINGERS.map(finger => {
                    const stats = fingerStats[finger];
                    const usage = stats ? (stats.totalPresses / Math.max(1, totalPresses) * 100).toFixed(1) : '0';
                    const height = stats ? Math.max(10, (stats.totalPresses / Math.max(1, totalPresses) * 300)) : 10;

                    return (
                        <div key={finger} className="flex flex-col items-center flex-1 group relative">
                            <div className="absolute -top-8 bg-black/80 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                {finger.replace('-', ' ')}: {usage}%
                            </div>
                            <div
                                className={`w-full rounded-t-lg transition-all duration-500 ${getIntensityColor(finger)}`}
                                style={{ height: `${height}%` }}
                            />
                            <div className="w-1.5 h-1.5 rounded-full mt-2 bg-white/20" />
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Left Hand</p>
                    <p className="text-xl font-black text-brand">
                        {((FINGERS.slice(0, 4).reduce((acc, f) => acc + (fingerStats[f]?.totalPresses || 0), 0) / Math.max(1, totalPresses)) * 100).toFixed(0)}%
                    </p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Right Hand</p>
                    <p className="text-xl font-black text-brand">
                        {((FINGERS.slice(4).reduce((acc, f) => acc + (fingerStats[f]?.totalPresses || 0), 0) / Math.max(1, totalPresses)) * 100).toFixed(0)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeatmapAnalyzer;
