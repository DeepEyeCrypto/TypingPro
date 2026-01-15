import React from 'react'
import { useSettingsStore } from '../../stores/settingsStore'
import { motion } from 'framer-motion'

interface SettingsPageProps {
    onBack?: () => void
}

const BACKGROUNDS = [
    { id: 'default', name: 'Midnight Void', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop' },
    { id: 'custom1', name: 'Caribbean Landscape', url: '/backgrounds/caribbean-landscape.jpg', thumb: '/backgrounds/caribbean-landscape.jpg' },
    { id: 'custom2', name: 'Modern Living Room', url: '/backgrounds/elegant-modern-living-room-with-comfortable-sofa-generated-by-ai.jpg', thumb: '/backgrounds/elegant-modern-living-room-with-comfortable-sofa-generated-by-ai.jpg' },
    { id: 'custom3', name: 'Luxury Dining', url: '/backgrounds/3d-rendering-modern-dining-room-living-room-with-luxury-decor-green-sofa.jpg', thumb: '/backgrounds/3d-rendering-modern-dining-room-living-room-with-luxury-decor-green-sofa.jpg' },
    { id: 'my-custom', name: 'Your Upload', url: '/8DE38A64-A816-45C7-B624-DD45B2F7EA9A.JPG', thumb: '/8DE38A64-A816-45C7-B624-DD45B2F7EA9A.JPG' }
]

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
    const { backgroundImage, setBackgroundImage } = useSettingsStore()

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-black text-black">
                        Visual Settings
                    </h2>
                    <p className="text-black opacity-40 text-sm mt-1">Customize your immersive environment.</p>
                </div>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-full border border-black/10 text-black/60 hover:text-black hover:bg-black/5 transition-colors font-bold"
                    >
                        Back
                    </button>
                )}
            </div>

            {/* Background Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10 pr-2 custom-scrollbar">

                {/* Section Title */}
                <div className="col-span-full">
                    <h3 className="text-lg font-black text-black opacity-30 mb-4 border-b border-black/5 pb-2 uppercase tracking-widest">
                        Environment Background
                    </h3>
                </div>

                {BACKGROUNDS.map((bg) => (
                    <motion.div
                        key={bg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setBackgroundImage(bg.url)}
                        className={`
                            relative group cursor-pointer overflow-hidden rounded-xl border transition-all duration-300
                            ${backgroundImage === bg.url
                                ? 'border-black ring-2 ring-black/10'
                                : 'border-black/10 hover:border-black/20'}
                        `}
                    >
                        {/* Thumbnail */}
                        <div className="aspect-video w-full bg-black/50 relative">
                            <img
                                src={bg.thumb}
                                alt={bg.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Selected Indicator */}
                            {backgroundImage === bg.url && (
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                                    <div className="bg-black/60 p-2 rounded-full">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* Hover Name Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm font-bold text-white">{bg.name}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
