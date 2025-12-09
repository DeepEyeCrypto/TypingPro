
import React from 'react';
import { EarnedBadge, Badge } from '../types';
import { BADGES } from '../constants';
import { X, Award, Footprints, Zap, Target, Crown } from 'lucide-react';

interface AchievementsModalProps {
  earnedBadges: EarnedBadge[];
  onClose: () => void;
}

const IconMap: Record<string, React.FC<any>> = {
    Footprints, Zap, Target, Award, Crown
};

const AchievementsModal: React.FC<AchievementsModalProps> = ({ earnedBadges, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                 <Award className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your milestones</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {BADGES.map(badge => {
                const isEarned = earnedBadges.some(b => b.badgeId === badge.id);
                const Icon = IconMap[badge.icon] || Award;

                return (
                    <div 
                        key={badge.id}
                        className={`
                            relative p-4 rounded-xl border flex items-start gap-4 transition-all
                            ${isEarned 
                                ? 'bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/10 border-yellow-200 dark:border-yellow-800/50 shadow-sm' 
                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60 grayscale'
                            }
                        `}
                    >
                        <div className={`
                            p-3 rounded-full flex-shrink-0
                            ${isEarned 
                                ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                            }
                        `}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`font-bold ${isEarned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                {badge.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {badge.description}
                            </p>
                            {isEarned && (
                                <span className="absolute top-4 right-4 text-[10px] font-mono text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                                    EARNED
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
