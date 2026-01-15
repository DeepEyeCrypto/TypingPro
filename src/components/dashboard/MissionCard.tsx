import React from 'react';
import { Button } from '../ui/Button';

interface MissionCardProps {
    title: string;
    label: string;
    description: string;
    targetWpm: number;
    onStart: () => void;
}

export const MissionCard: React.FC<MissionCardProps & { className?: string }> = ({ title, label, description, targetWpm, onStart, className }) => {
    return (
        <div className={`bg-white/5 backdrop-blur-[64px] border border-white/10 rounded-2xl lg:rounded-[3rem] p-6 lg:p-10 h-full flex flex-col justify-between group cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all hover:translate-y-[-4px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden text-white ${className}`}>
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] group-hover:bg-white/10 transition-colors duration-700" />

            <div>
                <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-black text-white opacity-40 tracking-[0.4em] uppercase">
                        {label}
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-black text-white opacity-60 tracking-widest uppercase">
                            ACTIVE
                        </span>
                    </div>
                </div>

                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2 lg:mb-4 tracking-tighter leading-tight">
                    {title}
                </h2>
                <p className="text-white opacity-50 text-sm lg:text-base leading-relaxed max-w-[320px] font-medium">
                    {description}
                </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
                <Button
                    onClick={onStart}
                    variant="primary"
                    className="!px-6 lg:!px-8 !py-2 lg:!py-3 shadow-2xl"
                >
                    START_MISSION
                </Button>
                <div className="text-[10px] font-black text-white opacity-40 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md uppercase tracking-widest">
                    {targetWpm} WPM_THR
                </div>
            </div>
        </div>
    );
};
