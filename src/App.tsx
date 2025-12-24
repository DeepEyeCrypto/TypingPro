import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TypingArea from './components/TypingArea';
import StatsBar from './components/StatsBar';
import LoginPanel from './components/LoginPanel';
import LessonBank from './components/LessonBank';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import HeatMap from './components/HeatMap';
import { useTypingStore } from './stores/typingStore';
import { useAuthStore } from './stores/authStore';
import { LESSONS } from './data/lessons';
import './styles/glass.css';

type View = 'typing' | 'lessons' | 'leaderboard' | 'achievements' | 'analytics' | 'settings';

const App: React.FC = () => {
    const { currentLessonId, currentText, isStarted, isComplete, wpm, accuracy, time, setLesson } = useTypingStore();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [view, setView] = useState<View>('typing');

    React.useEffect(() => {
        if (!currentLessonId) {
            setLesson(LESSONS[0].id, LESSONS[0].text);
        }
    }, [currentLessonId, setLesson]);

    if (!isAuthenticated && !user) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center p-8">
                <LoginPanel />
            </div>
        );
    }

    const renderView = () => {
        switch (view) {
            case 'typing':
                return (
                    <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
                        <StatsBar wpm={wpm} accuracy={accuracy} time={time} isStarted={isStarted} />
                        <TypingArea text={currentText} />
                        {!isStarted && !isComplete && (
                            <p className="text-gray-500 animate-pulse text-lg">
                                Start typing to begin your practice session...
                            </p>
                        )}
                    </div>
                );
            case 'lessons':
                return <LessonBank onSelect={(lesson) => { setLesson(lesson.id, lesson.text); setView('typing'); }} />;
            case 'leaderboard':
                return <Leaderboard />;
            case 'achievements':
                return <Achievements />;
            case 'analytics':
                return <HeatMap />;
            case 'settings':
                return (
                    <div className="ios-glass p-12 text-center w-full max-w-2xl">
                        <h2 className="text-3xl font-bold mb-4">Settings</h2>
                        <p className="text-gray-500">Theme and Font customization settings coming soon.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden flex flex-col p-8 font-sans">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('typing')}>
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">
                        T
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">TypingPro</h1>
                </div>

                <nav className="flex items-center gap-6">
                    <NavButton active={view === 'lessons'} label="Lessons" onClick={() => setView('lessons')} />
                    <NavButton active={view === 'leaderboard'} label="Global" onClick={() => setView('leaderboard')} />
                    <NavButton active={view === 'achievements'} label="Badges" onClick={() => setView('achievements')} />
                    <NavButton active={view === 'analytics'} label="Analytics" onClick={() => setView('analytics')} />
                    <NavButton active={view === 'settings'} label="Settings" onClick={() => setView('settings')} />

                    <div className="group relative ml-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 font-bold cursor-pointer overflow-hidden transition-all hover:border-blue-500">
                            {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user?.name.charAt(0)}
                        </div>
                        <div className="absolute right-0 mt-3 w-48 ios-glass p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="px-4 py-2 border-b border-white/5 mb-1">
                                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">Sign Out</button>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full overflow-hidden">
                {renderView()}
            </main>

            <footer className="mt-8 flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-500 border-t border-white/5 pt-6">
                <div className="flex gap-8">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                        <span>Server Online</span>
                    </div>
                    <span>Tab + Enter to restart</span>
                    <span className="text-blue-500/50 hover:text-blue-500 transition-colors cursor-pointer">Support</span>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-blue-500 font-bold">v0.1.55</span>
                    <span className="opacity-50">TypingPro Ultimate Scratch Build</span>
                </div>
            </footer>
        </div>
    );
};

const NavButton = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`text-sm font-semibold transition-all relative py-1 px-2 ${active ? 'text-blue-500' : 'text-gray-500 hover:text-white'
            }`}
    >
        {label}
        {active && (
            <motion.div
                layoutId="activeNav"
                className="absolute -bottom-1 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
            />
        )}
    </button>
);

export default App;
