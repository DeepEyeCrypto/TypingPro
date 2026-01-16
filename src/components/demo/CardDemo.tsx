import React from 'react';
import { MasterGlassCard } from '../ui/MasterGlassCard';

export const CardDemo: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-10 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center">
            {/* Background image used to demonstrate the blur/saturation effect */}

            <MasterGlassCard className="w-full max-w-md p-8 text-left min-h-[500px] flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-500 ease-out">

                {/* Top Section: Logo & Badge */}
                <div className="flex justify-between items-start mb-6">
                    {/* Mock Google Logo */}
                    <div className="w-12 h-12 rounded-full glass-perfect flex items-center justify-center">
                        <span className="text-2xl">G</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-perfect">
                        <span className="text-white text-sm font-medium">Saved</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                    </div>
                </div>

                {/* Middle Section: Info */}
                <div className="mt-4">
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                        <span className="font-medium text-white">Google</span>
                        <span>•</span>
                        <span>20 days ago</span>
                    </div>

                    <h2 className="text-4xl text-white font-bold tracking-tight mb-6 mt-2 leading-tight">
                        UI/UX Designer
                    </h2>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {['Full-Time', 'Flexible Schedule'].map((tag) => (
                            <span key={tag} className="glass-perfect rounded-full px-5 py-2 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors cursor-default">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom Section: Footer & Action */}
                <div className="mt-auto border-t border-white/10 pt-6 flex items-end justify-between">
                    <div>
                        <div className="text-2xl font-bold text-white mb-1">$150 - $220k</div>
                        <div className="text-white/50 text-sm">Mountain View, CA</div>
                    </div>

                    <button className="px-6 py-3 rounded-[20px] glass-perfect text-white font-medium hover:bg-white hover:text-black transition-all duration-300">
                        Apply Now
                    </button>
                </div>

            </MasterGlassCard>
        </div>
    );
};
