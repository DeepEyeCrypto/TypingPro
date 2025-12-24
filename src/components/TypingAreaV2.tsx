import React, { useEffect, useRef, memo } from 'react';
import { useRustEngine } from '../hooks/useRustEngine';
import '../styles/LiquidGlass.css';

interface TypingAreaProps {
    text: string;
}

const TypingArea: React.FC<TypingAreaProps> = ({ text }) => {
    const { stats, cursorPos, isFinished, startTest, handleKey } = useRustEngine(text);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startTest(text);
    }, [text, startTest]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key.length === 1 || e.key === 'Backspace') {
                handleKey(e.key);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleKey]);

    return (
        <div className="liquid-surface p-12 w-full max-w-5xl min-h-[300px] flex flex-col justify-center">
            <div className="flex flex-wrap gap-x-[0.3em] font-mono text-3xl leading-relaxed">
                {text.split('').map((char, idx) => {
                    let state = 'text-white/20'; // default
                    if (idx < cursorPos) {
                        // Simplified correctness check for UI
                        // In a real app we'd get correct_chars from Rust
                        state = 'text-white';
                    }

                    return (
                        <span key={idx} className={`relative transition-all duration-75 ${state}`}>
                            {idx === cursorPos && (
                                <div className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(0,122,255,0.8)] animate-pulse" />
                            )}
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    );
                })}
            </div>

            {isFinished && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                    <button className="liquid-button text-xl px-12 py-4" onClick={() => startTest(text)}>
                        Restart Experience
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(TypingArea);
