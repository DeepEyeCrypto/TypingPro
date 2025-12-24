import React, { useState } from 'react';
import { LESSONS, Lesson } from '../data/lessons';
import '../styles/glass.css';

interface LessonBankProps {
    onSelect: (lesson: Lesson) => void;
}

const LessonBank: React.FC<LessonBankProps> = ({ onSelect }) => {
    const [activePhase, setActivePhase] = useState<number>(1);

    const filteredLessons = LESSONS.filter(l => l.phase === activePhase);

    return (
        <div className="w-full max-w-5xl flex flex-col gap-8 h-[70vh]">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Scientific Curriculum</h2>
                    <p className="text-gray-500">Master the art of typing from zero to pro.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    {[1, 2, 3, 4].map(phase => (
                        <button
                            key={phase}
                            onClick={() => setActivePhase(phase)}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activePhase === phase ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            Phase {phase}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {filteredLessons.map(lesson => (
                    <div
                        key={lesson.id}
                        onClick={() => onSelect(lesson)}
                        className="ios-glass p-6 cursor-pointer group hover:border-blue-500/50 transition-all flex flex-col gap-4"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-1">
                                    Lesson {lesson.id}
                                </span>
                                <h3 className="font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors">
                                    {lesson.title}
                                </h3>
                            </div>
                            <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500">
                                Lvl {lesson.difficulty}
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2">
                            {lesson.description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-600 uppercase">Target</span>
                                <span className="text-sm font-bold">{lesson.targetWPM} WPM</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                →
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonBank;
