// ═══════════════════════════════════════════════════════════════════
// TYPING TEST PAGE: VisionOS-style focused typing environment
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { TypingField } from '../features/typing/TypingField';
import { GlassCard } from '../ui/GlassCard';
import { MissionHUD } from '../features/typing/MissionHUD';

interface TypingTestPageProps {
    targetText: string;
    input: string;
    active: boolean;
    onKeyDown: (e: any) => void;
    stats: {
        wpm: number;
        accuracy: number;
        rawKpm: number;
    };
    onReset: () => void;
    missionData?: {
        isMission: boolean;
        targetWpm: number;
        minAccuracy: number;
        stressLevel: number;
    }
}

export const TypingTestPage: React.FC<TypingTestPageProps> = ({
    targetText,
    input,
    active,
    onKeyDown,
    stats,
    onReset,
    missionData
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-5xl mx-auto p-4 animate-in fade-in duration-1000">

            {/* Header / Stats HUD */}
            <div className="w-full flex justify-between items-end mb-8 px-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Session Metrics</span>
                    <h1 className="text-2xl font-black text-white tracking-tight">Active Drill</h1>
                </div>

                <div className="flex gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Velocity</span>
                        <span className="text-3xl font-black text-white p-0 leading-none">{stats.wpm} <small className="text-xs opacity-30">WPM</small></span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Precision</span>
                        <span className="text-3xl font-black text-white p-0 leading-none">{stats.accuracy}%</span>
                    </div>
                </div>
            </div>

            {/* Main Typing Surface */}
            <GlassCard variant="large" className="w-full relative shadow-[0_40px_100px_rgba(0,0,0,0.6)] py-16">
                <TypingField
                    targetText={targetText}
                    input={input}
                    active={active}
                    onKeyDown={onKeyDown}
                />

                {missionData?.isMission && (
                    <div className="absolute inset-0 pointer-events-none">
                        <MissionHUD
                            isMissionActive={true}
                            currentWpm={stats.wpm}
                            targetWpm={missionData.targetWpm}
                            accuracy={stats.accuracy}
                            minAccuracy={missionData.minAccuracy}
                            stressLevel={missionData.stressLevel}
                        />
                    </div>
                )}

                {/* Tactical Shortcuts */}
                <div className="mt-16 flex justify-center">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={onReset}>
                            <kbd className="glass-pill px-2.5 py-1 text-[10px] font-black text-gray-900 shadow-md group-hover:scale-110 transition-transform">TAB</kbd>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Reset Interface</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <kbd className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-black text-white/50">ESC</kbd>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">System Pause</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Supplemental Actions */}
            <div className="mt-12 flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <button
                    onClick={onReset}
                    className="glass-pill px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900"
                >
                    Hard Reset
                </button>
                <button className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                    Reconfigure Drill
                </button>
            </div>
        </div>
    );
};
