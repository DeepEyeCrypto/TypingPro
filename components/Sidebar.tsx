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
                            <h4 className="text-[10px] font-sci-fi font-black text-cyber-cyan/40 uppercase tracking-[0.2em]">{section.title}</h4>
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full glass-panel border-cyber-cyan/10 text-cyber-cyan/60">
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
                                                w-full flex items-center gap-3 p-3 rounded-xl transition-all border font-sci-fi
                                                ${isActive
                                                    ? 'glass-panel border-cyber-cyan/40 text-cyber-cyan shadow-cyan-glow scale-[1.02] z-10'
                                                    : !isUnlocked
                                                        ? 'opacity-20 grayscale cursor-not-allowed border-transparent'
                                                        : 'glass-card border-transparent hover:border-white/10 text-white/50 hover:text-white/80'
                                                }
                                            `}
                                        >
                                            <div className="flex-shrink-0">
                                                {isCompleted ? (
                                                    <CheckCircle size={16} className="text-cyber-cyan" />
                                                ) : !isUnlocked ? (
                                                    <Lock size={16} />
                                                ) : (
                                                    <PlayCircle size={16} className={isActive ? "animate-pulse" : ""} />
                                                )}
                                            </div>
                                            <span className="text-xs font-bold truncate tracking-tight">{lesson.title}</span>
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