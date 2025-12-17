import React from 'react';
import { Target, Trophy } from 'lucide-react';

interface GoalsPanelProps {
    wpmGoal: number;
    accuracyGoal: number;
    dailyProgress: number; // 0-100
}

export const GoalsPanel: React.FC<GoalsPanelProps> = ({ wpmGoal, accuracyGoal, dailyProgress }) => {
    return (
        <div className="bg-bg-surface p-4 rounded-xl border border-border shadow-sm">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                <Trophy className="w-3 h-3" />
                Daily Goals
            </h3>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">Progress</span>
                        <span className="font-bold text-brand">{dailyProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand rounded-full transition-all duration-500"
                            style={{ width: `${dailyProgress}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-bg-secondary/50 rounded-lg text-center">
                        <div className="text-[10px] text-text-muted uppercase">Target WPM</div>
                        <div className="font-bold text-text-primary">{wpmGoal}</div>
                    </div>
                    <div className="p-2 bg-bg-secondary/50 rounded-lg text-center">
                        <div className="text-[10px] text-text-muted uppercase">Target Acc</div>
                        <div className="font-bold text-text-primary">{accuracyGoal}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
