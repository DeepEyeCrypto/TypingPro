import React, { Suspense, memo } from 'react';
import { MasterGlassCard } from '../ui/MasterGlassCard';
import { useTypingStats } from '../../hooks/useTypingStats';
import { RankBadge } from '../RankBadge';


// Lazy load the chart for performance
const WpmGlassChart = React.lazy(() => import('./WpmGlassChart'));

const StatsOverview: React.FC = () => {
    const { data, averageWpm, latestAccuracy } = useTypingStats();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
            {/* Left Column: WPM History Chart */}
            <MasterGlassCard className="col-span-1 lg:col-span-2 p-6 flex flex-col justify-between min-h-[300px]">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-lg tracking-tight">WPM Performance</h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Historical Matrix</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-[200px] flex items-center justify-center">
                    <Suspense fallback={<div className="text-white/20 text-sm animate-pulse">Initializing Hologram...</div>}>
                        <WpmGlassChart data={data} />
                    </Suspense>
                </div>
            </MasterGlassCard>

            {/* Right Column: Key Metrics Summary */}
            <MasterGlassCard className="col-span-1 p-8 flex flex-col justify-center items-center">
                <div className="text-center w-full">
                    <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Aggregate Speed</h3>
                    <div className="relative inline-flex flex-col items-center">
                        <span className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                            {averageWpm}
                        </span>
                        <span className="text-xs font-black text-white/30 tracking-[0.2em] mt-2">WORDS PER MINUTE</span>
                    </div>
                </div>

                <div className="mt-8 w-full flex justify-center">
                    <RankBadge wpm={averageWpm} />
                </div>

                <div className="mt-10 w-full border-t border-white/10 pt-8 text-center">
                    <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Precision Metric</h3>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        <span className="text-3xl font-black text-white tabular-nums">{latestAccuracy}%</span>
                    </div>
                </div>
            </MasterGlassCard>
        </div>
    );
};

export default memo(StatsOverview);
