// ═══════════════════════════════════════════════════════════════════
// TYPING TEST PAGE: VisionOS-style focused typing environment
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { TypingField } from '../features/typing/TypingField';
import { GlassCard } from '../ui/GlassCard';
import { MissionHUD } from '../features/typing/MissionHUD';
import { SurvivalFuelBar } from '../ui/SurvivalFuelBar';

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
    };
    juice?: {
        fuel: number;
        isShakeActive: boolean;
        isComboPulse: boolean;
        particleColor: string;
    };
}

export const TypingTestPage: React.FC<TypingTestPageProps> = ({
    targetText,
    input,
    active,
    onKeyDown,
    stats,
    onReset,
    missionData,
    juice
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-5xl mx-auto p-4 animate-in fade-in duration-1000">

            {/* Header / Stats HUD */}
            <div className="w-full flex justify-between items-end mb-8 px-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-primary)' }}>Session Metrics</span>
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Active Drill</h1>
                </div>

                <div className="flex gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-[var(--text-accent)] uppercase tracking-widest opacity-80">Velocity</span>
                        <span className="text-3xl font-black p-0 leading-none" style={{ color: 'var(--text-primary)' }}>{stats.wpm} <small className="text-xs opacity-30">WPM</small></span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-[var(--text-accent)] uppercase tracking-widest opacity-80">Precision</span>
                        <span className="text-3xl font-black p-0 leading-none" style={{ color: 'var(--text-primary)' }}>{stats.accuracy}%</span>
                    </div>
                </div>
            </div>

            {/* Main Typing Surface */}
            <div className="w-full max-w-4xl mb-6">
                <SurvivalFuelBar fuel={juice?.fuel || 0} isSurvivalMode={!!juice && active} />
            </div>

            <GlassCard variant="large" className="w-full relative shadow-[0_40px_100px_rgba(0,0,0,0.6)] py-16">
                <TypingField
                    targetText={targetText}
                    input={input}
                    active={active}
                    onKeyDown={onKeyDown}
                    juice={juice}
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
                            <kbd className="px-3 py-1 rounded-lg glass-panel text-[10px] font-black shadow-md group-hover:scale-110 transition-transform" style={{ color: 'var(--text-primary)' }}>TAB</kbd>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-primary)' }}>Reset Interface</span>
                        </div>
                        <div className="w-px h-4 border-r border-white/10" />
                        <div className="flex items-center gap-2">
                            <kbd className="glass-panel px-3 py-1 rounded-lg text-[10px] font-black opacity-50" style={{ color: 'var(--text-primary)' }}>ESC</kbd>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-primary)' }}>System Pause</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Supplemental Actions */}
            <div className="mt-12 flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <button
                    onClick={onReset}
                    className="px-8 py-2.5 rounded-2xl glass-panel text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[var(--glass-hover)] transition-all"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Hard Reset
                </button>
                <button className="px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    Reconfigure Drill
                </button>
            </div>
        </div>
    );
};
