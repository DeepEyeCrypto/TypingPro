import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, MapPin, Briefcase, Clock, Building2 } from 'lucide-react';

interface JobCardProps {
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    schedule: string;
    logo?: string;
    isSaved?: boolean;
}

/**
 * JobCard: A high-end glassmorphism component following strict monochrome rules.
 * Stage 1: Ultra-Glass Container
 * Stage 2: Monochrome Text Engine
 * Stage 3: Inner Glass Pills
 * Stage 4: Layout Assembly
 */
export const JobCard: React.FC<JobCardProps> = ({
    title = "UI/UX Designer",
    company = "Google",
    location = "Mountain View, CA",
    salary = "$150k - $220k",
    type = "Full-Time",
    schedule = "Flexible Schedule",
    logo,
    isSaved = true
}) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className="group relative glass-perfect p-8 shadow-2xl overflow-hidden transition-all duration-500"
        >
            {/* Top Gloss Highlight */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* STAGE 4: HEADER AREA */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                        {logo ? (
                            <img src={logo} alt={company} className="w-8 h-8 object-contain" />
                        ) : (
                            <Building2 className="w-8 h-8 text-gray-100" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 font-medium text-sm group-hover:text-white transition-colors">
                            {company}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <MapPin size={12} />
                            <span>{location}</span>
                        </div>
                    </div>
                </div>

                {/* SAVED BADGE (Float Right) */}
                <button
                    className={`p-3 rounded-full transition-all duration-300 ${isSaved
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        : 'glass-perfect rounded-full text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>
            </div>

            {/* STAGE 4: MIDDLE AREA (Title + Tags) */}
            <div className="space-y-6 mb-10 relative z-10">
                <h2 className="text-2xl font-bold tracking-tight text-gray-100 group-hover:text-white transition-colors duration-300">
                    {title}
                </h2>

                <div className="flex flex-wrap gap-3">
                    {/* STAGE 3: INNER GLASS PILLS */}
                    <div className="flex items-center gap-2 px-4 py-2 glass-perfect rounded-full text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-default">
                        <Briefcase size={14} />
                        <span>{type}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 glass-perfect rounded-full text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-default">
                        <Clock size={14} />
                        <span>{schedule}</span>
                    </div>
                </div>
            </div>

            {/* STAGE 4: BOTTOM AREA (Salary + Action) */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-black mb-1">COMPENSATION</span>
                    <span className="text-xl font-bold text-gray-100 tracking-tight">
                        {salary}
                        <span className="text-gray-500 text-sm font-medium ml-1">/ year</span>
                    </span>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white text-black rounded-full font-bold text-sm shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.3)] transition-all"
                >
                    Apply Now
                </motion.button>
            </div>

            {/* Subtle Glimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-1000">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 via-transparent to-transparent rotate-[25deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] ease-in-out" />
            </div>
        </motion.div>
    );
};
