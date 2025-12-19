import React, { useEffect, useState } from 'react';

/**
 * ComboMeter - Visual feedback for typing streaks.
 * Glows and pulses when combo > 20.
 */
interface ComboMeterProps {
    combo: number;
}

const ComboMeter: React.FC<ComboMeterProps> = ({ combo }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (combo >= 20) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [combo]);

    if (!isVisible) return <div className="h-20" />; // Maintain layout space

    const scale = Math.min(1 + (combo - 20) * 0.01, 1.5);
    const intensity = Math.min((combo - 20) / 100, 1);

    return (
        <div className="flex flex-col items-center justify-center h-20 animate-in zoom-in duration-300">
            <div
                className="relative group transition-transform duration-200"
                style={{ transform: `scale(${scale})` }}
            >
                {/* Outer Glow */}
                <div
                    className="absolute inset-0 blur-2xl rounded-full bg-cyber-cyan opacity-40 animate-pulse"
                    style={{ opacity: 0.2 + intensity * 0.4 }}
                />

                <div className="relative glass-panel px-6 py-2 border-cyber-cyan/40 bg-cyber-cyan/10">
                    <span className="text-[10px] font-mono text-cyber-cyan/60 uppercase tracking-widest block text-center">Streak</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-cyber-cyan italic glow-text">{combo}</span>
                        <span className="text-xs font-bold text-cyber-cyan/80">COMBO</span>
                    </div>
                </div>

                {/* Glitch Overlay for high combos */}
                {combo > 50 && (
                    <div className="absolute inset-0 border-2 border-cyber-violet/50 animate-glitch rounded-lg pointer-events-none" />
                )}
            </div>
        </div>
    );
};

export default ComboMeter;
