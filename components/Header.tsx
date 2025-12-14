import { getAppVersion } from '../utils/appVersion';
import React, { useState, useEffect } from 'react';
import {
  PanelLeft, ChevronLeft, ChevronRight, User, Settings,
  BarChart2, Award, History, Moon, Sun, VideoIcon, LogIn, LogOut
} from 'lucide-react';
import { UserProfile } from '../types';
import { LESSONS } from '../constants';
import { AuthUser } from '../services/authService';

interface HeaderProps {
  currentLessonId: number;
  totalLessons: number;
  progress: number;
  onSelectLesson: (id: number) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenAchievements: () => void;
  onOpenDashboard: () => void;
  onOpenTutorials: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  unlockedLessons: Record<number, boolean>;
  currentProfile: UserProfile;
  onSwitchProfile: () => void;
  onToggleSidebar: () => void;
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
}
className = "flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
title = "Switch Profile"
  >
  {
    user?.picture?(
    <img src = { user.picture } alt = "Avatar" className = "w-5 h-5 rounded-full" />
  ): (
        <User className = "w-3.5 h-3.5" />
  )}
<span className="hidden lg:inline max-w-[80px] truncate">{currentProfile.name}</span>
</button >

const Header: React.FC<HeaderProps> = ({
  currentLessonId,
  totalLessons,
  progress,
  onSelectLesson,
  onOpenSettings,
  onOpenHistory,
  onOpenAchievements,
  onOpenDashboard,
  onOpenTutorials,
  toggleDarkMode,
  isDarkMode,
  unlockedLessons,
  currentProfile,
  onSwitchProfile,
  onToggleSidebar,
  user,
  onLogin,
  onLogout,
}) => {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    getAppVersion().then(setVersion);
  }, []);

  return (
    <header className="h-[52px] bg-white/80 dark:bg-[#111827]/90 backdrop-blur-md flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 fixed top-0 w-full z-50 select-none shadow-sm transition-colors duration-200">
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[#007AFF] transition-all duration-300 ease-out z-50"
        style={{ width: `${progress}%` }}
      />

      {/* Left: Branding & Sidebar Toggle */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          title="Toggle Course Map"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <img src="logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        <div className="flex flex-col leading-none">
          <div className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">
            TypingPro
          </div>
          <button
            onClick={() => {
              // Placeholder Update Logic
              alert(`TypingPro v${version}\n\nYou are on the latest version.`);
            }}
            className="text-[10px] text-gray-400 font-mono pl-0.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-left"
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
          className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50">
          {LESSONS.map((lesson) => {
            const isActive = lesson.id === currentLessonId;
            const isCompleted = lesson.id < currentLessonId;
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
                        ${isActive
                      ? 'bg-gray-800 dark:bg-white scale-125 shadow-sm'
                      : isCompleted
                        ? 'bg-[#34C759]'
                        : isUnlocked
                          ? 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                          : 'bg-gray-200 dark:bg-gray-700'
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
          className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 min-w-[200px] justify-end">

        <div className="flex items-center gap-1">
          {/* User / Profile Area */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-1">
            {/* If user is logged in via Firebase, show Logout, else Login */}
            {user ? (
              <button
                onClick={onLogout}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
                title="Sign in with Google"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            <button
              onClick={onSwitchProfile}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
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
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenDashboard}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Stats Dashboard"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenTutorials}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Video Tutorials"
          >
            <VideoIcon className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAchievements}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Achievements"
          >
            <Award className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHistory}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="History"
          >
            <History className="w-4 h-4" />
          </button>



          <button onClick={onOpenSettings} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
