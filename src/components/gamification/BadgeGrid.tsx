// ═══════════════════════════════════════════════════════════════════
// BADGE GRID - Display all badges in categorized grid
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Badge, BadgeCategory } from '../../types/badges';
import { BadgeCard } from './BadgeCard';

interface BadgeWithStatus extends Badge {
    unlocked: boolean;
    progress: number;
}

interface BadgeGridProps {
    badges: BadgeWithStatus[];
    onBadgeClick?: (badge: Badge) => void;
}

const CATEGORIES: { id: BadgeCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'speed', label: 'Speed' },
    { id: 'accuracy', label: 'Accuracy' },
    { id: 'streak', label: 'Streak' },
    { id: 'special', label: 'Special' },
];

export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges, onBadgeClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');

    const filteredBadges = selectedCategory === 'all'
        ? badges
        : badges.filter(b => b.category === selectedCategory);

    const unlockedCount = badges.filter(b => b.unlocked).length;

    return (
        <div>
            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Badges</h2>
                <div className="text-sm text-white/60">
                    <span className="text-[#00ff41]">{unlockedCount}</span>/{badges.length} Unlocked
                </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedCategory === cat.id
                                ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30'
                                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                            }
            `}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Badge grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredBadges.map(badge => (
                    <div
                        key={badge.id}
                        onClick={() => onBadgeClick?.(badge)}
                        className="cursor-pointer"
                    >
                        <BadgeCard
                            badge={badge}
                            unlocked={badge.unlocked}
                            progress={badge.progress}
                        />
                    </div>
                ))}
            </div>

            {filteredBadges.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    No badges in this category yet
                </div>
            )}
        </div>
    );
};
