import React from 'react'
import { TypingField } from './TypingField'
import { KeyboardOverlay } from './KeyboardOverlay'
import { HandGuide } from './HandGuide'
import { MissionHUD } from './MissionHUD'
import { ReplayData } from '@src/stores/statsStore'
import './TypingArea.css'

interface TypingAreaProps {
    targetText: string,
    input: string,
    activeChar: string,
    onBack: () => void,
    onKeyDown: (e: any) => void,
    isPaused: boolean,
    ghostReplay?: ReplayData,
    missionData?: {
        isMission: boolean;
        targetWpm: number;
        minAccuracy: number;
        currentWpm: number;
        accuracy: number;
        stressLevel: number;
    }
}

export const TypingArea = React.memo(({
    targetText,
    input,
    activeChar,
    onBack,
    onKeyDown,
    isPaused,
    ghostReplay,
    missionData,
    lesson // Added lesson prop
}: TypingAreaProps) => {
    return (
        <div className="flex flex-col h-full overflow-hidden text-white animate-in fade-in duration-700">
            {/* Header / Meta */}
            <div className="p-4 lg:p-8 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-4 lg:gap-8">
                    <button
                        onClick={onBack}
                        className="p-3 lg:p-4 rounded-full bg-black/5 hover:bg-black/10 transition-all group border border-black/5"
                    >
                        <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-xl lg:text-3xl font-black tracking-tighter uppercase">{lesson.title}</h2>
                        <span className="text-[10px] font-black opacity-30 tracking-[0.4em] uppercase">{lesson.stage}_PROTOCOL</span>
                    </div>
                </div>

                <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[10px] font-black opacity-30 tracking-widest uppercase mb-1">Target_Threshold</span>
                    <span className="text-xl lg:text-2xl font-black tabular-nums">{lesson.targetWPM} WPM</span>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 relative overflow-hidden">
                <TypingField
                    targetText={targetText}
                    input={input}
                    active={true}
                    onKeyDown={onKeyDown}
                    isPaused={isPaused}
                    ghostReplay={ghostReplay}
                />

                {missionData?.isMission && (
                    <MissionHUD
                        isMissionActive={true}
                        currentWpm={missionData.currentWpm}
                        targetWpm={missionData.targetWpm}
                        accuracy={missionData.accuracy}
                        minAccuracy={missionData.minAccuracy}
                        stressLevel={missionData.stressLevel}
                    />
                )}

                <div className="visual-guide-area">
                    <HandGuide activeChar={activeChar} />
                    <KeyboardOverlay activeChar={activeChar} />
                </div>
            </div>
        </div>
    )
})
