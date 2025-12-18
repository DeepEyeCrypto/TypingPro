import React from 'react';
import { SECTIONS, LESSONS } from '../constants';
import { Lock, PlayCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

/**
 * Sidebar - Context Integrated
 * Rewritten for Clean Slate
 */
const Sidebar: React.FC = () => {
    const { activeLessonId, lessonProgress, setActiveLessonId } = useApp();

    return (
        <aside className="w-full h-full flex flex-col p-6 overflow-y-auto bg-transparent">
            <div className="space-y-8">
                {SECTIONS.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{section.title}</h4>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/40">
                                {section.range}
                            </span>
                        </div>

                        <div className="space-y-1">
                            {LESSONS.filter(l => l.id >= parseInt(section.range.split('-')[0]) && l.id <= parseInt(section.range.split('-')[1]))
                                .map((lesson) => {
                                    const progress = lessonProgress[lesson.id];
                                    const isActive = lesson.id === activeLessonId;
                                    const isUnlocked = progress?.unlocked || lesson.id === 1;
                                    const isCompleted = progress?.completed;

                                    return (
                                        <button
                                            key={lesson.id}
                                            disabled={!isUnlocked}
                                            onClick={() => setActiveLessonId(lesson.id)}
                                            className={`
                                                w-full flex items-center gap-3 p-3 rounded-2xl transition-all border
                                                ${isActive
                                                    ? 'bg-brand/10 border-brand/20 text-brand shadow-lg'
                                                    : !isUnlocked
                                                        ? 'opacity-20 grayscale cursor-not-allowed border-transparent'
                                                        : 'hover:bg-white/5 text-white/60 border-transparent hover:border-white/5'
                                                }
                                            `}
                                        >
                                            <div className="flex-shrink-0">
                                                {isCompleted ? (
                                                    <CheckCircle size={16} className="text-brand" />
                                                ) : !isUnlocked ? (
                                                    <Lock size={16} />
                                                ) : (
                                                    <PlayCircle size={16} />
                                                )}
                                            </div>
                                            <span className="text-xs font-bold truncate">{lesson.title}</span>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;