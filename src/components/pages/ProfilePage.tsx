import React from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useAchievementStore } from '../../stores/achievementStore'

interface AchievementBadge {
    id: string
    name: string
    description: string
    unlocked: boolean
    icon: string
}

export const ProfilePage: React.FC = () => {
    const { user, profile } = useAuthStore()
    const { unlockedBadges, certifications } = useAchievementStore()

    // Mock achievements for visualization if store is empty or for layout demo
    const achievements: AchievementBadge[] = [
        { id: '1', name: 'First Test', description: 'Complete your first typing test', unlocked: true, icon: '🎯' },
        { id: '2', name: 'Speed Demon', description: 'Reach 100 WPM', unlocked: profile?.highest_wpm ? profile.highest_wpm >= 100 : false, icon: '⚡' },
        { id: '3', name: 'Accuracy Master', description: 'Get 99% accuracy', unlocked: false, icon: '🎯' },
        { id: '4', name: 'Marathon', description: 'Type 100,000 characters', unlocked: true, icon: '🏃' },
        { id: '5', name: 'Consistency King', description: '10 tests with 95%+ accuracy', unlocked: false, icon: '👑' },
        { id: '6', name: 'Speed Runner', description: 'Reach 120 WPM', unlocked: false, icon: '🚀' }
    ]

    return (
        <main className="w-full min-h-screen p-8 text-white relative">
            <div className="max-w-4xl mx-auto pb-20">
                {/* Profile Header */}
                <div className="glass-perfect p-8 mb-8 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-6xl text-shadow-lg p-4 bg-white/5 rounded-full border border-white/10">
                        <img src={user?.avatar_url || `https://api.dicebear.com/7.x/api/bottts/svg?seed=${user?.name || 'User'}`} alt="avatar" className="w-24 h-24 rounded-full" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2 text-white">{user?.name || 'Anonymous Typist'}</h1>
                        <p className="opacity-80 mb-2 font-mono text-cyan-400">{user?.email || 'Guest User'}</p>
                        <p className="text-sm opacity-60">Joined {profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString() : 'Recall Date: Unknown'}</p>
                    </div>
                    <button className="glass-perfect px-6 py-3 rounded-lg hover:bg-white/20 transition-all font-bold tracking-wide">
                        Edit Profile
                    </button>
                </div>

                {/* Statistics */}
                <section className="mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                    <h2 className="text-2xl font-semibold mb-4 tracking-tight">Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="glass-perfect p-6 text-center hover:scale-105 transition-transform">
                            <p className="text-sm opacity-80 mb-2 font-bold tracking-wider">TESTS</p>
                            <p className="text-3xl font-bold">{profile?.tests_completed || 0}</p>
                        </div>
                        <div className="glass-perfect p-6 text-center hover:scale-105 transition-transform">
                            <p className="text-sm opacity-80 mb-2 font-bold tracking-wider">BEST WPM</p>
                            <p className="text-3xl font-bold text-neon-lime">{Math.round(profile?.highest_wpm || 0)}</p>
                        </div>
                        <div className="glass-perfect p-6 text-center hover:scale-105 transition-transform">
                            <p className="text-sm opacity-80 mb-2 font-bold tracking-wider">AVG WPM</p>
                            <p className="text-3xl font-bold">{Math.round(profile?.avg_wpm || 0)}</p>
                        </div>
                        <div className="glass-perfect p-6 text-center hover:scale-105 transition-transform">
                            <p className="text-sm opacity-80 mb-2 font-bold tracking-wider">CHARS</p>
                            <p className="text-2xl font-bold">{(profile?.tests_completed || 0) * 150}k</p> {/* Mock calc */}
                        </div>
                        <div className="glass-perfect p-6 text-center hover:scale-105 transition-transform">
                            <p className="text-sm opacity-80 mb-2 font-bold tracking-wider">TIME</p>
                            <p className="text-2xl font-bold">{Math.round((profile?.time_spent || 0) / 60)}h</p>
                        </div>
                    </div>
                </section>

                {/* Achievements */}
                <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    <h2 className="text-2xl font-semibold mb-4 tracking-tight">Achievements</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {achievements.map(badge => (
                            <div
                                key={badge.id}
                                className={`glass-perfect p-6 text-center transition-all ${badge.unlocked ? 'border-neon-lime/30 bg-neon-lime/5' : 'opacity-40 grayscale'
                                    }`}
                            >
                                <div className="text-4xl mb-2 drop-shadow-md">{badge.icon}</div>
                                <h3 className="font-semibold mb-1 text-white">{badge.name}</h3>
                                <p className="text-xs opacity-70">{badge.description}</p>
                                {!badge.unlocked && (
                                    <p className="text-xs text-amber-400 mt-2 font-bold tracking-wider">🔒 LOCKED</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
