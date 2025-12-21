import React from 'react';
import { motion } from 'framer-motion';
import { DailyActivity } from '../../types';

interface ActivityHeatmapProps {
    activity: Record<string, DailyActivity>;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activity }) => {
    // Generate last 30 days
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
    });

    const getIntensity = (date: string) => {
        const day = activity[date];
        if (!day) return 0;
        if (day.lessonsCompleted >= 10) return 4;
        if (day.lessonsCompleted >= 5) return 3;
        if (day.lessonsCompleted >= 3) return 2;
        return 1;
    };

    const getIntensityColor = (level: number) => {
        switch (level) {
            case 0: return 'bg-slate-200 dark:bg-white/5';
            case 1: return 'bg-sky-500/30';
            case 2: return 'bg-sky-500/50';
            case 3: return 'bg-sky-500/70';
            case 4: return 'bg-sky-500';
            default: return 'bg-slate-200 dark:bg-white/5';
        }
    };

    return (
        <div className="glass-card p-8 rounded-[40px] border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Typing Consistency</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Last 30 Days Intensity</p>
                </div>
                <div className="flex gap-1.5 items-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase mr-1">Less</span>
                    {[0, 1, 2, 3, 4].map(l => (
                        <div key={l} className={`w-2.5 h-2.5 rounded-sm ${getIntensityColor(l)}`} />
                    ))}
                    <span className="text-[8px] font-black text-slate-400 uppercase ml-1">More</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {days.map((date, i) => {
                    const intensity = getIntensity(date);
                    const d = new Date(date);
                    const isToday = date === new Date().toISOString().split('T')[0];

                    return (
                        <motion.div
                            key={date}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className={`w-6 h-6 md:w-8 md:h-8 rounded-lg ${getIntensityColor(intensity)} relative group cursor-pointer transition-all hover:ring-2 hover:ring-sky-500/50 ${isToday ? 'ring-2 ring-white/20' : ''}`}
                        >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {activity[date]?.lessonsCompleted || 0} lessons
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
