import React from 'react';
import { Target, Zap, AlertCircle, Activity } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: 'wpm' | 'accuracy' | 'errors' | 'progress';
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, subtext, trend }) => {
    const getIcon = () => {
        switch (icon) {
            case 'wpm': return <Zap className="w-5 h-5 text-brand" />;
            case 'accuracy': return <Target className="w-5 h-5 text-status-success" />;
            case 'errors': return <AlertCircle className="w-5 h-5 text-status-error" />;
            case 'progress': return <Activity className="w-5 h-5 text-status-warning" />;
        }
    };

    return (
        <div className="bg-bg-surface p-4 rounded-xl border border-border hover:border-border-hover shadow-sm transition-all hover:shadow-md flex items-center justify-between min-w-[140px]">
            <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{label}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-text-primary">{value}</span>
                    {subtext && <span className="text-xs text-text-muted">{subtext}</span>}
                </div>
            </div>
            <div className="p-2 bg-bg-secondary rounded-lg">
                {getIcon()}
            </div>
        </div>
    );
};
