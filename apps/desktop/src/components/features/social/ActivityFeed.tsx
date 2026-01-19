import React, { useEffect, useState } from 'react';
import { activityService, GlobalEvent } from '../../../core/activityService';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck, Trophy, Target, Activity, Clock, User } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
    const [events, setEvents] = useState<GlobalEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = activityService.listenToGlobalEvents((data) => {
            setEvents(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const formatRelativeTime = (timestamp: any) => {
        if (!timestamp) return 'JUST NOW';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diff = Math.floor((Date.now() - date.getTime()) / 1000);

        if (diff < 60) return `${diff}S AGO`;
        if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`;
        return `${Math.floor(diff / 86400)}D AGO`;
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-white/5 border border-white/5 rounded-3xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/5 opacity-30">
                <Activity className="mx-auto mb-4 opacity-20" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'var(--text-primary)' }}>
                    No_Global_Activity_Detected<br />
                    <span className="opacity-50 tracking-[0.2em] italic">Pulse_Monitoring_Active</span>
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            <AnimatePresence>
                {events.map((event, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={event.id}
                        className="flex items-start gap-4 p-4 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[var(--text-accent)]/20 transition-all group"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-[var(--text-accent)]/30 transition-colors">
                                {event.avatarUrl ? (
                                    <img src={event.avatarUrl} alt={event.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                        <User size={16} className="opacity-20" />
                                    </div>
                                )}
                            </div>
                            {/* Micro-status dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--text-accent)] border-2 border-slate-900 shadow-[0_0_8px_var(--text-accent)]" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                    @{event.username}
                                </span>
                                <div className="flex items-center gap-1.5 opacity-20">
                                    <Clock size={10} />
                                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                                        {formatRelativeTime(event.timestamp)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-[11px] font-medium leading-relaxed opacity-60 flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-primary)' }}>
                                {renderEventMessage(event)}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

function renderEventMessage(event: GlobalEvent) {
    switch (event.type) {
        case 'certification':
            return (
                <>
                    <ShieldCheck size={12} className="text-yellow-400" />
                    JUST_EARNED <span className="font-black text-yellow-400 uppercase">[{event.data.tier}_RANK]</span>_CERTIFICATION
                </>
            );
        case 'streak':
            return (
                <>
                    <Target size={12} className="text-orange-500" />
                    REACHED_A <span className="font-black text-orange-500 uppercase">{event.data.days}_DAY</span>_PRACTICE_STREAK
                </>
            );
        case 'record':
            return (
                <>
                    <Zap size={12} className="text-[var(--text-accent)]" />
                    SET_NEW_Personal_Record: <span className="font-black text-[var(--text-accent)] uppercase">{event.data.wpm}_WPM</span>
                </>
            );
        case 'badge':
            return (
                <>
                    <Trophy size={12} className="text-purple-400" />
                    UNLOCKED: <span className="font-black text-purple-400 uppercase">[{event.data.badgeName}]</span>_Neural_Badge
                </>
            );
        default:
            return (
                <>
                    <Activity size={12} className="opacity-40" />
                    DETECTED_Neural_Link_Activity
                </>
            );
    }
}

