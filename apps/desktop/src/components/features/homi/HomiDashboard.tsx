import React, { useState, useEffect } from 'react';
import {
    Home, Grid, Settings, Mic, Wind, Zap, Music, Power,
    ChevronRight, Activity, Trophy, BarChart3, Users,
    Plus, Minus, Target, Cpu, ShieldCheck
} from 'lucide-react';
import { useTyping } from '../../../hooks/useTyping';
import { useAuthStore } from '../../../core/store/authStore';
import { useAchievementStore } from '../../../core/store/achievementStore';
import { CURRICULUM } from '../../../data/lessons';
import { getRankForWPM } from '../../../core/rankSystem';
import { useSettingsStore } from '../../../core/store/settingsStore';

import { listen } from '@tauri-apps/api/event';

export const HomiDashboard: React.FC = () => {
    const typing = useTyping();
    const { user, profile } = useAuthStore();
    const { streak, keystones } = useAchievementStore();
    const [targetWpm, setTargetWpm] = useState(profile?.highest_wpm || 60);
    const [liveMetrics, setLiveMetrics] = useState({ wpm: 0, accuracy: 100 });

    const nextLesson = CURRICULUM[typing.unlockedIds.length - 1] || CURRICULUM[0];
    const userRank = getRankForWPM(profile?.avg_wpm || 0);

    // Step 2: Telemetry Data Flow (High-Frequency Listener)
    useEffect(() => {
        const unlisten = listen('keystroke-event', (event: any) => {
            const metrics = event.payload;
            setLiveMetrics({
                wpm: Math.round(metrics.adjusted_wpm || metrics.wpm),
                accuracy: Math.round(metrics.accuracy)
            });
        });

        return () => {
            unlisten.then(f => f());
        };
    }, []);

    return (
        <div
            className="flex h-full w-full p-6 gap-8 overflow-hidden transition-all duration-1000 animate-in fade-in zoom-in-95"
            style={{
                color: 'var(--glass-text)'
            }}
        >
            {/* === 1. NAVIGATION ASIDE === */}
            <aside className="w-[300px] flex flex-col gap-6 h-full shrink-0">
                {/* User Info */}
                <div className="glass-panel p-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-[1.2rem] flex items-center justify-center shadow-xl border border-black/5 overflow-hidden">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} className="w-full h-full object-cover" alt="User" />
                                ) : (
                                    <span className="font-black text-[var(--accent-color)] text-xl">{user?.name?.charAt(0) || 'P'}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight leading-none" style={{ color: 'var(--glass-text)' }}>{user?.name?.split(' ')[0] || 'Pro Typist'}</h1>
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-2 inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--accent-color)' }}>
                                    {userRank.name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl h-12 px-5 flex items-center text-sm font-semibold focus-within:bg-white/20 transition-all shadow-inner">
                        <Mic size={18} className="mr-3" style={{ color: 'var(--accent-color)' }} />
                        <span className="truncate opacity-90 italic" style={{ color: 'var(--glass-text)' }}>AI Coach Listening...</span>
                    </div>
                </div>

                {/* Primary Navigation */}
                <div className="glass-panel flex-1 p-5 flex flex-col gap-2 overflow-y-auto shadow-2xl">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-3 text-cyan-400 opacity-90">Neural Operations</div>
                    <NavItem icon={Home} label="System Status" active onClick={() => typing.setView('dashboard')} />
                    <NavItem icon={Activity} label="Performance Lab" onClick={() => typing.setView('analytics')} />
                    <NavItem icon={Trophy} label="Elite Credentials" onClick={() => typing.setView('certification')} />
                    <NavItem icon={Users} label="Global Grid" onClick={() => typing.setView('social')} />

                    <NavItem icon={Settings} label="Configuration" onClick={() => typing.setView('settings')} />

                    <div className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-3 mt-6 text-cyan-400 opacity-90">Next Assignment</div>
                    <div
                        className="p-5 bg-white/5 border border-white/10 rounded-[2rem] mb-2 hover:bg-white/10 transition-all cursor-pointer group"
                        onClick={() => typing.startLesson(nextLesson)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>{nextLesson.stage}</div>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform opacity-80" />
                        </div>
                        <div className="font-black text-lg leading-tight truncate" style={{ color: 'var(--glass-text)' }}>{nextLesson.title}</div>
                    </div>
                </div>

                {/* Account Widget */}
                <div className="glass-panel-dark p-8 relative overflow-hidden group shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]">
                    <div className="relative z-10">
                        <div className="flex justify-between mb-6">
                            <Target size={24} style={{ color: 'var(--accent-color)' }} />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-color)' }}></div>
                                <span className="text-[8px] font-black tracking-widest opacity-90">UP_TIME: {streak.current_streak}D</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-cyan-400 opacity-80">Vault Balance</div>
                        <div className="font-black text-3xl mb-6 group-hover:scale-105 transition-transform tracking-tighter" style={{ color: 'var(--glass-text)' }}>
                            {keystones.toLocaleString()} <small className="text-xs opacity-70 font-normal">K$</small>
                        </div>
                        <button
                            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all font-black text-[10px] uppercase tracking-widest text-white border border-white/5"
                            onClick={() => typing.setView('store')}
                        >
                            Open Market_Node
                        </button>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: 'var(--accent-color)' }}></div>
                </div>
            </aside>


            {/* === 2. PERFORMANCE GRID === */}
            <main className="flex-1 grid grid-cols-4 grid-rows-2 gap-8 h-full">

                {/* AI COACH STATUS */}
                <div className="col-span-2 glass-panel-dark p-10 flex flex-col justify-between relative overflow-hidden border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight mb-1">Synaptic_Coach</h3>
                            <p className="text-cyan-400/80 text-sm font-semibold tracking-wide uppercase italic">Personalized Weakness_Targeting Active</p>
                        </div>
                        <div className="p-4 rounded-[1.5rem] border border-white/10 shadow-inner" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <Cpu style={{ color: 'var(--accent-color)' }} size={24} />
                        </div>
                    </div>
                    {/* Visual Pulse Wave */}
                    <div className="flex items-end gap-1.5 h-24 justify-center opacity-80 mb-4 px-4">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="w-1.5 rounded-full animate-pulse transition-all" style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.06}s`, backgroundColor: 'var(--accent-color)', boxShadow: '0 0 15px var(--accent-color)' }}></div>
                        ))}
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <button
                            className="px-6 py-2 rounded-full text-black font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                            onClick={() => typing.setView('selection')}
                        >
                            Initiate_Drill
                        </button>
                    </div>
                </div>

                {/* METRICS CARDS */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                    {/* Speed Card */}
                    <div className="glass-panel-dark p-8 flex flex-col justify-between border-l-4 shadow-xl group hover:scale-[1.02] transition-all" style={{ borderLeftColor: 'var(--accent-color)' }}>
                        <div className="flex justify-between items-start">
                            <div className="p-4 rounded-[1.8rem] shadow-inner transition-all group-hover:bg-white group-hover:text-black" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--accent-color)' }}>
                                <Zap size={24} />
                            </div>
                            <div className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>Velocity</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-1 text-cyan-400 opacity-80">Mean Session Spd</div>
                            <div className="text-5xl font-black text-white tracking-tighter">
                                {liveMetrics.wpm} <small className="text-lg opacity-60">WPM</small>
                            </div>
                        </div>
                    </div>
                    {/* Accuracy Card */}
                    <div className="glass-panel p-8 flex flex-col justify-between shadow-xl group hover:scale-[1.02] transition-all">
                        <div className="flex justify-between items-start">
                            <div className="p-4 rounded-[1.8rem] shadow-inner transition-all group-hover:scale-110" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--accent-color)' }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div className="bg-white/5 border border-black/5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>Precision</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-1 text-cyan-400 opacity-80">Consistency Index</div>
                            <div className="text-5xl font-black tracking-tighter" style={{ color: 'var(--glass-text)' }}>
                                {liveMetrics.accuracy}<small className="text-xl">%</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TELEMETRY CHART */}
                <div className="col-span-2 glass-panel-dark p-10 relative overflow-hidden border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <h3 className="text-white text-xl font-black tracking-tight flex items-center gap-3">
                            <BarChart3 style={{ color: 'var(--accent-color)' }} size={20} /> Neural_Telemetry
                        </h3>
                        <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-color)' }}></div>
                            <span className="text-[10px] font-black text-white/80 tracking-[0.2em]">LIVE_FEED</span>
                        </div>
                    </div>
                    <div className="h-40 w-full flex items-end relative z-10 transition-all">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <path
                                d="M0,80 C50,60 100,100 150,40 S250,80 300,20 S450,120 600,60"
                                stroke="var(--accent-color)"
                                strokeWidth="5"
                                fill="none"
                                className="transition-all duration-1000"
                                style={{ filter: 'drop-shadow(0 0 10px var(--accent-color))' }}
                            />
                        </svg>
                    </div>
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-full h-px bg-white absolute" style={{ top: `${i * 10}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* DIFFICULTY DIAL (AC Control Refactored) */}
                <div className="col-span-1 row-span-2 glass-panel p-10 flex flex-col items-center justify-between relative shadow-2xl overflow-hidden">
                    <div className="w-full flex justify-between items-center mb-8">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest block leading-none mb-1 text-cyan-400 opacity-80">Goal Protocol</span>
                            <span className="text-xl font-black tracking-tighter" style={{ color: 'var(--glass-text)' }}>THR_SPEED</span>
                        </div>
                        <div className="p-2 rounded-xl border border-white/10" style={{ color: 'var(--accent-color)', background: 'rgba(255,255,255,0.05)' }}>
                            <Zap size={20} />
                        </div>
                    </div>

                    <div className="relative w-56 h-56 flex items-center justify-center group/dial cursor-pointer scale-110">
                        {/* Static Frame */}
                        <div className="absolute inset-0 rounded-full border-[1px] border-dashed transition-transform group-hover/dial:rotate-45 duration-1000" style={{ borderColor: 'var(--glass-border)' }}></div>
                        <div className="absolute inset-8 rounded-full shadow-2xl transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}></div>

                        {/* Dynamic Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                            <circle
                                cx="112" cy="112" r="92"
                                stroke="var(--accent-color)"
                                strokeWidth="14"
                                fill="none"
                                strokeDasharray="578"
                                strokeDashoffset={578 - (578 * (targetWpm / 150))}
                                strokeLinecap="round"
                                className="transition-all duration-700"
                                style={{ filter: 'drop-shadow(0 0 8px var(--accent-color))' }}
                            />
                        </svg>

                        <div className="relative z-10 text-center select-none" style={{ color: 'var(--glass-text)' }}>
                            <div className="flex items-start justify-center">
                                <span className="text-6xl font-black tracking-tighter tabular-nums">{targetWpm}</span>
                                <span className="text-xl font-black opacity-60 mt-2">W</span>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] mt-3 px-4 py-1.5 rounded-full border" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)', background: 'rgba(255,255,255,0.1)' }}>Target_Set</div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full justify-center pt-10">
                        <button
                            className="w-16 h-16 rounded-[2.2rem] flex items-center justify-center transition-all active:scale-90 text-3xl font-black shadow-lg"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--glass-text)' }}
                            onClick={() => setTargetWpm(prev => Math.max(10, prev - 5))}
                        >
                            <Minus size={24} />
                        </button>
                        <button
                            className="w-16 h-16 rounded-[2.2rem] flex items-center justify-center text-3xl font-black shadow-2xl transition-all active:scale-95"
                            style={{ backgroundColor: 'var(--glass-text)', color: 'var(--body-bg-color, black)' }}
                            onClick={() => setTargetWpm(prev => Math.min(150, prev + 5))}
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* CHALLENGE TILE */}
                <div
                    className="col-span-1 glass-panel p-10 flex flex-col items-center justify-center border-dashed border-4 gap-5 hover:bg-white/10 transition-all cursor-pointer group"
                    style={{ borderColor: 'var(--glass-border)' }}
                    onClick={() => typing.setView('selection')}
                >
                    <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all" style={{ backgroundColor: 'var(--accent-color)' }}>
                        <Plus size={40} className="text-black" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: 'var(--glass-text)' }}>Initiate_Match</span>
                </div>

            </main>
        </div>
    );
}

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-[1.8rem] w-full transition-all group ${active ? 'bg-white shadow-xl text-black font-black' : 'hover:bg-white/10'}`}
        style={{ color: active ? '#000000' : 'var(--glass-text)' }}
    >
        <div className={`p-2.5 rounded-2xl transition-all ${active ? 'text-white shadow-lg' : 'bg-white/5 opacity-80 group-hover:opacity-100'}`} style={{ backgroundColor: active ? 'var(--accent-color)' : '' }}>
            <Icon size={20} />
        </div>
        <span className="text-sm tracking-tight">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }}></div>}
    </button>
);
