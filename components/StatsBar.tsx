import React from 'react';

interface StatsBarProps {
    wpm: number;
    accuracy: number;
    errors: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ wpm, accuracy, errors }) => {
    return (
        <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-16 w-full">
            <div className="text-center transform transition-transform hover:scale-105">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">WPM</div>
                <div className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-brand-dark dark:text-blue-400 transition-all duration-300">
                    {wpm}
                </div>
            </div>

            <div className="w-px h-8 sm:h-10 bg-gray-200 dark:bg-gray-700"></div>

            <div className="text-center transform transition-transform hover:scale-105">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Accuracy</div>
                <div className={`font-mono text-xl sm:text-2xl md:text-3xl font-black transition-colors duration-300 ${accuracy === 100 ? 'text-green-500' : 'text-orange-500'}`}>
                    {accuracy}%
                </div>
            </div>

            <div className="w-px h-8 sm:h-10 bg-gray-200 dark:bg-gray-700"></div>

            <div className="text-center transform transition-transform hover:scale-105">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Errors</div>
                <div className={`font-mono text-xl sm:text-2xl md:text-3xl font-black transition-colors duration-300 ${errors === 0 ? 'text-gray-400' : 'text-red-500'}`}>
                    {errors}
                </div>
            </div>
        </div>
    );
};

export default React.memo(StatsBar);
