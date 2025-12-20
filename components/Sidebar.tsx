import React, { memo } from 'react';
import { SECTIONS, LESSONS } from '../constants';
import { Lock, PlayCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

/**
 * Sidebar - Context Integrated
 * Rewritten for Clean Slate with Liquid Glass v2 Support
 */
const Sidebar: React.FC = memo(() => {
    const { activeLessonId, lessonProgress, setActiveLessonId, setIsSidebarCollapsed } = useApp();

    return (
        <aside className="w-full h-full flex flex-col p-4 pr-2 overflow-y-auto bg-transparent scrollbar-hide select-none transition-all duration-300">
            {/* 1. Header with Hide Button */}
            <div className="flex items-center justify-between mb-6 px-2">
                <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.3em]">Curriculum</span>
                <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all group"
                    title="Hide Sidebar"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
            </div>

            <div className="space-y-8">
                {SECTIONS.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-sci-fi font-black text-cyber-cyan/40 uppercase tracking-[0.2em]">{section.title}</h4>
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full glass-panel border-cyber-cyan/10 text-cyber-cyan/60">
                                {section.range}
                            </span>
                        </div>

                        <div className="space-y-0.5">
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
                                                w-full flex items-center gap-2.5 p-2 rounded-lg transition-all border font-sci-fi
                                                ${isActive
                                                    ? 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan shadow-cyan-glow z-10'
                                                    : !isUnlocked
                                                        ? 'opacity-10 grayscale cursor-not-allowed border-transparent'
                                                        : 'hover:bg-white/5 border-transparent text-white/40 hover:text-white/70'
                                                }
                                            `}
                                        >
                                            <div className="flex-shrink-0">
                                                {isCompleted ? (
                                                    <CheckCircle size={14} className="text-cyber-cyan" />
                                                ) : (
                                                    <PlayCircle size={14} className={isActive ? "animate-pulse" : ""} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 overflow-hidden">
                                                    <span className="text-[11px] font-medium truncate tracking-tight">{lesson.title}</span>
                                                    {lesson.difficulty && (
                                                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/30 shrink-0">
                                                            Lvl {lesson.difficulty}
                                                        </span>
                                                    )}
                                                </div>
                                                {isActive && lesson.target_wpm && (
                                                    <div className="text-[8px] text-cyber-cyan/60 font-mono mt-0.5">
                                                        Target: {lesson.target_wpm} WPM
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
});

export default Sidebar;