// ═══════════════════════════════════════════════════════════════════
// CURRENT LESSON CARD - Warm Glass Design
// ═══════════════════════════════════════════════════════════════════

import React from 'react';

interface CurrentLessonProps {
    title: string;
    stage: string;
    targetWpm: number;
    currentLesson: number;
    totalLessons: number;
    onContinue: () => void;
}

export const CurrentLesson: React.FC<CurrentLessonProps> = ({
    title,
    stage,
    targetWpm,
    currentLesson,
    totalLessons,
    onContinue,
}) => {
    const progress = Math.round((currentLesson / totalLessons) * 100);

    return (
        <div className="glass-unified rounded-2xl lg:rounded-[3rem] p-6 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 hover:bg-white/10 transition-all shadow-xl group text-white">
            <div className="flex-1 space-y-4 lg:space-y-6 w-full lg:w-auto">
                <div>
                    <div className="flex items-center gap-3 mb-2 lg:mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-black opacity-30 tracking-[0.4em] uppercase">Deployment_Current</span>
                    </div>
                    <h2 className="text-2xl lg:text-4xl font-black tracking-tighter leading-none mb-1 lg:mb-2 uppercase">
                        {title}
                    </h2>
                    <p className="text-[10px] lg:text-[12px] font-bold opacity-30 uppercase tracking-[0.2em]">
                        {stage} Protocols // TARGET: {targetWpm} WPM
                    </p>
                </div>
                <div className="space-y-2 lg:space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Efficiency_Index</span>
                        <span className="text-sm font-black tabular-nums">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 lg:h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Assuming Button is a custom component you have, otherwise replace with a standard button */}
            <button
                onClick={onContinue}
                className="wg-button w-full lg:w-auto !px-10 lg:!px-16 !py-3 lg:!py-5 !text-[10px] lg:!text-xs tracking-[0.3em] shadow-2xl group-hover:scale-105 transition-transform"
            >
                RESUME_MISSION
            </button>
        </div>
    );
};
