import React from 'react';

interface TopBarProps {
    title?: string;
    stats?: {
        wpm?: number;
        accuracy?: number;
        rank?: string;
    };
    actions?: React.ReactNode;
}

export const StatMinimal: React.FC<{ label: string; value: string | number | undefined; className?: string }> = ({ label, value, className }) => {
    if (value === undefined || value === null) {
        return null;
    }
    return (
        <div className={`flex flex-col ${className}`}>
            <span className="text-[8px] lg:text-[10px] font-black text-white opacity-30 tracking-widest leading-none mb-1">{label}</span>
            <span className="text-[14px] lg:text-[18px] font-black text-cyan-400 tabular-nums tracking-tighter leading-none">{value}</span>
        </div>
    );
};

export const TopBar: React.FC<TopBarProps> = ({ title, stats, actions }) => {
    return (
        <div className="w-full h-full px-4 flex items-center justify-between">
            {/* TITLE AREA AND STATS */}
            <div className="flex items-center gap-4 lg:gap-8 flex-1">
                <div className="flex flex-col">
                    <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white flex items-center gap-1 leading-none">
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent italic">TYPING</span>
                        <span className="text-white bg-gradient-to-r from-pink-500 to-purple-600 px-2 py-0.5 rounded-lg mx-1 shadow-[0_0_20px_rgba(236,72,153,0.3)] border border-white/20">PRO</span>
                    </h1>
                </div>

                {stats && (
                    <div className="hidden sm:flex items-center gap-6 lg:gap-12 border-l border-white/10 pl-6 lg:pl-12">
                        <StatMinimal label="WPM_VELOCITY" value={stats.wpm} />
                        <StatMinimal label="ACCURACY_RATE" value={stats.accuracy !== undefined ? `${stats.accuracy}%` : undefined} className="hidden md:flex" />
                        <StatMinimal label="RANK_ID" value={stats.rank} className="hidden lg:flex" />
                    </div>
                )}
            </div>

            {/* ACTIONS AREA */}
            <div className="flex items-center space-x-6 flex-shrink-0">
                {actions}
            </div>
        </div>
    );
};
