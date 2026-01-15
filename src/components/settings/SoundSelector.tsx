import React from 'react';
import { soundManager } from '../../utils/SoundManager';
import { SOUND_PROFILES } from '../../data/soundProfiles';
import { GlassCard } from '../ui/GlassCard';
import { useSettingsStore } from '../../stores/settingsStore';

export const SoundSelector: React.FC = () => {
    const { activeSoundProfileId, setSoundProfile } = useSettingsStore();

    const handleSelect = (profileId: string) => {
        setSoundProfile(profileId);
        // soundManager.playClick(); // Removed to prevent double-play race conditions
    };

    return (
        <div className="w-full">
            <h3 className="text-white/60 text-sm font-bold tracking-widest uppercase mb-4">Keyboard Acoustics</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SOUND_PROFILES.filter(p => p.type === 'file').map((profile) => (
                    <GlassCard
                        key={profile.id}
                        className={`
              cursor-pointer relative group transition-all duration-300
              ${activeSoundProfileId === profile.id ? 'border-white/40 bg-white/10' : 'hover:bg-white/5'}
            `}
                    >
                        <div
                            className="p-4 flex flex-col items-center justify-center gap-3 h-28"
                            onClick={() => handleSelect(profile.id)}
                        >
                            {/* Visual "Switch" representation */}
                            <div className={`
                w-10 h-10 rounded-lg shadow-lg flex items-center justify-center
                transition-transform duration-100 active:scale-90
                ${activeSoundProfileId === profile.id ? 'bg-white text-black' : 'bg-white/10 text-white'}
              `}>
                                <div className={`w-4 h-4 rounded-full ${activeSoundProfileId === profile.id ? 'bg-black' : 'bg-white/50'}`} />
                            </div>

                            <span className={`text-xs font-bold uppercase tracking-wider ${activeSoundProfileId === profile.id ? 'text-white' : 'text-white/40'}`}>
                                {profile.name}
                            </span>
                        </div>

                        {/* Active Glow */}
                        {activeSoundProfileId === profile.id && (
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] rounded-[32px] pointer-events-none" />
                        )}
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
