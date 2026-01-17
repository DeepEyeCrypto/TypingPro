// ═══════════════════════════════════════════════════════════════════
// STORE PAGE - Cosmetics marketplace with Keystones currency
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { KeystonesDisplay } from '../../ui/KeystonesDisplay';
import { COSMETICS_CATALOG, getCosmeticsByCategory } from '../../../data/cosmetics';
import { RARITY_COLORS, Rarity } from '../../../utils/keystonesCalculator';
import { Cosmetic, CosmeticCategory } from '../../types/cosmetics';
import { useAuthStore } from '../../../core/store/authStore';

const CATEGORY_LABELS: Record<CosmeticCategory, string> = {
    theme: '🎨 Themes',
    cursor: '🖱️ Cursors',
    sound: '🔊 Sounds',
    avatar_head: '👤 Heads',
    avatar_body: '👕 Bodies',
    avatar_accessory: '✨ Accessories',
};

const CATEGORIES: CosmeticCategory[] = [
    'theme', 'cursor', 'sound', 'avatar_head', 'avatar_body', 'avatar_accessory'
];

interface StorePageProps {
    onBack?: () => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onBack }) => {
    const [selectedCategory, setSelectedCategory] = useState<CosmeticCategory>('theme');
    const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

    // Get keystones from auth store with safe defaults
    const profile = useAuthStore(state => state.profile);
    const keystones = profile?.keystones ?? 0;
    const ownedCosmetics = profile?.owned_cosmetics ?? [];

    const ownedSlugs = useMemo(() => new Set(ownedCosmetics), [ownedCosmetics]);
    const filteredCosmetics = useMemo(
        () => getCosmeticsByCategory(selectedCategory),
        [selectedCategory]
    );

    const handlePurchase = async (cosmetic: Cosmetic) => {
        if (ownedSlugs.has(cosmetic.slug)) {
            setPurchaseMessage('You already own this item!');
            return;
        }
        if (keystones < cosmetic.price_keystones) {
            setPurchaseMessage('Not enough Keystones!');
            return;
        }

        // TODO: Call API to purchase
        // await api.store.purchase(cosmetic.slug);

        setPurchaseMessage(`Purchased ${cosmetic.name}!`);
        setTimeout(() => setPurchaseMessage(null), 2000);
    };

    const getRarityBorder = (rarity: Rarity) => {
        switch (rarity) {
            case 'common': return 'border-2 border-white/5 hover:border-white/10';
            case 'uncommon': return 'border-2 border-white/10 hover:border-white/20';
            case 'rare': return 'border-2 border-white/20 hover:border-white/30';
            case 'epic': return 'border-2 border-white/30 hover:border-white/40';
            case 'legendary': return 'border-2 border-white/50 hover:border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.1)]';
            default: return 'border-2 border-white/5';
        }
    };

    return (
        <div className="w-full h-full text-white p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="text-white opacity-50 hover:opacity-100 transition-colors"
                        >
                            ← Back
                        </button>
                    )}
                    <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent uppercase italic">
                        <span className="text-pink-500 mr-2">💎</span> Cosmetics_Store
                    </h1>
                </div>
                <KeystonesDisplay amount={keystones} size="lg" />
            </div>

            {/* Purchase Message Toast */}
            {purchaseMessage && (
                <div className="fixed top-4 right-4 bg-white border border-white/10 text-white px-4 py-2 rounded-lg z-50 shadow-xl">
                    {purchaseMessage}
                </div>
            )}

            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === cat
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] border border-white/20'
                            : 'bg-white/5 text-white opacity-40 hover:opacity-100 hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        {CATEGORY_LABELS[cat]}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredCosmetics.map(cosmetic => {
                    const owned = ownedSlugs.has(cosmetic.slug);
                    const canAfford = keystones >= cosmetic.price_keystones;
                    const isFree = cosmetic.price_keystones === 0;

                    return (
                        <Card
                            key={cosmetic.slug}
                            className={`p-4 transition-all ${getRarityBorder(cosmetic.rarity)}`}
                        >
                            {/* Preview Image */}
                            <div className="aspect-square glass-perfect mb-3 flex items-center justify-center overflow-hidden shadow-inner">
                                {cosmetic.preview_url ? (
                                    <img
                                        src={cosmetic.preview_url}
                                        alt={cosmetic.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '';
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <span className="text-4xl opacity-50">
                                        {selectedCategory === 'theme' && '🎨'}
                                        {selectedCategory === 'cursor' && '🖱️'}
                                        {selectedCategory === 'sound' && '🔊'}
                                        {selectedCategory.startsWith('avatar') && '👤'}
                                    </span>
                                )}
                            </div>

                            {/* Item Info */}
                            <h3 className="text-white font-bold truncate text-sm uppercase tracking-tight">{cosmetic.name}</h3>
                            <p
                                className="text-xs uppercase tracking-wider font-bold"
                                style={{ color: RARITY_COLORS[cosmetic.rarity] }}
                            >
                                {cosmetic.rarity}
                            </p>
                            <p className="text-white opacity-40 text-xs mt-1 line-clamp-2">{cosmetic.description}</p>

                            {/* Price / Action Button */}
                            <div className="mt-3">
                                {owned || isFree ? (
                                    <Button
                                        variant="ghost"
                                        className="w-full text-xs"
                                        disabled
                                    >
                                        {isFree ? '✓ Free' : '✓ Owned'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant={canAfford ? 'primary' : 'ghost'}
                                        className="w-full text-xs"
                                        onClick={() => handlePurchase(cosmetic)}
                                        disabled={!canAfford}
                                    >
                                        💎 {cosmetic.price_keystones.toLocaleString()}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredCosmetics.length === 0 && (
                <div className="text-center py-12 text-white opacity-40">
                    <p className="text-xl mb-2">No items available</p>
                    <p className="text-sm">Check back later for new cosmetics!</p>
                </div>
            )}
        </div>
    );
};
