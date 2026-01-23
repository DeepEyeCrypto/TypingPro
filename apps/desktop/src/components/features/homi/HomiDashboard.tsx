import React, { useState, useEffect } from 'react';
import {
    Home, Grid, Settings, Mic, Wind, Zap, Music, Power,
    ChevronRight, Activity, Trophy, BarChart3, Users,
    Plus, Minus, Target, Cpu, ShieldCheck
} from 'lucide-react';
// import { useTyping } from '../../../hooks/useTyping'; // Removed
import { useAuthStore } from '../../../core/store/authStore';
import { useAchievementStore } from '../../../core/store/achievementStore';
import { useStatsStore } from '../../../core/store/statsStore';
import { CURRICULUM, Lesson } from '../../../data/lessons';
import { getRankForWPM } from '../../../core/rankSystem';
import { useSettingsStore } from '../../../core/store/settingsStore';

import { listen } from '@tauri-apps/api/event';

export interface HomiDashboardProps {
    onSetView: (view: any) => void;
    onStartLesson: (lesson: Lesson) => void;
    currentMetrics: { adjusted_wpm: number; accuracy: number };
}

export const HomiDashboard: React.FC<HomiDashboardProps> = ({ onSetView, onStartLesson, currentMetrics }) => {
    // const typing = useTyping(); // Removed isolated instance
    const { unlockedIds } = useStatsStore();
    const { user, profile } = useAuthStore();
    const { streak, keystones } = useAchievementStore();
    const [targetWpm, setTargetWpm] = useState(profile?.highest_wpm || 60);

    // Use metrics from prob (last session) or profile average fallback for a "Live" feel
    const displayWpm = currentMetrics.adjusted_wpm > 0 ? currentMetrics.adjusted_wpm : (profile?.avg_wpm || 0);
    const displayAcc = currentMetrics.adjusted_wpm > 0 ? currentMetrics.accuracy : 100;

    const nextLesson = CURRICULUM[unlockedIds.length - 1] || CURRICULUM[0];
    const userRank = getRankForWPM(profile?.avg_wpm || 0);

    return (
        <div
            className="flex h-full w-full p-6 gap-8 overflow-hidden animate-float-in"
            style={{
                color: 'var(--text-primary)'
            }}
        >
            {/* === 1. NAVIGATION ASIDE === */}
            <aside className="w-[300px] flex flex-col gap-6 h-full shrink-0">
                {/* User Info */}
                <div className="glass-panel p-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 glass-panel rounded-[1.2rem] flex items-center justify-center shadow-xl overflow-hidden">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} className="w-full h-full object-cover" alt="User" />
                                ) : (
                                    <span className="font-black text-[var(--text-accent)] text-xl">{user?.name?.charAt(0) || 'P'}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0] || 'Pro Typist'}</h1>
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-2 inline-block bg-[var(--accent-soft)] text-[var(--text-accent)]">
                                    {userRank.name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel backdrop-blur-md rounded-2xl h-12 px-5 flex items-center text-sm font-semibold focus-within:bg-[var(--glass-hover)] transition-all shadow-inner">
                        <Mic size={18} className="mr-3 text-[var(--text-accent)]" />
                        <span className="truncate opacity-90 italic text-[var(--text-secondary)]">AI Coach Listening...</span>
                    </div>
                </div>

                {/* Primary Navigation */}
                <div className="glass-panel flex-1 p-5 flex flex-col gap-2 overflow-y-auto shadow-2xl">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-3 text-[var(--text-accent)] opacity-90">Neural Operations</div>
                    <NavItem icon={Home} label="System Status" active onClick={() => onSetView('dashboard')} />
                    <NavItem icon={Activity} label="Performance Lab" onClick={() => onSetView('analytics')} />
                    <NavItem icon={Trophy} label="Elite Credentials" onClick={() => onSetView('certification')} />
                    <NavItem icon={Users} label="Global Grid" onClick={() => onSetView('social')} />

                    <NavItem icon={Settings} label="Configuration" onClick={() => onSetView('settings')} />

                    <div className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-3 mt-6 text-[var(--text-accent)] opacity-90">Next Assignment</div>
                    <div
                        className="p-5 glass-panel rounded-[2rem] mb-2 hover:bg-[var(--glass-hover)] transition-all cursor-pointer group"
                        onClick={() => onStartLesson(nextLesson)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-accent)]">{nextLesson.stage}</div>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform opacity-80" />
                        </div>
                        <div className="font-black text-lg leading-tight truncate text-[var(--text-primary)]">{nextLesson.title}</div>
                    </div>
                </div>

                {/* Account Widget */}
                <div className="glass-panel-dark p-8 relative overflow-hidden group shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]">
                    <div className="relative z-10">
                        <div className="flex justify-between mb-6">
                            <Target size={24} className="text-[var(--text-accent)]" />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse bg-[var(--text-accent)]"></div>
                                <span className="text-[8px] font-black tracking-widest opacity-90 text-[var(--text-primary)]">UP_TIME: {streak.current_streak}D</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-[var(--text-accent)] opacity-80">Vault Balance</div>
                        <div className="font-black text-3xl mb-6 group-hover:scale-105 transition-transform tracking-tighter text-[var(--text-primary)]">
                            {keystones.toLocaleString()} <small className="text-xs opacity-70 font-normal">K$</small>
                        </div>
                        <button
                            className="w-full py-3 rounded-2xl bg-[var(--glass-hover)] hover:bg-[var(--glass-active)] flex items-center justify-center transition-all font-black text-[10px] uppercase tracking-widest text-[var(--text-primary)] glass-panel"
                            onClick={() => onSetView('store')}
                        >
                            Open Market_Node
                        </button>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-20 bg-[var(--text-accent)]"></div>
                </div>
            </aside>


            {/* === 2. PERFORMANCE GRID === */}
            <main className="flex-1 grid grid-cols-4 grid-rows-2 gap-8 h-full">

                {/* AI COACH STATUS */}
                <div className="col-span-2 glass-panel-dark p-10 flex flex-col justify-between relative overflow-hidden border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight mb-1">Synaptic_Coach</h3>
                            <p className="text-[var(--text-accent)] text-sm font-semibold tracking-wide uppercase italic opacity-80">Personalized Weakness_Targeting Active</p>
                        </div>
                        <div className="p-4 rounded-[1.5rem] glass-panel shadow-inner">
                            <Cpu className="text-[var(--text-accent)]" size={24} />
                        </div>
                    </div>
                    {/* Visual Pulse Wave */}
                    <div className="flex items-end gap-1.5 h-24 justify-center opacity-80 mb-4 px-4">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="w-1.5 rounded-full animate-pulse transition-all bg-[var(--text-accent)]" style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.06}s`, boxShadow: '0 0 15px var(--text-accent)' }}></div>
                        ))}
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <button
                            className="px-6 py-2 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all bg-[var(--text-accent)]"
                            onClick={() => onSetView('selection')}
                        >
                            Initiate_Drill
                        </button>
                    </div>
                </div>

                {/* METRICS CARDS */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                    {/* Speed Card */}
                    <div className="glass-panel-dark p-8 flex flex-col justify-between border-l-4 shadow-xl group hover:scale-[1.02] transition-all" style={{ borderLeftColor: 'var(--text-accent)' }}>
                        <div className="flex justify-between items-start">
                            <div className="p-4 rounded-[1.8rem] shadow-inner transition-all group-hover:bg-[var(--glass-hover)] glass-panel text-[var(--text-accent)]">
                                <Zap size={24} />
                            </div>
                            <div className="bg-[var(--glass-active)] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--text-accent)]">Velocity</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-1 text-[var(--text-accent)] opacity-80">Mean Session Spd</div>
                            <div className="text-5xl font-black text-[var(--text-primary)] tracking-tighter">
                                {Math.round(displayWpm)} <small className="text-lg opacity-60">WPM</small>
                            </div>
                        </div>
                    </div>
                    {/* Accuracy Card */}
                    <div className="glass-panel p-8 flex flex-col justify-between shadow-xl group hover:scale-[1.02] transition-all">
                        <div className="flex justify-between items-start">
                            <div className="p-4 rounded-[1.8rem] shadow-inner transition-all group-hover:scale-110 glass-panel text-[var(--text-accent)]">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="bg-[var(--glass-active)] glass-panel px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--text-accent)]">Precision</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-1 text-[var(--text-accent)] opacity-80">Consistency Index</div>
                            <div className="text-5xl font-black tracking-tighter text-[var(--text-primary)]">
                                {Math.round(displayAcc)}<small className="text-xl">%</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TELEMETRY CHART */}
                <div className="col-span-2 glass-panel-dark p-10 relative overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <h3 className="text-[var(--text-primary)] text-xl font-black tracking-tight flex items-center gap-3">
                            <BarChart3 className="text-[var(--text-accent)]" size={20} /> Neural_Telemetry
                        </h3>
                        <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-[var(--text-accent)]"></div>
                            <span className="text-[10px] font-black text-[var(--text-primary)] opacity-80 tracking-[0.2em]">LIVE_FEED</span>
                        </div>
                    </div>
                    <div className="h-40 w-full flex items-end relative z-10 transition-all">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <path
                                d="M0,80 C50,60 100,100 150,40 S250,80 300,20 S450,120 600,60"
                                stroke="var(--text-accent)"
                                strokeWidth="5"
                                fill="none"
                                className="transition-all duration-1000"
                                style={{ filter: 'drop-shadow(0 0 10px var(--text-accent))' }}
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
                            <span className="text-[10px] font-black uppercase tracking-widest block leading-none mb-1 text-[var(--text-accent)] opacity-80">Goal Protocol</span>
                            <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]">THR_SPEED</span>
                        </div>
                        <div className="p-2 rounded-xl glass-panel text-[var(--text-accent)]">
                            <Zap size={20} />
                        </div>
                    </div>

                    <div className="relative w-56 h-56 flex items-center justify-center group/dial cursor-pointer scale-110">
                        {/* Static Frame */}
                        <div className="absolute inset-0 rounded-full border-[1px] border-dashed transition-transform group-hover/dial:rotate-45 duration-1000 border-white/20"></div>
                        <div className="absolute inset-8 rounded-full shadow-2xl transition-all glass-panel backdrop-blur-md"></div>

                        {/* Dynamic Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                            <circle
                                cx="112" cy="112" r="92"
                                stroke="var(--text-accent)"
                                strokeWidth="14"
                                fill="none"
                                strokeDasharray="578"
                                strokeDashoffset={578 - (578 * (targetWpm / 150))}
                                strokeLinecap="round"
                                className="transition-all duration-700"
                                style={{ filter: 'drop-shadow(0 0 8px var(--text-accent))' }}
                            />
                        </svg>

                        <div className="relative z-10 text-center select-none text-[var(--text-primary)]">
                            <div className="flex items-start justify-center">
                                <span className="text-6xl font-black tracking-tighter tabular-nums">{targetWpm}</span>
                                <span className="text-xl font-black opacity-60 mt-2">W</span>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] mt-3 px-4 py-1.5 rounded-full border text-[var(--text-accent)] border-[var(--text-accent)] bg-[var(--accent-soft)]">Target_Set</div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full justify-center pt-10">
                        <button
                            className="w-16 h-16 rounded-[2.2rem] flex items-center justify-center transition-all active:scale-95 text-3xl font-black shadow-lg glass-panel text-[var(--text-primary)]"
                            onClick={() => setTargetWpm(prev => Math.max(10, prev - 5))}
                        >
                            <Minus size={24} />
                        </button>
                        <button
                            className="w-16 h-16 rounded-[2.2rem] flex items-center justify-center text-3xl font-black shadow-2xl transition-all active:scale-95 bg-[var(--text-accent)] text-white"
                            onClick={() => setTargetWpm(prev => Math.min(150, prev + 5))}
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* CHALLENGE TILE */}
                <div
                    className="col-span-1 glass-panel p-10 flex flex-col items-center justify-center border-dashed border-4 gap-5 hover:bg-[var(--glass-hover)] transition-all cursor-pointer group"
                    onClick={() => onSetView('selection')}
                >
                    <div className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all bg-[var(--text-accent)]">
                        <Plus size={40} className="text-white" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Initiate_Match</span>
                </div>

            </main>
        </div>
    );
}

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-[1.8rem] w-full transition-all group ${active
            ? 'bg-[var(--glass-active)] shadow-xl font-black'
            : 'hover:bg-[var(--glass-hover)]'
            }`}
        style={{ color: 'var(--text-primary)' }}
    >
        <div className={`p-2.5 rounded-2xl transition-all ${active
            ? 'bg-[var(--text-accent)] text-white shadow-lg'
            : 'bg-[var(--accent-soft)] text-[var(--text-accent)] opacity-80 group-hover:opacity-100'
            }`}>
            <Icon size={20} />
        </div>
        <span className="text-sm tracking-tight opacity-90">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--text-accent)' }}></div>}
    </button>
);
