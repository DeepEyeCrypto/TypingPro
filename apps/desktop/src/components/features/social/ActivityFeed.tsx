import React, { useEffect, useState } from 'react';
import { activityService, GlobalEvent } from '../../../core/activityService';

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
        if (!timestamp) return 'just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diff = Math.floor((Date.now() - date.getTime()) / 1000);

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="p-8 text-center border border-dashed border-white/5 rounded-xl">
                <p className="text-[10px] font-bold text-white opacity-20 uppercase tracking-[0.2em]">
                    No_Global_Activity_Detected<br />
                    <span className="opacity-50">Pulse_Monitoring_Active</span>
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {events.map((event) => (
                <div
                    key={event.id}
                    className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                >
                    <img
                        src={event.avatarUrl}
                        alt={event.username}
                        className="w-8 h-8 rounded-full border border-white/10 mt-1"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                            <span className="text-xs font-bold text-white truncate">
                                @{event.username}
                            </span>
                            <span className="text-[8px] font-bold text-white opacity-20 uppercase">
                                {formatRelativeTime(event.timestamp)}
                            </span>
                        </div>
                        <p className="text-[11px] text-white opacity-70 leading-relaxed">
                            {renderEventMessage(event)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

function renderEventMessage(event: GlobalEvent) {
    switch (event.type) {
        case 'certification':
            return (
                <span className="flex items-center gap-1.5 flex-wrap text-white">
                    Just earned
                    <span className="text-xs font-black uppercase tracking-wider">
                        [{event.data.tier}_Rank]
                    </span>
                    Certification 🎖️
                </span>
            );
        case 'streak':
            return (
                <span className="text-white">
                    Reached a <span className="font-bold">{event.data.days}-day</span> practice streak! 🔥
                </span>
            );
        case 'record':
            return (
                <span className="text-white">
                    Set a new personal record of <span className="font-bold">{event.data.wpm} WPM</span>! ⚡
                </span>
            );
        case 'badge':
            return (
                <span className="text-white">
                    Unlocked the <span className="font-bold">{event.data.badgeName}</span> badge! 🏆
                </span>
            );
        default:
            return 'Detected a pulse anomaly.';
    }
}
