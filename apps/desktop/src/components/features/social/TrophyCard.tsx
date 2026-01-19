import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Flame, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import './TrophyCard.css';

interface Props {
    rank: string;
    wpm: number;
    accuracy: number;
    streak: number;
    username: string;
}

export const TrophyCard: React.FC<Props> = ({ rank, wpm, accuracy, streak, username }) => {
    return (
        <div
            className="relative overflow-hidden bg-slate-900 border border-white/10 rounded-[4rem] p-16 text-center shadow-[0_80px_160px_rgba(0,0,0,0.9)] max-w-2xl mx-auto"
            id="trophy-capture-area"
        >
            {/* High Intensity Scanning Beam */}
            <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--text-accent)] to-transparent opacity-30 blur-md z-20 pointer-events-none"
            />

            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />

            <div className="relative z-10">
                <div className="flex justify-center items-center gap-4 mb-14 opacity-30">
                    <div className="w-16 h-px bg-white/20" />
                    <div className="text-[11px] font-black uppercase tracking-[0.8em] italic" style={{ color: 'var(--text-primary)' }}>Neural_Signature_v4.5</div>
                    <div className="w-16 h-px bg-white/20" />
                </div>

                <div className="mb-14 relative group">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="w-44 h-44 mx-auto rounded-[3rem] bg-white/5 border-2 border-white/10 flex items-center justify-center shadow-2xl relative backdrop-blur-3xl group-hover:border-[var(--text-accent)]/30 transition-colors"
                    >
                        <Trophy size={80} className="text-[var(--text-accent)] drop-shadow-[0_0_30px_rgba(0,243,255,0.4)]" />
                        <div className="absolute -bottom-4 px-8 py-2 bg-[var(--text-accent)] text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-[var(--text-accent)]/40 border border-white/20">
                            {rank} RANK
                        </div>
                    </motion.div>
                </div>

                <h1 className="text-4xl font-black uppercase tracking-tighter mb-14 italic text-white" style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
                    Elite_Achievement_Protocol
                </h1>

                <div className="grid grid-cols-2 gap-10 mb-14">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-inner flex flex-col items-center group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-3 opacity-20">
                            <Zap size={14} />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-primary)' }}>Neural_Speed</div>
                        </div>
                        <div className="text-6xl font-black italic tracking-tighter text-white">{wpm}<small className="text-xs opacity-20 not-italic ml-2 uppercase tracking-widest">WPM</small></div>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-inner flex flex-col items-center group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-3 opacity-20">
                            <Target size={14} />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-primary)' }}>Sync_Accuracy</div>
                        </div>
                        <div className="text-6xl font-black italic tracking-tighter text-[var(--text-accent)]">{accuracy}<small className="text-xs opacity-20 not-italic ml-2 uppercase tracking-widest">%</small></div>
                    </div>
                </div>

                <div className="inline-flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 rounded-[2.5rem] mb-14 shadow-2xl group hover:border-orange-500/20 transition-colors">
                    <Flame size={20} className="text-orange-500 animate-pulse" />
                    <span className="text-sm font-black uppercase tracking-[0.5em] text-white italic">{streak}_Day_Practice_Streak</span>
                </div>

                <div className="flex items-center justify-between pt-12 border-t border-white/10">
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <Activity size={16} className="text-[var(--text-accent)]" />
                        </div>
                        <span className="text-base font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity italic" style={{ color: 'var(--text-primary)' }}>@{username}</span>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-green-500">Verified_Operator</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

