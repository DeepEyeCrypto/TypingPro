// ═══════════════════════════════════════════════════════════════════
// TOP BAR: VisionOS-style global HUD with Auth Integration
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface TopBarProps {
  stats?: {
    wpm?: number;
    accuracy?: number;
    streak?: number;
  };
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const TopBar: React.FC<TopBarProps> = ({ stats, onSettingsClick, onProfileClick }) => {
  const { user, logout, login, isLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="glass-unified flex items-center justify-between px-8 py-4 mb-6 h-16 shrink-0 transition-all">

      {/* 1. BRANDING & IDENTITY */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 glass-pill flex items-center justify-center text-gray-900 shadow-xl font-black">P</div>
        <h1 className="text-sm font-black text-white tracking-[0.2em] italic">
          TYPING<span className="text-yellow-400 not-italic">PRO</span>
        </h1>
      </div>

      {/* 2. STATS CLUSTER (STAGE 4 REQUIREMENTS) */}
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">Velocity</span>
          <span className="text-lg font-black text-white tabular-nums">{stats?.wpm ?? 0} <small className="text-[9px] opacity-20">WPM</small></span>
        </div>
        <div className="w-px h-6 bg-white/5" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">Precision</span>
          <span className="text-lg font-black text-white tabular-nums">{stats?.accuracy ?? 100}%</span>
        </div>
        <div className="w-px h-6 bg-white/5" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">Active Loop</span>
          <span className="text-lg font-black text-cyan-400 tabular-nums">{stats?.streak ?? 0}D</span>
        </div>
      </div>

      {/* 3. USER & ACTIONS */}
      <div className="flex items-center gap-4">
        {/* Settings Button */}
        <button
          onClick={onSettingsClick}
          className="glass-pill p-2.5 text-gray-900 shadow-lg hover:scale-110 active:scale-95 transition-all"
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>

        {/* User Avatar / Login */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full border border-white/10 glass-unified overflow-hidden hover:border-cyan-400/50 transition-all shadow-xl group"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500/40 to-purple-500/40 flex items-center justify-center text-sm font-black text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 glass-unified rounded-xl p-2 z-50 shadow-2xl border border-white/10">
                  {/* User Info Header */}
                  <div className="px-3 py-2 border-b border-white/10 mb-2">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    {user.email && (
                      <p className="text-[10px] text-white/50 truncate">{user.email}</p>
                    )}
                    <span className="inline-block mt-1 text-[8px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                      {user.provider}
                    </span>
                  </div>

                  {/* Profile Link */}
                  <button
                    onClick={() => { onProfileClick?.(); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <UserIcon />
                    <span className="font-medium">Profile</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogoutIcon />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Google Login */}
            <button
              onClick={() => login('google')}
              disabled={isLoading}
              className="w-10 h-10 rounded-full border border-white/10 glass-unified overflow-hidden hover:border-white/40 transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
              title="Sign in with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            {/* GitHub Login */}
            <button
              onClick={() => login('github')}
              disabled={isLoading}
              className="w-10 h-10 rounded-full border border-white/10 glass-unified overflow-hidden hover:border-white/40 transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center text-white"
              title="Sign in with GitHub"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </button>
            {isLoading && (
              <span className="text-[8px] font-black text-cyan-400 animate-pulse tracking-widest uppercase">
                CONNECTING...
              </span>
            )}
          </div>
        )}
      </div>

    </header>
  );
};

export default TopBar;

