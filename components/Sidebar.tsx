import React, { memo } from 'react';
import { SECTIONS } from '../constants';
import { HERO_CURRICULUM } from '../constants/curriculum';
import { Lock, PlayCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

/**
 * Sidebar - Context Integrated
 * Updated for Zero to 150+ WPM Hero Curriculum
 */
const Sidebar: React.FC = memo(() => {
    const { activeLessonId, lessonProgress, setActiveLessonId, setIsSidebarCollapsed } = useApp();

    return (
        <aside className="w-full h-full flex flex-col p-4 pr-2 overflow-y-auto bg-transparent scrollbar-hide select-none transition-all duration-300">
            {/* 1. Header with Hide Button */}
            <div className="flex items-center justify-between mb-6 px-2">
                <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.3em]">Hero Journey</span>
                <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-sky-400 hover:border-sky-400/30 transition-all group"
                    title="Hide Sidebar"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
            </div>

            <div className="space-y-8">
                {SECTIONS.map((section, idx) => {
                    const [start, end] = section.range.split('-').map(Number);
                    const sectionLessons = HERO_CURRICULUM.filter(l => l.id >= start && l.id <= end);

                    if (sectionLessons.length === 0) return null;

                    return (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{section.title}</h4>
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                                    {section.range}
                                </span>
                            </div>

                            <div className="space-y-0.5">
                                {sectionLessons.map((lesson) => {
                                    const progress = lessonProgress[lesson.id];
                                    const isActive = lesson.id === activeLessonId;
                                    const isUnlocked = progress?.unlocked || lesson.id === 1;
                                    const isCompleted = progress?.completed;
                                    const isLocked = !isUnlocked;

                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setActiveLessonId(lesson.id)}
                                            className={`w-full group relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${isActive
                                                ? 'bg-white dark:bg-white/10 shadow-sm border-white/20'
                                                : isLocked
                                                    ? 'opacity-30 grayscale cursor-not-allowed'
                                                    : 'hover:bg-white/40 dark:hover:bg-white/5 border-transparent hover:border-black/5 dark:hover:border-white/5 hover:-translate-y-0.5'
                                                } border`}
                                            disabled={isLocked}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isActive
                                                ? 'bg-sky-500 text-white'
                                                : isCompleted
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-black/5 dark:bg-white/5 text-slate-400 dark:text-white/20'
                                                }`}>
                                                <span className="text-[10px] font-bold">{lesson.id}</span>
                                            </div>

                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="flex items-center justify-between gap-2 overflow-hidden">
                                                    <span className={`text-xs font-semibold truncate tracking-tight transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white/70'}`}>{lesson.title}</span>
                                                    {lesson.difficulty && (
                                                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-slate-400 dark:text-white/20 shrink-0 uppercase tracking-tighter">Lvl {lesson.difficulty}</span>
                                                    )}
                                                </div>
                                                {isActive && lesson.target_wpm && (
                                                    <div className="text-[8px] text-sky-500 font-bold uppercase tracking-widest mt-0.5">Target: {lesson.target_wpm} WPM</div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
});

export default Sidebar;