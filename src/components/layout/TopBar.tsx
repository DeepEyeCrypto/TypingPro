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
        <div className="w-full h-full px-2 flex items-center justify-between">
            {/* TITLE AREA */}
            <div className="flex items-center space-x-4">
                {title && (
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                        <h1 className="text-xs font-bold text-white/60 tracking-widest uppercase">
                            {title}
                        </h1>
                    </div>
                )}
            </div>

            {/* STATS AREA */}
            <div className="flex items-center space-x-4">
                {stats && (
                    <>
                        {stats.wpm !== undefined && (
                            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/20 border border-white/5 backdrop-blur-md">
                                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">WPM</span>
                                <span className="text-lg font-mono text-neon-cyan font-bold leading-none">{stats.wpm}</span>
                            </div>
                        )}
                        {stats.accuracy !== undefined && (
                            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/20 border border-white/5 backdrop-blur-md">
                                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">ACC</span>
                                <span className="text-lg font-mono text-white/90 leading-none">{stats.accuracy}%</span>
                            </div>
                        )}
                        {stats.rank && (
                            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/20 border border-white/5 backdrop-blur-md">
                                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">RANK</span>
                                <span className="text-sm font-bold text-white/90 leading-none">{stats.rank}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ACTIONS AREA */}
            <div className="flex items-center space-x-4 flex-shrink-0">
                {actions}
            </div>
        </div>
    );
};
