import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { GlassModal } from '../../ui/GlassModal';
import { Trophy, Share2, Download, Zap, ShieldCheck, Target, Binary } from 'lucide-react';
import { getRankForWPM } from '../../../core/rankSystem';

interface TrophyRoomProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    bestWpm: number;
    accuracy: number;
    keystones: number;
    level: number;
    unlockedBadgesCount: number;
}

export const TrophyRoom: React.FC<TrophyRoomProps> = ({
    isOpen,
    onClose,
    username,
    bestWpm,
    accuracy,
    keystones,
    level,
    unlockedBadgesCount
}) => {
    const rank = getRankForWPM(bestWpm);

    const handleCopy = () => {
        // In a real app, this would use html2canvas or similar
        // For now, we'll just copy a text summary
        const summary = `🏆 TypingPro Elite Status: ${username} | Rank: ${rank.name} | ${bestWpm} WPM | ${accuracy}% Acc`;
        navigator.clipboard.writeText(summary);
        alert('Neural summary copied to buffer!');
    };

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="Elite_Registry"
            subtitle="Neural.Signature.Analysis"
            maxWidth="max-w-2xl"
        >
            <div className="flex flex-col items-center gap-8 py-4">
                {/* The Shareable Card */}
                <div className="relative w-full aspect-[1.6/1] rounded-[3rem] overflow-hidden group/card shadow-2xl border border-white/10" id="trophy-card">
                    {/* Background layers */}
                    <div className="absolute inset-0 bg-[#03040b]" />
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />

                    {/* Scanning Beam */}
                    <motion.div
                        animate={{ top: ['-10%', '110%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--text-accent)] to-transparent opacity-20 blur-sm z-20 pointer-events-none"
                    />

                    {/* Animated Glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 90, 180, 270, 360]
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute -top-1/2 -right-1/2 w-full h-full bg-[var(--text-accent)]/20 blur-[120px] rounded-full"
                    />

                    {/* Card Content */}
                    <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40 text-white italic">Elite_Validation</span>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                                    {username}<span className="opacity-20">.tp</span>
                                </h3>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-20 text-white mb-1">Authenticated</span>
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    <ShieldCheck size={18} className="text-[var(--text-accent)]" />
                                </div>
                            </div>
                        </div>

                        {/* Center: Rank Icon & Name */}
                        <div className="flex items-center gap-10">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center text-7xl shadow-2xl relative"
                            >
                                {rank.icon}
                                <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-[var(--text-accent)] flex items-center justify-center text-white font-black text-xs border-4 border-[#03040b]">
                                    L{level}
                                </div>
                            </motion.div>
                            <div>
                                <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">
                                    {rank.name}
                                </h1>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 opacity-50">
                                        <Zap size={12} className="text-[var(--text-accent)]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{bestWpm} Peak_Velocity</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-50">
                                        <Target size={12} className="text-[var(--text-accent)]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{accuracy}% Precision</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end border-t border-white/10 pt-6">
                            <div className="flex gap-8">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30 text-white block">Keystones</span>
                                    <span className="text-xl font-black italic text-white leading-none">{keystones.toLocaleString()}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30 text-white block">Vaulted_Registry</span>
                                    <span className="text-xl font-black italic text-white leading-none">{unlockedBadgesCount} Badges</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <h4 className="text-[12px] font-black tracking-[0.4em] italic text-white opacity-40 uppercase">TYPINGPRO_EXPERT</h4>
                                <div className="text-[10px] font-signature text-[var(--text-accent)] opacity-60 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {username.toLowerCase().replace(/\s+/g, '_')}_verified
                                </div>
                                <span className="text-[8px] font-mono opacity-20 text-white block mt-2">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 w-full">
                    <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-4 py-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                        <Share2 size={18} className="opacity-40 group-hover:opacity-100 group-hover:text-[var(--text-accent)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white">Copy_Buffer</span>
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-4 py-4 rounded-3xl bg-[var(--text-accent)] text-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[var(--text-accent)]/20"
                    >
                        <Download size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Export_Signature</span>
                    </button>
                </div>
            </div>
        </GlassModal>
    );
};
