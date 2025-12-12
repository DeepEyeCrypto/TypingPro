import React from 'react';
import { DailyGoal } from '../types';
import { CheckCircle2, Circle, Target } from 'lucide-react';

interface DailyGoalsWidgetProps {
    goals: DailyGoal[];
}

const DailyGoalsWidget: React.FC<DailyGoalsWidgetProps> = ({ goals }) => {
    if (goals.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                Daily Goals
            </h3>
            <div className="space-y-3">
                {goals.map(goal => (
                    <div key={goal.id} className="group">
                        <div className="flex items-center justify-between mb-1 text-xs">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                {goal.isCompleted ?
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> :
                                    <Circle className="w-3.5 h-3.5 text-gray-300" />
                                }
                                <span className={goal.isCompleted ? "line-through opacity-70" : ""}>{goal.description}</span>
                            </div>
                            <span className="font-mono text-gray-500">
                                {Math.floor(goal.currentValue)}/{goal.targetValue}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${goal.isCompleted ? 'bg-green-500' : 'bg-orange-400'}`}
                                style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyGoalsWidget;
