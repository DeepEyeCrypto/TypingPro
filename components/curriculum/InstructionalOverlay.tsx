import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lesson } from '../../types';
import { Lightbulb, Keyboard, Fingerprint, Play } from 'lucide-react';

interface InstructionalOverlayProps {
    lesson: Lesson;
    onStart: () => void;
}

const InstructionalOverlay: React.FC<InstructionalOverlayProps> = ({ lesson, onStart }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-6"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-2xl bg-white/70 dark:bg-black/40 border border-white/20 rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-12 relative"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                        <Fingerprint size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Preparing for Mission {lesson.id}
                        </h2>
                        <p className="text-slate-500 dark:text-white/40 font-medium">
                            Phase {lesson.phase}: {lesson.title}
                        </p>
                    </div>
                </div>

                {/* Hand Posture Guide (Placeholder for animation) */}
                <div className="aspect-video w-full bg-black/5 dark:bg-white/5 rounded-3xl mb-8 flex flex-col items-center justify-center p-8 text-center border border-white/10">
                    <Keyboard size={48} className="text-sky-500/40 mb-4" />
                    <p className="text-sm font-medium text-slate-600 dark:text-white/60 max-w-sm">
                        Keep your index fingers on the <span className="text-sky-500 font-bold">F</span> and <span className="text-sky-500 font-bold">J</span> keys.
                        Feel the small bumps to find your home position without looking.
                    </p>
                </div>

                {/* Tips Section */}
                {lesson.tips && lesson.tips.length > 0 && (
                    <div className="space-y-4 mb-10">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-white/20">
                            <Lightbulb size={16} /> Pro Tips
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lesson.tips.map((tip, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                                    <p className="text-xs font-medium text-slate-700 dark:text-white/70 leading-relaxed">
                                        {tip}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action */}
                <button
                    onClick={onStart}
                    className="w-full py-5 bg-sky-500 hover:bg-sky-400 text-white rounded-[24px] font-bold text-lg shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <Play size={20} fill="currentColor" /> Let's Begin
                </button>
            </motion.div>
        </motion.div>
    );
};

export default InstructionalOverlay;
