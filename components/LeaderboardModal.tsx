import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Users, Globe, Target, Zap, Award } from 'lucide-react';
import styles from './TypingArea.module.css';

interface LeaderboardEntry {
  rank: number;
  username: string;
  wpm: number;
  accuracy: number;
  avatar?: string;
  country?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'global' | 'friends' | 'local';
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, mode }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'all-time'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<'wpm' | 'accuracy'>('wpm');

  // Mock data - replace with real API calls
  const [leaderboardData, setLeaderboardData] = useState<Record<string, LeaderboardEntry[]>>({
    daily: [
      { rank: 1, username: "SpeedDemon", wpm: 156, accuracy: 99.2, country: "🇺🇸", isCurrentUser: false },
      { rank: 2, username: "TypingNinja", wpm: 148, accuracy: 98.8, country: "🇯🇵", isCurrentUser: false },
      { rank: 3, username: "You", wpm: 142, accuracy: 99.5, country: "🇮🇳", isCurrentUser: true },
      { rank: 4, username: "KeyMaster", wpm: 138, accuracy: 97.9, country: "🇩🇪", isCurrentUser: false },
      { rank: 5, username: "Blaze", wpm: 135, accuracy: 99.1, country: "🇬🇧", isCurrentUser: false },
    ],
    weekly: [
      { rank: 1, username: "SpeedDemon", wpm: 152, accuracy: 99.0, country: "🇺🇸", isCurrentUser: false },
      { rank: 2, username: "You", wpm: 145, accuracy: 99.3, country: "🇮🇳", isCurrentUser: true },
      { rank: 3, username: "TypingNinja", wpm: 143, accuracy: 98.5, country: "🇯🇵", isCurrentUser: false },
    ],
    'all-time': [
      { rank: 1, username: "Legend", wpm: 187, accuracy: 99.8, country: "🇸🇪", isCurrentUser: false },
      { rank: 2, username: "SpeedDemon", wpm: 165, accuracy: 99.1, country: "🇺🇸", isCurrentUser: false },
      { rank: 3, username: "You", wpm: 142, accuracy: 99.5, country: "🇮🇳", isCurrentUser: true },
    ]
  });

  const currentData = useMemo(() => leaderboardData[activeTab] || [], [leaderboardData, activeTab]);

  const sortedData = useMemo(() => {
    return [...currentData].sort((a, b) => {
      if (selectedCategory === 'wpm') {
        return b.wpm - a.wpm;
      } else {
        return b.accuracy - a.accuracy;
      }
    });
  }, [currentData, selectedCategory]);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-400';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'none' // Performance optimized
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">
                {mode === 'global' ? 'Global' : mode === 'friends' ? 'Friends' : 'Local'} Leaderboard
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-800 p-1 rounded-xl">
            {['daily', 'weekly', 'all-time'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab === 'daily' ? 'Daily' : tab === 'weekly' ? 'Weekly' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Category Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-400">Sort by:</span>
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setSelectedCategory('wpm')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === 'wpm'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-1" />
                WPM
              </button>
              <button
                onClick={() => setSelectedCategory('accuracy')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === 'accuracy'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Target className="w-4 h-4 inline mr-1" />
                Accuracy
              </button>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {sortedData.map((entry) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: entry.rank * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  entry.isCurrentUser
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                }`}
              >
                {/* Rank */}
                <div className={`text-2xl font-black ${getRankColor(entry.rank)} min-w-[60px] text-center`}>
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  {entry.country && (
                    <span className="absolute -bottom-1 -right-1 text-lg">{entry.country}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{entry.username}</span>
                    {entry.isCurrentUser && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">YOU</span>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {entry.wpm} WPM
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {entry.accuracy}%
                    </span>
                  </div>
                </div>

                {/* Achievements */}
                {entry.rank <= 3 && (
                  <div className="flex gap-1">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {sortedData.filter(e => e.wpm > 100).length}
              </div>
              <div className="text-sm text-gray-400">100+ WPM Club</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(sortedData.reduce((acc, e) => acc + e.accuracy, 0) / sortedData.length)}%
              </div>
              <div className="text-sm text-gray-400">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {sortedData.length}
              </div>
              <div className="text-sm text-gray-400">Total Racers</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeaderboardModal;
