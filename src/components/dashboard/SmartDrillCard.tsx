import React from 'react';

interface SmartDrillCardProps {
    onStart: () => void;
}

export const SmartDrillCard: React.FC<SmartDrillCardProps> = ({ onStart }) => {
    return (
        <div className="glass-perfect rounded-3xl p-6 h-full flex flex-col justify-between group cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all hover:translate-y-[-2px] shadow-[0_8px_32px_rgba(0,0,0,0.05),inset_0_1px_0_0_rgba(255,255,255,0.1)] relative overflow-hidden text-white">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] group-hover:bg-white/10 transition-colors duration-700" />

            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-white opacity-40 tracking-[0.2em] uppercase">
                        INTELLIGENCE_TRAINING
                    </span>
                    <span className="text-[10px] font-mono text-white tracking-widest">
                        ● ACTIVE
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight transition-colors">
                    SMART_DRILL
                </h2>
                <p className="text-sm text-white opacity-60 leading-relaxed max-w-[280px]">
                    Tactical generation targeting mechanical weaknesses and error-prone bigrams.
                </p>
            </div>

            <div className="mt-8">
                <button
                    onClick={onStart}
                    className="px-6 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 text-white text-xs font-bold tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center group/btn shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] active:scale-95"
                >
                    INITIATE_AI_SYNC
                    <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
