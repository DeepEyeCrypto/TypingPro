import React from 'react';
import { motion } from 'framer-motion';

interface LessonDisplayProps {
    content: string;
    cursorIndex: number;
    errors: number[];
    className?: string;
}

const LessonDisplay: React.FC<LessonDisplayProps> = ({ content, cursorIndex, errors, className = '' }) => {
    const chars = content.split('');

    return (
        <div className={`flex flex-wrap justify-center gap-3 py-10 px-6 ${className}`}>
            {chars.map((char, idx) => {
                const isTyped = idx < cursorIndex;
                const isCurrent = idx === cursorIndex;
                const isError = errors.includes(idx);

                let state = 'upcoming';
                if (isCurrent) state = 'current';
                else if (isTyped) state = isError ? 'error' : 'correct';

                return (
                    <motion.div
                        key={idx}
                        initial={false}
                        animate={{
                            scale: isCurrent ? 1.1 : 1.0,
                            y: isCurrent ? -5 : 0
                        }}
                        className={`
              w-12 h-16 sm:w-16 sm:h-20 flex items-center justify-center rounded-2xl text-3xl font-black transition-all duration-300
              ${state === 'upcoming' ? 'bg-white/5 text-white/20 border border-white/5' : ''}
              ${state === 'current' ? 'bg-white/10 text-white border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-4 ring-sky-400/20' : ''}
              ${state === 'correct' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : ''}
              ${state === 'error' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' : ''}
            `}
                    >
                        {char === ' ' ? '␣' : char}

                        {/* Indicator for current character */}
                        {isCurrent && (
                            <motion.div
                                layoutId="indicator"
                                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-sky-400 rounded-full"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default React.memo(LessonDisplay);
