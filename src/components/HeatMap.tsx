import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glass.css';

const HeatMap: React.FC = () => {
    // Simplified mock data representing error frequencies for keys
    const keyboardRows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
    ];

    const errorData: Record<string, number> = {
        'f': 12, 'j': 8, 'a': 4, 'k': 15, 'l': 3, 's': 7, 'e': 20, 'r': 5, 't': 2, 'i': 9
    };

    const getColor = (count: number) => {
        if (!count) return 'bg-white/5';
        if (count < 5) return 'bg-blue-500/20';
        if (count < 10) return 'bg-blue-500/40';
        if (count < 15) return 'bg-blue-500/60';
        return 'bg-blue-500/80 shadow-lg shadow-blue-500/20';
    };

    return (
        <div className="w-full max-w-4xl flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-1">Keystroke Heatmap</h2>
                <p className="text-gray-500 text-sm">Visual analysis of your most frequent errors.</p>
            </div>

            <div className="ios-glass p-12 flex flex-col items-center gap-4 bg-black/40">
                {keyboardRows.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-2" style={{ marginLeft: `${rIdx * 20}px` }}>
                        {row.map(key => (
                            <motion.div
                                key={key}
                                whileHover={{ scale: 1.1, zIndex: 10 }}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg uppercase transition-all duration-300 border border-white/5 ${getColor(errorData[key])}`}
                            >
                                {key}
                                {errorData[key] > 10 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-8 items-center text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white/5 rounded" /> Perfect
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500/40 rounded" /> Occasional Errors
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500/80 rounded" /> Problematic Keys
                </div>
            </div>
        </div>
    );
};

export default HeatMap;
