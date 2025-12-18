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
        className="absolute bottom-0 left-0 h-0.5 bg-brand transition-all duration-500"
        style={{ width: `${progress}%` }}
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand font-black">T</div>
          <span className="font-black text-xl tracking-tighter text-white">TypingPro</span>
        </div>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">v{version}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
          <User size={16} className="text-white/40" />
          <span className="text-sm font-bold text-white/80">{currentProfile.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-white/40 hover:text-white transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
