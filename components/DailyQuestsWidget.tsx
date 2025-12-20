import React from 'react';
import { DailyQuest } from '../types';
import { CheckCircle2, Circle, Compass } from 'lucide-react';

interface DailyQuestsWidgetProps {
    quests: DailyQuest[];
}

const DailyQuestsWidget: React.FC<DailyQuestsWidgetProps> = ({ quests }) => {
    if (!quests || quests.length === 0) return null;

    return (
        <div className="glass-card p-4 shadow-sm border border-white/10 w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-500" />
                Daily Missions
            </h3>
            <div className="space-y-3">
                {quests.map(quest => (
                    <div key={quest.id} className="group">
                        <div className="flex items-center justify-between mb-1 text-xs">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                {quest.isCompleted ?
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
                                    <Circle className="w-3.5 h-3.5 text-white/10" />
                                }
                                <span className={quest.isCompleted ? "line-through opacity-70" : ""}>{quest.title}</span>
                            </div>
                            <span className="font-mono text-gray-500">
                                {Math.floor(quest.currentValue)}/{quest.targetValue}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${quest.isCompleted ? 'bg-emerald-500' : 'bg-sky-500'}`}
                                style={{ width: `${Math.min(100, (quest.currentValue / quest.targetValue) * 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyQuestsWidget;
