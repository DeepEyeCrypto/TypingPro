// ═══════════════════════════════════════════════════════════════════
// DEFAULT COSMETICS CATALOG - Seed data for the store
// ═══════════════════════════════════════════════════════════════════

import { Cosmetic } from '../types/cosmetics';

export const COSMETICS_CATALOG: Cosmetic[] = [
    // ─────────────────────────────────────────
    // DEFAULT (FREE) COSMETICS
    // ─────────────────────────────────────────
    {
        id: 'default-head',
        slug: 'avatar_default_head',
        name: 'Classic Head',
        description: 'The default avatar head',
        category: 'avatar_head',
        rarity: 'common',
        price_keystones: 0,
        is_default: true,
        is_available: true,
    },
    {
        id: 'default-body',
        slug: 'avatar_default_body',
        name: 'Classic Body',
        description: 'The default avatar body',
        category: 'avatar_body',
        rarity: 'common',
        price_keystones: 0,
        is_default: true,
        is_available: true,
    },
    {
        id: 'default-theme',
        slug: 'theme_midnight',
        name: 'Midnight',
        description: 'Dark theme with subtle glow',
        category: 'theme',
        rarity: 'common',
        price_keystones: 0,
        is_default: true,
        is_available: true,
    },
    {
        id: 'default-cursor',
        slug: 'cursor_default',
        name: 'Classic Cursor',
        description: 'Standard typing cursor',
        category: 'cursor',
        rarity: 'common',
        price_keystones: 0,
        is_default: true,
        is_available: true,
    },
    {
        id: 'default-sound',
        slug: 'sound_classic',
        name: 'Classic Clicks',
        description: 'Standard keyboard sounds',
        category: 'sound',
        rarity: 'common',
        price_keystones: 0,
        is_default: true,
        is_available: true,
    },

    // ─────────────────────────────────────────
    // PURCHASABLE THEMES
    // ─────────────────────────────────────────
    {
        id: 'theme-hacker',
        slug: 'theme_hacker',
        name: 'Hacker Green',
        description: 'Matrix-inspired green glow',
        category: 'theme',
        rarity: 'uncommon',
        price_keystones: 100,
        preview_url: '/cosmetics/themes/hacker.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'theme-ocean',
        slug: 'theme_ocean',
        name: 'Ocean Blue',
        description: 'Calming ocean waves',
        category: 'theme',
        rarity: 'uncommon',
        price_keystones: 100,
        preview_url: '/cosmetics/themes/ocean.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'theme-sunset',
        slug: 'theme_sunset',
        name: 'Sunset',
        description: 'Warm orange and purple gradients',
        category: 'theme',
        rarity: 'rare',
        price_keystones: 250,
        preview_url: '/cosmetics/themes/sunset.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'theme-galaxy',
        slug: 'theme_galaxy',
        name: 'Galaxy',
        description: 'Deep space nebula with stars',
        category: 'theme',
        rarity: 'epic',
        price_keystones: 500,
        preview_url: '/cosmetics/themes/galaxy.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'theme-aurora',
        slug: 'theme_aurora',
        name: 'Aurora Borealis',
        description: 'Northern lights animation',
        category: 'theme',
        rarity: 'legendary',
        price_keystones: 1000,
        preview_url: '/cosmetics/themes/aurora.svg',
        is_default: false,
        is_available: true,
    },

    // ─────────────────────────────────────────
    // PURCHASABLE CURSORS
    // ─────────────────────────────────────────
    {
        id: 'cursor-neon',
        slug: 'cursor_neon',
        name: 'Neon Glow',
        description: 'Glowing neon cursor effect',
        category: 'cursor',
        rarity: 'uncommon',
        price_keystones: 75,
        preview_url: '/cosmetics/cursors/neon.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'cursor-fire',
        slug: 'cursor_fire',
        name: 'Fire Trail',
        description: 'Leaves fire particles as you type',
        category: 'cursor',
        rarity: 'rare',
        price_keystones: 200,
        preview_url: '/cosmetics/cursors/fire.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'cursor-lightning',
        slug: 'cursor_lightning',
        name: 'Lightning',
        description: 'Electric sparks on each keystroke',
        category: 'cursor',
        rarity: 'epic',
        price_keystones: 400,
        preview_url: '/cosmetics/cursors/lightning.svg',
        is_default: false,
        is_available: true,
    },

    // ─────────────────────────────────────────
    // PURCHASABLE SOUND PACKS
    // ─────────────────────────────────────────
    {
        id: 'sound-mechanical',
        slug: 'sound_mechanical',
        name: 'Mechanical',
        description: 'Satisfying mechanical keyboard sounds',
        category: 'sound',
        rarity: 'uncommon',
        price_keystones: 50,
        is_default: false,
        is_available: true,
    },
    {
        id: 'sound-typewriter',
        slug: 'sound_typewriter',
        name: 'Typewriter',
        description: 'Vintage typewriter clicks and dings',
        category: 'sound',
        rarity: 'rare',
        price_keystones: 150,
        is_default: false,
        is_available: true,
    },
    {
        id: 'sound-scifi',
        slug: 'sound_scifi',
        name: 'Sci-Fi',
        description: 'Futuristic beeps and boops',
        category: 'sound',
        rarity: 'epic',
        price_keystones: 300,
        is_default: false,
        is_available: true,
    },

    // ─────────────────────────────────────────
    // PURCHASABLE AVATAR PARTS
    // ─────────────────────────────────────────
    {
        id: 'avatar-cat',
        slug: 'avatar_head_cat',
        name: 'Cat Ears',
        description: 'Cute cat ears for your avatar',
        category: 'avatar_head',
        rarity: 'uncommon',
        price_keystones: 100,
        preview_url: '/cosmetics/avatars/cat_head.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'avatar-robot',
        slug: 'avatar_head_robot',
        name: 'Robot Head',
        description: 'Metallic robot head',
        category: 'avatar_head',
        rarity: 'rare',
        price_keystones: 200,
        preview_url: '/cosmetics/avatars/robot_head.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'avatar-suit',
        slug: 'avatar_body_suit',
        name: 'Business Suit',
        description: 'Professional attire for the office',
        category: 'avatar_body',
        rarity: 'uncommon',
        price_keystones: 100,
        preview_url: '/cosmetics/avatars/suit.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'avatar-glasses',
        slug: 'avatar_accessory_glasses',
        name: 'Cool Shades',
        description: 'Stylish sunglasses',
        category: 'avatar_accessory',
        rarity: 'uncommon',
        price_keystones: 80,
        preview_url: '/cosmetics/avatars/glasses.svg',
        is_default: false,
        is_available: true,
    },
    {
        id: 'avatar-crown',
        slug: 'avatar_accessory_crown',
        name: 'Golden Crown',
        description: 'For typing royalty only',
        category: 'avatar_accessory',
        rarity: 'legendary',
        price_keystones: 750,
        preview_url: '/cosmetics/avatars/crown.svg',
        is_default: false,
        is_available: true,
    },
];

// Helper to get cosmetics by category
export function getCosmeticsByCategory(category: string): Cosmetic[] {
    return COSMETICS_CATALOG.filter(c => c.category === category && c.is_available);
}

// Helper to get a cosmetic by slug
export function getCosmeticBySlug(slug: string): Cosmetic | undefined {
    return COSMETICS_CATALOG.find(c => c.slug === slug);
}

// Get all default (free) cosmetics
export function getDefaultCosmetics(): Cosmetic[] {
    return COSMETICS_CATALOG.filter(c => c.is_default);
}
