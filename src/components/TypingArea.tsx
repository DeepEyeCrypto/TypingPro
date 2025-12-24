import React, { useRef, useEffect, memo } from 'react';
import { useTyping } from '../hooks/useTyping';
import { useSettingsStore } from '../stores/settingsStore';
import { useTypingStore } from '../stores/typingStore';
import '../styles/glass.css';

interface TypingAreaProps {
    text: string;
}

const TypingArea: React.FC<TypingAreaProps> = ({ text }) => {
    const { chars, cursorPos, isComplete, reset } = useTyping(text);
    const { fontFamily, fontSize, caretStyle, caretSpeed } = useSettingsStore();
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-focus logic
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    const getCaretClass = () => {
        let classes = 'absolute w-0.5 bg-blue-500 ';
        if (caretSpeed === 'smooth') classes += 'transition-all duration-100 ease-out ';
        if (caretStyle === 'underline') classes += 'h-0.5 mt-8 ';
        else if (caretStyle === 'block') classes += 'w-3 h-8 opacity-50 ';
        else classes += 'h-8 '; // beam
        return classes;
    };

    const getFontSizeClass = () => {
        switch (fontSize) {
            case 'small': return 'text-lg';
            case 'large': return 'text-3xl';
            case 'xl': return 'text-4xl';
            default: return 'text-2xl';
        }
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className="ios-glass p-8 w-full max-w-4xl min-h-[200px] outline-none relative"
            style={{ fontFamily: `'${fontFamily}', monospace` }}
        >
            <div className={`flex flex-wrap gap-x-[0.5em] gap-y-4 ${getFontSizeClass()} leading-relaxed`}>
                {chars.map((char, idx) => {
                    const isCursor = idx === cursorPos;
                    const isTyped = char.isTyped;
                    const isCorrect = char.isCorrect;

                    let colorClass = 'text-gray-500';
                    if (isTyped) {
                        colorClass = isCorrect ? 'text-white' : 'text-red-500 bg-red-500/10 rounded-sm';
                    }

                    return (
                        <span key={idx} className="relative inline-block">
                            {isCursor && (
                                <div className={getCaretClass()} style={{ left: '-1px' }} />
                            )}
                            <span className={`${colorClass} transition-colors duration-75`}>
                                {char.value === ' ' ? '\u00A0' : char.value}
                            </span>
                        </span>
                    );
                })}
                {/* Handle caret at the end of text */}
                {cursorPos === text.length && (
                    <div className={getCaretClass()} />
                )}
            </div>

            {isComplete && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-[var(--ios-radius-lg)]">
                    <button
                        onClick={reset}
                        className="ios-button ios-button-primary text-lg px-8 py-3"
                    >
                        Practice Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(TypingArea);
