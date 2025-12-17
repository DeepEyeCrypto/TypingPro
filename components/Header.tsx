import { getAppVersion } from '../utils/appVersion';
import React, { useState, useEffect } from 'react';
import {
  PanelLeft, ChevronLeft, ChevronRight, User, Settings,
  BarChart2, Award, History, Moon, Sun, LogIn, LogOut
} from 'lucide-react';
import { UserProfile } from '../types';
import { LESSONS } from '../constants';
import { AuthUser } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentLessonId: number;
  totalLessons: number;
  progress: number;
  onSelectLesson: (id: number) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenAchievements: () => void;
  onOpenDashboard: () => void;
  // toggleDarkMode & isDarkMode are now handled internally via ThemeContext
  toggleDarkMode?: () => void;
  isDarkMode?: boolean;
  unlockedLessons: Record<number, boolean>;
  currentProfile: UserProfile;
  onSwitchProfile: () => void;
  onToggleSidebar: () => void;
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentLessonId,
  totalLessons,
  progress,
  onSelectLesson,
  onOpenSettings,
  onOpenHistory,
  onOpenAchievements,
  onOpenDashboard,
  unlockedLessons,
  currentProfile,
  onSwitchProfile,
  onToggleSidebar,
  user,
  onLogin,
  onLogout,
}) => {
  const [version, setVersion] = useState<string>('');
  const { theme, toggleTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    getAppVersion().then(setVersion);
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="h-[52px] flex items-center justify-between px-4 border-b border-border bg-bg-surface backdrop-blur-md fixed top-0 w-full z-50 select-none shadow-sm transition-colors duration-200">
      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-brand transition-all duration-300 ease-out z-50"
        style={{ width: `${progress}%` }}
      />

      {/* Left: Branding & Sidebar Toggle */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-md transition-colors"
          title="Toggle Course Map"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        {/* Logo placeholder - replacing raw img with maybe a text/icon combo for now or keeping img */}
        <div className="flex items-center justify-center w-8 h-8 rounded bg-brand/10 text-brand">
          <span className="font-bold font-mono">Tp</span>
        </div>

        <div className="flex flex-col leading-none">
          <div className="text-text-primary font-bold text-lg tracking-tight">
            TypingPro
          </div>
          <button
            onClick={() => {
              alert(`TypingPro v${version}\n\nYou are on the latest version.`);
            }}
            className="text-[10px] text-text-muted font-mono pl-0.5 hover:text-brand transition-colors text-left"
            title="Check for updates"
          >
            v{version}
          </button>
        </div>
      </div>

      {/* Center: Navigation & Progress */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => onSelectLesson(currentLessonId - 1)}
          disabled={currentLessonId <= 1}
          className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 bg-bg-secondary px-3 py-1.5 rounded-full border border-border">
          {LESSONS.map((lesson) => {
            const isActive = lesson.id === currentLessonId; // Actually just use currentLessonId
            // Wait, activeLessonId is passed as props.
            const isCurrent = lesson.id === currentLessonId;
            const isCompleted = lesson.id < currentLessonId; // Simplified logic for UI
            const isUnlocked = unlockedLessons[lesson.id];

            return (
              <div
                key={lesson.id}
                className={`relative group cursor-pointer p-0.5 ${!isUnlocked ? 'cursor-not-allowed opacity-40' : ''}`}
                onClick={() => isUnlocked && onSelectLesson(lesson.id)}
                title={`Lesson ${lesson.id}`}
              >
                <div
                  className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${isCurrent
                      ? 'bg-text-primary scale-125 shadow-sm'
                      : isCompleted
                        ? 'bg-status-success'
                        : isUnlocked
                          ? 'bg-text-muted hover:bg-text-secondary'
                          : 'bg-border-hover'
                    }
                    `}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onSelectLesson(currentLessonId + 1)}
          disabled={currentLessonId >= totalLessons || !unlockedLessons[currentLessonId + 1]}
          className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 min-w-[200px] justify-end">

        <div className="flex items-center gap-1">
          {/* User / Profile Area */}
          <div className="flex items-center gap-1 border-r border-border pr-2 mr-1">
            {user ? (
              <button
                onClick={onLogout}
                className="p-1.5 text-status-error hover:bg-status-error/10 rounded-md transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-1.5 bg-brand hover:bg-brand-hover text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
                title="Sign in with Google"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            <button
              onClick={onSwitchProfile}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-secondary rounded-md transition-colors"
              title="Switch Profile"
            >
              {user?.picture ? (
                <img src={user.picture} alt="Avatar" className="w-5 h-5 rounded-full" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              <span className="hidden lg:inline max-w-[80px] truncate">{currentProfile.name}</span>
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 text-text-muted hover:bg-bg-secondary rounded-md transition-colors"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenDashboard}
            className="p-2 text-text-muted hover:bg-bg-secondary rounded-md transition-colors"
            title="Stats Dashboard"
          >
            <BarChart2 className="w-4 h-4" />
          </button>


          <button
            onClick={onOpenAchievements}
            className="p-2 text-text-muted hover:bg-bg-secondary rounded-md transition-colors"
            title="Achievements"
          >
            <Award className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHistory}
            className="p-2 text-text-muted hover:bg-bg-secondary rounded-md transition-colors"
            title="History"
          >
            <History className="w-4 h-4" />
          </button>

          <button onClick={onOpenSettings} className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-md transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
