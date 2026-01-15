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
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-bold text-lg tracking-tight">WPM History</h3>
                        <div className="flex gap-2">
                            <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">Last 20 Sessions</span>
                        </div>
                    </div>
                    <p className="text-white/40 text-sm">Consistent performance tracking.</p>
                </div>

                <div className="flex-1 w-full min-h-[200px] flex items-center justify-center">
                    <Suspense fallback={<div className="text-white/20 text-sm animate-pulse">Loading Hologram...</div>}>
                        <WpmGlassChart data={data} />
                    </Suspense>
                </div>
            </MasterGlassCard>

            {/* Right Column: Key Metrics Summary */}
            <MasterGlassCard className="col-span-1 p-6 flex flex-col justify-center items-center relative">
                <div className="text-center">
                    <h3 className="text-white/50 text-sm uppercase tracking-widest mb-4">Average Speed</h3>
                    <div className="relative inline-block">
                        <span className="text-6xl font-bold text-white tracking-tighter">{averageWpm}</span>
                        <span className="text-xl text-white/40 ml-1">WPM</span>
                    </div>
                </div>

                <div className="mt-4 w-full flex justify-center">
                    <RankBadge wpm={averageWpm} />
                </div>


                <div className="mt-8 w-full border-t border-white/5 pt-8 text-center">
                    <h3 className="text-white/50 text-sm uppercase tracking-widest mb-2">Precision</h3>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                        <span className="text-2xl font-bold text-white">{latestAccuracy}%</span>
                    </div>
                </div>

                {/* Decorative Ring Background Effect */}
                <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
                </div>
            </MasterGlassCard>
        </div>
    );
};

export default memo(StatsOverview);
