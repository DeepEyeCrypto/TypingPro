import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertTriangle, Terminal, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { LoginPanel } from './LoginPanel';
import { loadConfig, AppConfig } from '../../utils/ConfigLoader';

export const AuthModal: React.FC = () => {
    const { activeModal, setActiveModal, login } = useApp();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSystemCheck, setShowSystemCheck] = useState(false);
    const [config, setConfig] = useState<AppConfig | null>(null);

    useEffect(() => {
        if (activeModal === 'auth') {
            loadConfig().then(setConfig);
        }
    }, [activeModal]);

    if (activeModal !== 'auth') return null;

    const refreshConfig = async () => {
        setIsLoading(true);
        const newConfig = await loadConfig();
        setConfig(newConfig);
        setIsLoading(false);
        if (newConfig.source !== 'none') setError(null);
    };

    const handleLogin = async (provider: 'google' | 'github') => {
        setIsLoading(true);
        setError(null);
        try {
            await login(provider);
            setActiveModal('none');
        } catch (err: any) {
            console.error('Login failed:', err);
            const errorMsg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));

            if (errorMsg.includes('CSRF')) setError('Security check failed. Please try again.');
            else if (errorMsg.includes('time') || errorMsg.includes('TIMEOUT')) setError('Login session timed out. Please try again.');
            else if (errorMsg.includes('CLIENT_ID') || errorMsg.includes('SECRET') || errorMsg.includes('env')) {
                setError(`${provider.toUpperCase()} Config Error: ${errorMsg}`);
                setShowSystemCheck(true);
            }
            else setError(errorMsg || 'Authentication failed. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal('none')}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-[450px] bg-[#2c2e31] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={() => setActiveModal('none')}
                    className="absolute top-8 right-8 text-[var(--sub)] hover:text-[var(--main)] transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[var(--main)] uppercase tracking-[0.2em] mb-2 font-mono">Sign In</h2>
                    <p className="text-[10px] text-[var(--sub)] uppercase tracking-[0.3em] font-bold opacity-60">Elevate your typing speed</p>
                </div>

                <LoginPanel onLogin={handleLogin} isLoading={isLoading} error={error} />

                {/* System Check Dashboard */}
                <AnimatePresence>
                    {showSystemCheck && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-6 pt-6 border-t border-white/5"
                        >
                            <div className="bg-black/20 rounded-2xl p-5 border border-white/5 space-y-3">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                                    <span className="text-[var(--sub)]">System Health</span>
                                    <Settings size={12} className="opacity-40" />
                                </div>

                                <div className="space-y-2">
                                    <StatusItem
                                        label="Frontend Env"
                                        status={config?.googleClientId ? 'OK' : 'FAIL'}
                                        details={config?.source === 'vite' ? 'Vite Injected' : (config?.source === 'backend' ? 'Bridge Recovered' : 'Missing')}
                                    />
                                    <StatusItem
                                        label="Backend Engine"
                                        status={(error?.includes('backend') || config?.source === 'none') ? 'FAIL' : 'OK'}
                                        details={config?.source === 'backend' ? 'Manual Sync' : 'Tauri Link [OK]'}
                                    />
                                    <StatusItem
                                        label="Redirect URI"
                                        status="OK"
                                        details="localhost:1420"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={refreshConfig}
                                        disabled={isLoading}
                                        className="flex-1 py-3 bg-[var(--main)] text-[var(--bg)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 hover:opacity-90"
                                    >
                                        {isLoading ? 'Relinking...' : 'Refresh Config'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.reload();
                                        }}
                                        className="px-4 py-3 bg-white/5 hover:bg-[#ca4754] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        title="Hard Reset"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-[#2c2e31] px-4 text-[var(--sub)] opacity-20">or</span></div>
                </div>

                {/* Traditional Auth Form (Monkeytype Style) */}
                <div className="space-y-6">
                    <div className="relative group">
                        <Terminal size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--sub)] opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <input type="email" placeholder="email" className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-sm outline-none focus:border-[var(--main)] transition-colors font-mono" />
                    </div>
                    <div className="relative group">
                        <ShieldCheck size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--sub)] opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <input type="password" placeholder="password" className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-sm outline-none focus:border-[var(--main)] transition-colors font-mono" />
                    </div>

                    <button
                        onClick={() => setError('Email login is currently in development. Please use Google or GitHub above.')}
                        className="w-full bg-[var(--main)] text-[var(--bg)] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
                    >
                        Sign In
                        <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                            →
                        </motion.span>
                    </button>
                </div>

                {/* Footer Links */}
                <div className="mt-8 flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--sub)] opacity-40">
                    <button className="hover:text-[var(--main)] transition-colors">create account</button>
                    <button className="hover:text-[var(--main)] transition-colors">forgot password?</button>
                </div>
            </motion.div>
        </div>
    );
};

const StatusItem: React.FC<{ label: string; status: 'OK' | 'FAIL'; details: string }> = ({ label, status, details }) => (
    <div className="flex items-center justify-between text-[9px] font-bold">
        <span className="text-[var(--sub)] opacity-60">{label}</span>
        <div className="flex items-center gap-2">
            <span className="opacity-40 font-mono truncate max-w-[120px]">{details}</span>
            <span className={status === 'OK' ? 'text-[#96d2d9]' : 'text-[#ca4754]'}>[{status}]</span>
        </div>
    </div>
);
