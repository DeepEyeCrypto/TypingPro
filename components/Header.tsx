import React, { useState, useEffect } from 'react';
import {
  User, Settings, Moon, Sun, Type, Apple, Monitor,
  BarChart3, PlayCircle, LogIn
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { HERO_CURRICULUM } from '../constants/curriculum';
import { getAppVersion } from '../utils/appVersion';

const Header: React.FC = () => {
  const {
    currentProfile,
    activeLessonId,
    isCodeMode,
    setIsCodeMode,
    setActiveModal,
    settings,
    updateUserSetting
  } = useApp();

  const activeLesson = HERO_CURRICULUM.find(l => l.id === activeLessonId) || HERO_CURRICULUM[0];
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    getAppVersion().then(setVersion);
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="h-full flex items-center justify-between px-10 bg-transparent select-none relative z-[100]">
      {/* 1. Left: Brand */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 glass-premium flex items-center justify-center text-sky-400 font-bold transition-all duration-300 group-hover:scale-110">
            <Type size={20} />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-black tracking-tighter text-white">TypingPro</span>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">v{version}</span>
          </div>
        </div>
      </div>

      {/* 2. Center: Mode & Layout Segmented Controls */}
      <div className="flex items-center gap-6">
        {/* Mode Switcher */}
        <div className="segmented-pill shadow-xl">
          <button
            onClick={() => setIsCodeMode(false)}
            className={`segmented-pill-item ${!isCodeMode ? 'segmented-pill-item-active' : 'segmented-pill-item-inactive'}`}
          >
            TEXT
          </button>
          <button
            onClick={() => setIsCodeMode(true)}
            className={`segmented-pill-item ${isCodeMode ? 'segmented-pill-item-active' : 'segmented-pill-item-inactive'}`}
          >
            CODE
          </button>
        </div>

        <div className="w-px h-6 bg-white/5" />

        {/* OS Layout Switcher */}
        <div className="segmented-pill shadow-xl">
          <button
            onClick={() => updateUserSetting('osLayout', 'win')}
            className={`segmented-pill-item flex items-center gap-1.5 ${settings.osLayout === 'win' ? 'segmented-pill-item-active' : 'segmented-pill-item-inactive'}`}
          >
            <Monitor size={12} />
            <span>WIN</span>
          </button>
          <button
            onClick={() => updateUserSetting('osLayout', 'mac')}
            className={`segmented-pill-item flex items-center gap-1.5 ${settings.osLayout === 'mac' ? 'segmented-pill-item-active' : 'segmented-pill-item-inactive'}`}
          >
            <Apple size={12} />
            <span>MAC</span>
          </button>
        </div>

        <div className="w-px h-6 bg-white/5" />

        {/* Global Utilities */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveModal('dashboard')}
            className="p-2 text-white/30 hover:text-white transition-all rounded-xl hover:bg-white/10"
            title="Performance"
          >
            <BarChart3 size={18} />
          </button>
          {activeLesson.videoUrl && (
            <button
              className="p-2 text-white/30 hover:text-white transition-all rounded-xl hover:bg-white/10"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-tutorial'))}
              title="Tutorial"
            >
              <PlayCircle size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Right: User Profile & Quick Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/5">
          <button onClick={toggleTheme} className="p-2 text-white/40 hover:text-white transition-all rounded-xl hover:bg-white/10">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setActiveModal('settings')}
            className="p-2 text-white/40 hover:text-white transition-all rounded-xl hover:bg-white/10"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="h-10 w-px bg-white/10 mx-2" />

        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
          <div className="flex flex-col items-end -space-y-0.5">
            <span className="text-xs font-black text-white">{currentProfile.name}</span>
            <span className="text-[9px] font-bold text-sky-400/60 uppercase tracking-tighter">LEVEL {currentProfile.level}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 border border-white/10 overflow-hidden shadow-inner">
            {currentProfile.avatar ? (
              <img src={currentProfile.avatar} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              <User size={18} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
