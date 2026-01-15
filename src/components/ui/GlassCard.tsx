import { SpotlightCard } from './SpotlightCard';

export const GlassCard = ({ children, className = '' }: any) => {
    return (
        <SpotlightCard className={`
      relative overflow-hidden
      bg-white/5 backdrop-blur-[60px] backdrop-saturate-200
      shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),_inset_0_2px_15px_rgba(255,255,255,0.1),_0_25px_50px_-12px_rgba(0,0,0,0.5)]
      border border-white/20
      rounded-[40px]
      gpu-accelerated
      ${className}
    `}>
            {/* Prismatic Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-0" />

            {/* Liquid Noise Overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </SpotlightCard>
    );
};
