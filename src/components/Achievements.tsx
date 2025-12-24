import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glass.css';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress?: number;
}

const Achievements: React.FC = () => {
    const mockAchievements: Achievement[] = [
        { id: '1', title: 'Speedster I', description: 'Reach 50 WPM in any test.', icon: '⚡', unlocked: true },
        { id: '2', title: 'Perfect Accuracy', description: 'Complete a lesson with 100% accuracy.', icon: '🎯', unlocked: true },
        { id: '3', title: 'Endurance King', description: 'Type for 10 minutes straight.', icon: '👑', unlocked: false, progress: 65 },
        { id: '4', title: 'Numpad Ninja', description: 'Complete the numbers section.', icon: '🔢', unlocked: false, progress: 20 },
        { id: '5', title: 'Speedster II', description: 'Reach 100 WPM in any test.', icon: '🚀', unlocked: false, progress: 85 },
    ];

    return (
        <div className="w-full max-w-5xl flex flex-col gap-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Your Achievements</h2>
                <p className="text-gray-500">Milestones reaching towards typing mastery.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAchievements.map((ach, idx) => (
                    <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`ios-glass p-6 flex flex-col gap-4 relative overflow-hidden group ${!ach.unlocked ? 'opacity-60 grayscale' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="text-4xl">{ach.icon}</div>
                            {ach.unlocked ? (
                                <div className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded border border-green-500/20 uppercase">Unlocked</div>
                            ) : (
                                <div className="bg-gray-500/10 text-gray-500 text-[10px] font-bold px-2 py-1 rounded border border-gray-500/20 uppercase">Locked</div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-1">{ach.title}</h3>
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                {ach.description}
                            </p>
                        </div>

                        {!ach.unlocked && ach.progress !== undefined && (
                            <div className="mt-auto space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                                    <span>Progress</span>
                                    <span>{ach.progress}%</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${ach.progress}%` }}
                                        className="h-full bg-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {ach.unlocked && (
                            <div className="absolute -bottom-2 -right-2 text-6xl opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                {ach.icon}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;
