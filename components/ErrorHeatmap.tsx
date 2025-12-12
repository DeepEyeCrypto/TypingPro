import React from 'react';
import { KeyStats } from '../types';

interface ErrorHeatmapProps {
    keyStats: Record<string, KeyStats>;
}

const ErrorHeatmap: React.FC<ErrorHeatmapProps> = ({ keyStats }) => {
    const keys = (Object.values(keyStats) as KeyStats[]).filter(k => k.totalPresses > 5).sort((a, b) => a.accuracy - b.accuracy);

    if (keys.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Problem Keys</h3>
            <div className="flex flex-wrap gap-2">
                {keys.slice(0, 8).map((stat) => {
                    // Color scale: Red (low acc) -> Yellow (med) -> Green (high)
                    // Actually, usually heatmaps show errors as "Hot" (Red).
                    // Let's do: < 80% Red, < 90% Orange, < 95% Yellow
                    let colorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
                    if (stat.accuracy < 80) colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
                    else if (stat.accuracy < 90) colorClass = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
                    else if (stat.accuracy < 95) colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";

                    return (
                        <div key={stat.char} className={`flex flex-col items-center justify-center w-10 h-10 rounded-md ${colorClass} text-sm font-bold border border-current/10`}>
                            <span className="uppercase">{stat.char}</span>
                            <span className="text-[10px] opacity-80">{stat.accuracy}%</span>
                        </div>
                    );
                })}
            </div>
            {keys.length === 0 && <span className="text-xs text-gray-400">Keep typing to generate stats.</span>}
        </div>
    );
};

export default ErrorHeatmap;
