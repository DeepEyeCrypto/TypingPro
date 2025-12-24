import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glass.css';

interface LeaderboardEntry {
    rank: number;
    name: string;
    wpm: number;
    accuracy: number;
    country: string;
}

const Leaderboard: React.FC = () => {
    const mockEntries: LeaderboardEntry[] = [
        { rank: 1, name: "SpeedDemon", wpm: 156, accuracy: 99.2, country: "🇺🇸" },
        { rank: 2, name: "TypingGhost", wpm: 148, accuracy: 98.8, country: "🇯🇵" },
        { rank: 3, name: "NeonKey", wpm: 142, accuracy: 99.5, country: "🇩🇪" },
        { rank: 4, name: "CodeRacer", wpm: 138, accuracy: 97.9, country: "🇬🇧" },
        { rank: 5, name: "PixelQuick", wpm: 135, accuracy: 99.1, country: "🇮🇳" },
    ];

    return (
        <div className="w-full max-w-4xl flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1">Global Leaderboard</h2>
                    <p className="text-gray-500 text-sm italic">Top performers in the last 24 hours.</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                    <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600">Global</button>
                    <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white">Friends</button>
                </div>
            </div>

            <div className="ios-glass overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-5">User</div>
                    <div className="col-span-2 text-center">WPM</div>
                    <div className="col-span-2 text-center">Accuracy</div>
                    <div className="col-span-2 text-right">Region</div>
                </div>

                <div className="flex flex-col">
                    {mockEntries.map((entry, idx) => (
                        <motion.div
                            key={entry.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`grid grid-cols-12 gap-4 p-5 items-center transition-colors hover:bg-white/[0.03] ${idx === 2 ? 'bg-blue-600/5' : ''
                                }`}
                        >
                            <div className="col-span-1 font-bold text-lg">
                                <span className={idx < 3 ? 'text-blue-500' : 'text-gray-400'}>#{entry.rank}</span>
                            </div>
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10" />
                                <span className="font-semibold text-white">{entry.name}</span>
                                {idx === 2 && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">You</span>}
                            </div>
                            <div className="col-span-2 text-center font-bold text-blue-500 text-xl">{entry.wpm}</div>
                            <div className="col-span-2 text-center text-gray-400 font-medium">{entry.accuracy}%</div>
                            <div className="col-span-2 text-right text-xl">{entry.country}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
