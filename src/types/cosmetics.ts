// ═══════════════════════════════════════════════════════════════════
// COSMETIC TYPES - Data structures for the F2P cosmetics system
// ═══════════════════════════════════════════════════════════════════

import { Rarity } from '../utils/keystonesCalculator';

export type CosmeticCategory =
    | 'avatar_head'
    | 'avatar_body'
    | 'avatar_accessory'
    | 'theme'
    | 'cursor'
    | 'sound';

export interface Cosmetic {
    id: string;
    slug: string;
    name: string;
    description: string;
    category: CosmeticCategory;
    rarity: Rarity;
    price_keystones: number;
    preview_url?: string;
    is_default: boolean;
    is_available: boolean;
}

export interface UserEquipment {
    avatar: {
        head: string | null;
        body: string | null;
        accessory: string | null;
    };
    theme: string;
    cursor: string;
    sound: string;
}

export interface KeystonesTransaction {
    id: string;
    amount: number;
    reason: 'session_complete' | 'badge_unlock' | 'daily_bonus' | 'purchase' | 'challenge_complete' | 'streak_bonus';
    reference_id?: string;
    balance_after: number;
    created_at: string;
}

// Default equipment for new users
export const DEFAULT_EQUIPMENT: UserEquipment = {
    avatar: {
        head: 'avatar_default_head',
        body: 'avatar_default_body',
        accessory: null,
    },
    theme: 'midnight',
    cursor: 'default',
    sound: 'classic',
};
