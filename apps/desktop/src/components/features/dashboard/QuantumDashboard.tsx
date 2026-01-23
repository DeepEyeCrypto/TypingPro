import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Unlock, Cpu, Globe, Database } from 'lucide-react';

interface QuantumDashboardProps {
    className?: string;
    isSecure?: boolean;
}

export const QuantumDashboard: React.FC<QuantumDashboardProps> = ({ className, isSecure = true }) => {
    const [encryptionKey, setEncryptionKey] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let key = '';
            for (let i = 0; i < 16; i++) {
                key += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setEncryptionKey(key);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`glass-panel rounded-[3rem] p-8 overflow-hidden relative flex flex-col ${className}`}>
            <div className="flex justify-between items-start mb-10 z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500">
                            <Lock size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Security_Protocol</span>
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Quantum_Dashboard</h3>
                </div>

                <div className="px-5 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Quantum_Safe_Active</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10 z-10">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <Cpu size={16} className="text-orange-500/40" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Cipher_Key</span>
                    </div>
                    <div className="text-sm font-mono font-black italic truncate text-orange-200">
                        {encryptionKey}
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe size={16} className="text-orange-500/40" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Sync_Status</span>
                    </div>
                    <div className="text-sm font-black italic text-orange-200">
                        1024-bit_AES
                    </div>
                </div>
            </div>

            <div className="mt-auto space-y-6 z-10">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Integrity_Index</div>
                        <div className="text-4xl font-black italic tracking-tighter">99.8%</div>
                    </div>

                    <div className="flex gap-1 mb-2">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 4 }}
                                animate={{ height: [4, 12, 4] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                }}
                                className="w-1 bg-orange-500/40 rounded-full"
                            />
                        ))}
                    </div>
                </div>

                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: '10%' }}
                        animate={{ width: '99.8%' }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                    />
                </div>
            </div>

            {/* Background Data Stream (Visual only) */}
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-[0.03] overflow-hidden pointer-events-none p-4 select-none">
                <div className="text-[8px] font-mono leading-tight whitespace-pre">
                    {Array(40).fill(0).map((_, i) => (
                        <div key={i}>{Math.random().toString(36).substring(2, 15)}</div>
                    ))}
                </div>
            </div>

            {/* Corner Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
        </div>
    );
};
