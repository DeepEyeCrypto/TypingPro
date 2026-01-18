// ═══════════════════════════════════════════════════════════════════
// STATS OVERVIEW: VisionOS-style performance matrix
// ═══════════════════════════════════════════════════════════════════

import React, { Suspense, memo } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { useTypingStats } from '../../../hooks/useTypingStats';
import { RankBadge } from '../RankBadge';

const WpmGlassChart = React.lazy(() => import('./WpmGlassChart'));

const StatsOverview: React.FC = () => {
    const { data, averageWpm, latestAccuracy } = useTypingStats();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto animate-in fade-in duration-700">

            {/* PERFORMANCE CHART */}
            <GlassCard
                title="Performance Matrix"
                subtitle="HISTORICAL VELOCITY"
                variant="large"
                className="col-span-1 lg:col-span-2 min-h-[360px]"
            >
                <div className="flex-1 w-full min-h-[200px] flex items-center justify-center mt-6">
                    <Suspense fallback={
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 glass-pill animate-spin border-t-2 border-cyan-400" />
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Compiling Hologram...</span>
                        </div>
                    }>
                        <WpmGlassChart data={data} />
                    </Suspense>
                </div>
            </GlassCard>

            {/* QUICK METRICS */}
            <GlassCard variant="large" className="col-span-1 flex flex-col items-center justify-center py-10">
                <div className="text-center w-full mb-10">
                    <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] block mb-6 italic">Mean Signal Velocity</span>
                    <div className="relative">
                        <span className="text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            {averageWpm}
                        </span>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Words / Min</span>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-10 mt-6 pt-10 border-t border-white/5">
                    <RankBadge wpm={averageWpm} />

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] italic">Current Precision</span>
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                            <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{latestAccuracy}%</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default memo(StatsOverview);
