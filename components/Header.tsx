import React, { useState, useEffect } from 'react';
import {
  PanelLeft, ChevronLeft, ChevronRight, User, Settings,
  BarChart2, Award, History, Moon, Sun, LogIn, LogOut
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
    lessonProgress
  } = useApp();

  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    getAppVersion().then(setVersion);
  }, []);

  const isDark = resolvedTheme === 'dark';
  const totalLessons = LESSONS.length;
  const progress = (activeLessonId / totalLessons) * 100;

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white/5 backdrop-blur-2xl border-b border-white/10 select-none">
      {/* Progress Line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-cyber-cyan shadow-[0_0_10px_rgba(0,242,255,0.8)] transition-all duration-500"
        style={{ width: `${progress}%` }}
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan font-black shadow-cyan-glow group-hover:scale-110 transition-transform">T</div>
          <span className="cyber-title font-black text-2xl tracking-tighter">TypingPro</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyber-cyan/40 uppercase tracking-widest mt-1">SYS_v{version}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-4 py-2 glass-panel border-cyber-cyan/20 rounded-xl group transition-all hover:border-cyber-cyan/50 h-11">
          {currentProfile.avatar ? (
            <img src={currentProfile.avatar} alt={currentProfile.name} className="w-8 h-8 rounded-full border border-cyber-cyan/30 shadow-cyan-glow group-hover:scale-110 transition-transform" />
          ) : (
            <User size={18} className="text-cyber-cyan" />
          )}
          <div className="flex flex-col -space-y-1">
            <span className="text-[10px] font-mono text-cyber-cyan/40 uppercase tracking-tighter">Authorized</span>
            <span className="text-sm font-sci-fi font-bold text-white/90">{currentProfile.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            className="p-2 text-white/40 hover:text-cyber-cyan hover:shadow-cyan-glow transition-all rounded-lg"
            title="Toggle Fullscreen"
          >
            <PanelLeft size={20} />
          </button>
          <button onClick={toggleTheme} className="p-2 text-white/40 hover:text-cyber-cyan hover:shadow-cyan-glow transition-all rounded-lg">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 text-white/40 hover:text-cyber-violet hover:shadow-violet-glow transition-all rounded-lg">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
