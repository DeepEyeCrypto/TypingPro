// ═══════════════════════════════════════════════════════════════════
// CARD DEMO: VisionOS-style system validation
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { GlassCard } from '../../ui/GlassCard';

export const CardDemo: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen p-10 bg-slate-900 overflow-hidden relative">

            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl relative z-10">

                {/* 1. INTERACTIVE SYSTEM CARD */}
                <GlassCard
                    interactive
                    title="Interface Protocol"
                    subtitle="VISION_OS_SYSTEM_V2"
                    variant="large"
                    className="flex flex-col justify-between py-12 px-10 h-[500px]"
                >
                    <div className="space-y-6">
                        <div className="w-16 h-16 glass-pill flex items-center justify-center text-3xl shadow-2xl">
                            🧩
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                            System<br /><span className="not-italic text-white/30">Validation</span>
                        </h2>
                        <div className="flex gap-3">
                            {['GPU_READY', 'NEURAL_LINK', 'STABLE'].map(tag => (
                                <span key={tag} className="px-4 py-1.5 glass-unified text-[9px] font-black tracking-widest uppercase text-white/60">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Latency</span>
                            <span className="text-2xl font-black text-lime-400 tabular-nums uppercase tracking-tighter">0.14ms</span>
                        </div>
                        <button className="glass-pill px-8 py-3 text-[10px] font-black text-gray-900 shadow-xl uppercase tracking-widest">
                            Execute Link
                        </button>
                    </div>
                </GlassCard>

                {/* 2. SECONDARY DATA CARD */}
                <GlassCard
                    variant="large"
                    className="flex flex-col justify-center items-center py-12 px-10 bg-indigo-500/5"
                >
                    <div className="text-center space-y-8 w-full">
                        <div className="w-20 h-20 glass-pill mx-auto flex items-center justify-center border-white/20">
                            <span className="text-3xl">💿</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white tracking-widest uppercase italic leading-none">Kernel Sync</h3>
                            <p className="glass-text-muted text-[10px] font-black uppercase tracking-[0.4em]">Subsurface Transmission</p>
                        </div>
                        <div className="flex justify-center gap-12 w-full pt-8 border-t border-white/5">
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Upload</span>
                                <span className="text-2xl font-black text-white">880<small className="text-[10px] opacity-30"> GBps</small></span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Status</span>
                                <span className="text-2xl font-black text-cyan-400">ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

            </div>
        </div>
    );
};
