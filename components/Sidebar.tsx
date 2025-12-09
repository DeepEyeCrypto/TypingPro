import React from 'react';
import { SECTIONS, LESSONS } from '../constants';
import { Lock, PlayCircle, CheckCircle } from 'lucide-react';
import { LessonProgress } from '../types';

interface SidebarProps {
  currentLessonId: number;
  onSelectLesson: (id: number) => void;
  lessonProgress: Record<number, LessonProgress>;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentLessonId, onSelectLesson, lessonProgress, isOpen }) => {
  return (
    <aside 
        className={`
            bg-white/50 dark:bg-[#111827]/50 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto backdrop-blur-sm z-20 transition-all duration-300 ease-in-out
            ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}
        `}
    >
      {/* Inner container with fixed width to prevent reflow during collapse */}
      <div className="min-w-[16rem] flex flex-col h-full">
        <div className="p-6">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Course Map</h3>
            <div className="space-y-6">
            {SECTIONS.map((section, idx) => (
                <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span>{section.title}</span>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
                    {section.range}
                    </span>
                </div>
                
                {section.active ? (
                    <div className="space-y-1 ml-2 border-l-2 border-gray-200 dark:border-gray-800 pl-3">
                    {LESSONS.map((lesson) => {
                        const progress = lessonProgress[lesson.id] || { 
                            unlocked: false, 
                            completed: false, 
                            bestWpm: 0, 
                            bestAccuracy: 0, 
                            runCount: 0 
                        };
                        const isActive = lesson.id === currentLessonId;
                        const isUnlocked = progress.unlocked;
                        const isCompleted = progress.completed;
                        
                        return (
                            <button
                            key={lesson.id}
                            disabled={!isUnlocked}
                            onClick={() => onSelectLesson(lesson.id)}
                            className={`
                                w-full text-left text-xs py-2 px-2 rounded-md flex items-center gap-2 transition-all
                                ${isActive 
                                    ? 'bg-[#007AFF]/10 text-[#007AFF] font-medium shadow-sm' 
                                    : !isUnlocked
                                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
                                }
                            `}
                            >
                            {isCompleted ? (
                                <CheckCircle className="w-3.5 h-3.5 text-[#34C759]" />
                            ) : !isUnlocked ? (
                                <Lock className="w-3.5 h-3.5" />
                            ) : isActive ? (
                                <PlayCircle className="w-3.5 h-3.5" />
                            ) : (
                                <span className="w-3.5 text-center text-[10px] font-mono opacity-50">{lesson.id}</span>
                            )}
                            
                            <div className="flex flex-col items-start truncate">
                                <span className="truncate">{lesson.title}</span>
                                {progress.bestAccuracy > 0 && (
                                    <span className="text-[9px] opacity-60 font-mono">{progress.bestAccuracy}% Acc</span>
                                )}
                            </div>
                            </button>
                        );
                    })}
                    </div>
                ) : (
                    <div className="ml-5 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600 opacity-60">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                    </div>
                )}
                </div>
            ))}
            </div>
        </div>
        
        {/* Footer */}
        <div className="mt-auto p-6 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed">
            &copy; 2024 TypingPro Inc.<br/>
            v2.5.0 Pro
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;