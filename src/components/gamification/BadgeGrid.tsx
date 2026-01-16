// ═══════════════════════════════════════════════════════════════════
// BADGE GRID - Display all badges in categorized grid
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Badge, BadgeCategory } from '../../types/badges';
import { BadgeCard } from './BadgeCard';
import { GlassSurface } from '../ui/glass/GlassSurface';

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
        <div className="space-y-6">
            {/* Stats */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Registry_Vault</h2>
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Operational_Telemetry_Inquiry</span>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-white tabular-nums">{unlockedCount} / {badges.length}</div>
                    <div className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Status_Unsynced_Indices</div>
                </div>
            </div>

            {/* Category tabs */}
            <GlassSurface
                elevation="low"
                cornerRadius="md"
                className="flex gap-2 p-1.5 bg-white/5 border-white/10 mb-8 overflow-x-auto scrollbar-hide"
            >
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-lg whitespace-nowrap
                            ${selectedCategory === cat.id
                                ? 'bg-white text-black shadow-glow translate-y-[-1px]'
                                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                            }
                        `}
                    >
                        {cat.label}
                    </button>
                ))}
            </GlassSurface>

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
                <div className="text-center py-12 text-white opacity-40">
                    No badges in this category yet
                </div>
            )}
        </div>
    );
};
