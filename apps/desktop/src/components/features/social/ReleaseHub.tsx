import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { motion } from 'framer-motion';
import { Cpu, GitCommit, Monitor, Terminal, Zap, Shield, Flame, CheckCircle2, Info } from 'lucide-react';

interface BuildInfo {
    version: string;
    commit_hash: string;
    target_os: string;
    env: string;
}

export const ReleaseHub: React.FC = () => {
    const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);

    useEffect(() => {
        invoke<BuildInfo>('get_build_info')
            .then(setBuildInfo)
            .catch(console.error);
    }, []);

    return (
        <div className="relative overflow-hidden bg-white/5 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-3xl">
            {/* Internal Scan Beam */}
            <motion.div
                animate={{ left: ['-10%', '110%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-[var(--text-accent)] to-transparent opacity-10 blur-sm pointer-events-none z-0"
            />

            <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-[var(--text-accent)] opacity-40" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic" style={{ color: 'var(--text-primary)' }}>Kernel_Release_Intelligence</h2>
                </div>
                <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full shadow-inner">
                    <div className={`w-2 h-2 rounded-full ${buildInfo?.env === 'Production' ? 'bg-[var(--text-accent)] shadow-[0_0_10px_var(--text-accent)]' : 'bg-orange-500 shadow-[0_0_10px_orange] pulse'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic" style={{ color: 'var(--text-primary)' }}>{buildInfo?.env || 'CONNECTING...'}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-10 relative z-10">
                <div className="flex flex-col gap-2 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 opacity-30">
                        <Info size={10} />
                        <label className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Version</label>
                    </div>
                    <span className="text-xl font-black italic tracking-tighter text-[var(--text-accent)]">{buildInfo?.version || '0.0.0'}</span>
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 opacity-30">
                        <GitCommit size={10} />
                        <label className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Commit</label>
                    </div>
                    <span className="text-xl font-black italic tracking-tighter opacity-40 font-mono truncate" style={{ color: 'var(--text-primary)' }}>{buildInfo?.commit_hash?.slice(0, 7) || '-------'}</span>
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 opacity-30">
                        <Monitor size={10} />
                        <label className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Platform</label>
                    </div>
                    <span className="text-xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>{buildInfo?.target_os || '-------'}</span>
                </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] mb-10 relative z-10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu size={80} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3" style={{ color: 'var(--text-accent)' }}>
                    <div className="w-1 h-3 bg-[var(--text-accent)]" />
                    Neural_v4.2.0 - Performance_Lab
                </h3>
                <ul className="space-y-4">
                    {[
                        { icon: <Zap size={14} />, text: 'Sub-1ms Performance Telemetry', accent: 'text-blue-400' },
                        { icon: <Shield size={14} />, text: 'Automated Neural Hardening', accent: 'text-green-400' },
                        { icon: <Flame size={14} />, text: '3D Keyboard Heatmaps (BETA)', accent: 'text-orange-400' },
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-xs font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            <div className={`${item.accent} opacity-100`}>{item.icon}</div>
                            <span className="opacity-40">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <footer className="flex justify-center pt-10 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3 px-6 py-2 bg-[var(--text-accent)] text-white rounded-full shadow-2xl shadow-[var(--text-accent)]/40 hover:scale-105 transition-transform cursor-default">
                    <CheckCircle2 size={14} />
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase">Verified_Build_Protocol</span>
                </div>
            </footer>
        </div>
    );
};

