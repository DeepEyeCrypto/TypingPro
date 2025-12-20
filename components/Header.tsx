import React, { useState, useEffect } from 'react';
import {
  PanelLeft, ChevronLeft, ChevronRight, User, Settings,
  BarChart2, Award, History, Moon, Sun, LogIn, LogOut,
  Type, Code, PlayCircle, BarChart3
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { LESSONS } from '../constants';
import { getAppVersion } from '../utils/appVersion';

/**
 * Header - Context Integrated
 * No longer requires props from App.tsx
 */
const Header: React.FC = () => {
  const {
    currentProfile,
    activeLessonId,
    lessonProgress,
    isCodeMode,
    setIsCodeMode,
    setActiveModal
  } = useApp();

  const activeLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];

  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    getAppVersion().then(setVersion);
  }, []);

  const isDark = resolvedTheme === 'dark';
  const totalLessons = LESSONS.length;
  const progress = (activeLessonId / totalLessons) * 100;

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent select-none relative z-[100]">
      {/* Subtle Bottom Border Shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Progress Line - iOS Style refinement */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-sky-400 transition-all duration-700 ease-out z-50"
        style={{ width: `${progress}%`, boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)' }}
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-500 font-bold transition-all duration-300 group-hover:bg-sky-500/20 group-hover:scale-105">
            <Type size={20} />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-bold tracking-tight text-white/90">TypingPro</span>
            <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">Version {version}</span>
          </div>
        </div>
      </div>

      {/* Central Navigation/Mode Switcher - iOS Pill Design */}
      <div className="glass-segmented backdrop-blur-3xl shadow-lg border-white/10">
        <button
          onClick={() => setIsCodeMode(false)}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold transition-all duration-500 ${!isCodeMode ? 'bg-white/15 text-white shadow-sm' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <span>Text</span>
        </button>
        <button
          onClick={() => setIsCodeMode(true)}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold transition-all duration-500 ${isCodeMode ? 'bg-white/15 text-white shadow-sm' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <span>Code</span>
        </button>

        <div className="w-px h-6 bg-white/5 mx-1" />

        <button
          onClick={() => setActiveModal('dashboard')}
          className="p-2.5 text-white/40 hover:text-white transition-all rounded-xl hover:bg-white/5"
          title="Performance"
        >
          <BarChart3 size={18} />
        </button>

        {activeLesson.videoUrl && (
          <button
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white/40 hover:text-white transition-all rounded-xl hover:bg-white/5"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-tutorial'))}
          >
            <PlayCircle size={18} />
            <span className="hidden xl:inline">Tutorial</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile - iOS Minimalist */}
        <div className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
          <div className="flex flex-col items-end -space-y-0.5">
            <span className="text-xs font-semibold text-white/90">{currentProfile.name}</span>
            <span className="text-[9px] font-medium text-white/20 uppercase tracking-wide">Pro Tier</span>
          </div>
          {currentProfile.avatar ? (
            <img src={currentProfile.avatar} alt={currentProfile.name} className="w-9 h-9 rounded-xl border border-white/10 shadow-sm" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10">
              <User size={18} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/5">
          <button onClick={toggleTheme} className="p-2 text-white/30 hover:text-white transition-all rounded-xl hover:bg-white/10">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setActiveModal('settings')}
            className="p-2 text-white/30 hover:text-white transition-all rounded-xl hover:bg-white/10"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
