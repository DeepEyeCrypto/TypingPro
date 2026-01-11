// ═══════════════════════════════════════════════════════════════════
// CERTIFICATION DATA - Tier requirements and test texts
// ═══════════════════════════════════════════════════════════════════

import { CertificationRequirement, CertificationTier } from '../types/certifications';

// Certification tier requirements
export const CERTIFICATION_TIERS: CertificationRequirement[] = [
    {
        tier: 'bronze',
        name: 'Bronze',
        icon: '🥉',
        color: '#cd7f32',
        min_wpm: 30,
        min_accuracy: 95,
        test_duration_seconds: 300,
        keystones_reward: 50,
    },
    {
        tier: 'silver',
        name: 'Silver',
        icon: '🥈',
        color: '#c0c0c0',
        min_wpm: 50,
        min_accuracy: 96,
        test_duration_seconds: 300,
        keystones_reward: 100,
    },
    {
        tier: 'gold',
        name: 'Gold',
        icon: '🥇',
        color: '#ffd700',
        min_wpm: 70,
        min_accuracy: 97,
        test_duration_seconds: 300,
        keystones_reward: 200,
    },
    {
        tier: 'platinum',
        name: 'Platinum',
        icon: '💠',
        color: '#00d4aa',
        min_wpm: 90,
        min_accuracy: 98,
        test_duration_seconds: 300,
        keystones_reward: 400,
    },
    {
        tier: 'diamond',
        name: 'Diamond',
        icon: '💎',
        color: '#b9f2ff',
        min_wpm: 120,
        min_accuracy: 99,
        test_duration_seconds: 300,
        keystones_reward: 1000,
    },
];

// Official certification test texts (5 minutes worth of content)
export const CERTIFICATION_TEXTS: Record<CertificationTier, string[]> = {
    bronze: [
        `The quick brown fox jumps over the lazy dog. This simple sentence contains every letter of the alphabet. Practice makes perfect, and with dedication, you can improve your typing speed significantly. Focus on accuracy first, then gradually increase your speed. Keep your fingers on the home row and use proper technique. Remember to take breaks to avoid strain. Typing is a valuable skill in today's digital world. Whether for work, school, or personal use, good typing skills save time and increase productivity. Keep practicing every day, and you will see improvement. The journey of a thousand miles begins with a single step. Start now and build your skills one keystroke at a time. Believe in yourself and stay consistent with your practice.`,
    ],
    silver: [
        `Professional typing requires both speed and accuracy. In the modern workplace, efficient communication through written text is essential. Emails, reports, documents, and messages all require quick and accurate typing skills. The ability to type without looking at the keyboard allows you to focus on content rather than mechanics. This skill, known as touch typing, is developed through consistent practice and proper technique. Position your fingers correctly on the home row keys, and let muscle memory guide your movements. Over time, your fingers will automatically know which key to press. Quality matters as much as quantity in professional typing. One error-free document is worth more than ten documents filled with mistakes.`,
    ],
    gold: [
        `Advanced typing proficiency demonstrates mastery of keyboard mechanics and cognitive processing. Expert typists can transcribe thoughts directly into text with minimal conscious effort, achieving what psychologists call "automaticity." This cognitive state allows the mind to focus entirely on creative or analytical tasks while hands execute keystrokes reflexively. Research indicates that typing speeds above seventy words per minute correlate with increased workplace productivity and reduced cognitive load during document creation. Furthermore, advanced typists exhibit lower error rates due to well-developed proprioceptive awareness of finger positioning. The neural pathways responsible for skilled typing become increasingly efficient through deliberate practice, similar to how musicians develop motor skills through repetitive training.`,
    ],
    platinum: [
        `Elite-level typing transcends mere mechanical proficiency, representing a seamless integration of cognition and motor execution. At this tier, typists demonstrate exceptional consistency across diverse content types, from technical documentation to creative prose. The neurological adaptations required for platinum-level performance include enhanced interhemispheric connectivity, optimized procedural memory consolidation, and refined sensorimotor integration. Studies in cognitive ergonomics suggest that typists operating at ninety or more words per minute experience significantly reduced transcription latency between thought formation and textual output. This efficiency manifests in professional contexts as increased document throughput, fewer revision cycles, and enhanced capacity for simultaneous cognitive tasks such as real-time editing and content restructuring.`,
    ],
    diamond: [
        `Diamond certification represents the pinnacle of keyboard mastery, achieved by fewer than one percent of professional typists worldwide. At this extraordinary level, individuals demonstrate not merely technical proficiency but a profound synthesis of linguistic cognition, motor precision, and sustained concentration. Neuroimaging research reveals that elite typists exhibit distinctive patterns of cortical activation, characterized by heightened efficiency in premotor and supplementary motor areas. The automaticity achieved at diamond tier enables complex multitasking scenarios wherein typing becomes entirely transparent to conscious awareness, freeing cognitive resources for higher-order analytical functions. Furthermore, diamond-certified typists consistently maintain exceptional accuracy even under conditions of elevated cognitive load, temporal pressure, or environmental distraction, demonstrating remarkable resilience in their acquired motor schemas.`,
    ],
};

// Helper functions
export function getTierByName(tier: CertificationTier): CertificationRequirement | undefined {
    return CERTIFICATION_TIERS.find(t => t.tier === tier);
}

export function getNextTier(currentTier: CertificationTier): CertificationTier | null {
    const tiers: CertificationTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const currentIndex = tiers.indexOf(currentTier);
    if (currentIndex < tiers.length - 1) {
        return tiers[currentIndex + 1];
    }
    return null;
}

export function getRandomTestText(tier: CertificationTier): string {
    const texts = CERTIFICATION_TEXTS[tier];
    return texts[Math.floor(Math.random() * texts.length)];
}
