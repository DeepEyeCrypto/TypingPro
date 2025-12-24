import React, { useState } from 'react';
import TypingAreaV2 from './components/TypingAreaV2';
import { useTypingStore } from './stores/typingStore';
import './styles/LiquidGlass.css';

const App: React.FC = () => {
    const [text] = useState("The evolution of speed requires the precision of Rust. TypingPro: Rust-Core delivers sub-millisecond latency for the ultimate typing performance.");

    return (
        <div className="h-screen w-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans">
            {/* SVG Filters for Liquid Glass Effect */}
            <svg className="filters-svg">
                <defs>
                    <filter id="liquid-refraction">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="2" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            {/* Header */}
            <header className="p-10 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl text-black font-black text-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        T
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight liquid-text">TypingPro</h1>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Rust-Core v0.2.0</p>
                    </div>
                </div>

                <nav className="flex gap-8">
                    <button className="liquid-button px-6 py-2 text-sm">Curriculum</button>
                    <button className="liquid-button px-6 py-2 text-sm">Leaderboard</button>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
                </nav>
            </header>

            {/* Main Experience */}
            <main className="flex-1 flex flex-col items-center justify-center px-10">
                <div className="mb-20 flex gap-20 items-center justify-center w-full">
                    <StatBox label="Latency" value="<1ms" color="text-blue-500" />
                    <StatBox label="Engine" value="Rust v2" color="text-white/40" />
                    <StatBox label="Visuals" value="iOS 26" color="text-white/40" />
                </div>

                <TypingAreaV2 text={text} />

                <div className="mt-20 opacity-20 text-[10px] uppercase tracking-[0.5em] font-bold">
                    Reactive Liquid Surface Active
                </div>
            </main>

            {/* Footer */}
            <footer className="p-10 flex justify-between items-center text-[10px] text-white/20 font-bold tracking-widest uppercase">
                <div>Sub-Millisecond Keystroke Processing</div>
                <div>Built with Antigravity & Rust</div>
            </footer>
        </div>
    );
};

const StatBox = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{label}</span>
        <span className={`text-4xl font-black tracking-tighter ${color}`}>{value}</span>
    </div>
);

export default App;
