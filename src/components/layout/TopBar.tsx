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

export const TopBar: React.FC<TopBarProps> = ({ title, stats, actions }) => {
    return (
        <div className="h-full px-6 flex items-center justify-between">
            {/* TITLE AREA */}
            <div className="flex items-center space-x-4">
                {title && (
                    <h1 className="text-sm font-semibold text-white/80 tracking-tight">
                        {title}
                    </h1>
                )}
            </div>

            {/* STATS AREA */}
            <div className="flex items-center space-x-8">
                {stats && (
                    <>
                        {stats.wpm !== undefined && (
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold leading-none">WPM</span>
                                <span className="text-lg font-mono text-hacker leading-none mt-1">{stats.wpm}</span>
                            </div>
                        )}
                        {stats.accuracy !== undefined && (
                            <div className="flex flex-col items-center border-l border-white/5 pl-8">
                                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold leading-none">ACC</span>
                                <span className="text-lg font-mono text-white/80 leading-none mt-1">{stats.accuracy}%</span>
                            </div>
                        )}
                        {stats.rank && (
                            <div className="flex flex-col items-center border-l border-white/5 pl-8">
                                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold leading-none">RANK</span>
                                <span className="text-sm font-bold text-white/90 leading-none mt-1">{stats.rank}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ACTIONS AREA */}
            <div className="flex items-center space-x-4">
                {actions}
            </div>
        </div>
    );
};
