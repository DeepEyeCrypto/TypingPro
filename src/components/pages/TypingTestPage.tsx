import React, { useState } from 'react';
import { TypingField } from '../TypingField';
import { Card } from '../ui/Card';
import { StatDisplay } from '../ui/StatDisplay';
import { Button } from '../ui/Button';
import { MissionHUD } from '../MissionHUD';

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

/**
 * TypingTestPage: The core practice experience refactored for the new UI.
 * It provides a focused environment for high-performance typing.
 */
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
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
            {/* PERFORMANCE METRICS OVERLAY (SUBTLE) */}
            <div className="w-full max-w-5xl flex justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <StatDisplay label="WPM" value={stats.wpm} color="hacker" trend="up" />
                <StatDisplay label="Accuracy" value={`${stats.accuracy}%`} />
                <StatDisplay label="Raw Speed" value={stats.rawKpm} subValue="kpm" />
            </div>

            {/* MAIN TYPING ZONE */}
            <Card className="w-full max-w-5xl glass-card p-12 relative overflow-hidden">
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

                {/* HINT / SHORTCUTS */}
                <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
                    <div className="flex items-center space-x-6 text-[10px] font-bold text-white uppercase tracking-widest">
                        <span className="flex items-center bg-white/5 px-2 py-1 rounded">Tab</span>
                        <span>to reset</span>
                        <span className="flex items-center bg-white/5 px-2 py-1 rounded ml-4">Esc</span>
                        <span>to pause</span>
                    </div>
                </div>
            </Card>

            {/* ACTIONS */}
            <div className="mt-12 flex space-x-4 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards delay-500">
                <Button onClick={onReset} variant="secondary">RESET_DRILL (TAB)</Button>
                <Button variant="ghost">CHANGE_CURRICULUM</Button>
            </div>
        </div>
    );
};
