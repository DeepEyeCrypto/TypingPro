import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Zap } from 'lucide-react';

interface NeuralDecoderProps {
    wpm: number;
    accuracy: number;
    className?: string;
}

export const NeuralDecoder: React.FC<NeuralDecoderProps> = ({ wpm, accuracy, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (rect) {
                canvas.width = rect.width * window.devicePixelRatio;
                canvas.height = rect.height * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        };

        window.addEventListener('resize', resize);
        resize();

        let angle = 0;
        const draw = () => {
            const width = canvas.width / window.devicePixelRatio;
            const height = canvas.height / window.devicePixelRatio;

            ctx.clearRect(0, 0, width, height);

            // Fractal parameters influenced by WPM
            const depth = Math.min(8, 4 + Math.floor(wpm / 40));
            const branchAngle = (Math.PI / 4) + (Math.sin(angle) * 0.1);
            const size = (height / 3.5) + (wpm / 5);

            ctx.save();
            ctx.translate(width / 2, height * 0.8);

            // Emerald Theme Colors
            const baseColor = '#2dd4bf'; // text-accent from emerald theme
            ctx.strokeStyle = baseColor;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';

            const drawBranch = (len: number, d: number) => {
                if (d === 0) return;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -len);
                ctx.stroke();

                ctx.translate(0, -len);

                ctx.save();
                ctx.rotate(branchAngle + (wpm / 200));
                drawBranch(len * 0.7, d - 1);
                ctx.restore();

                ctx.save();
                ctx.rotate(-branchAngle - (wpm / 200));
                drawBranch(len * 0.7, d - 1);
                ctx.restore();
            };

            ctx.globalAlpha = 0.6 + (accuracy / 250);
            ctx.shadowBlur = 15 + (wpm / 10);
            ctx.shadowColor = baseColor;

            drawBranch(size, depth);
            ctx.restore();

            angle += 0.02 + (wpm / 5000);
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [wpm, accuracy]);

    return (
        <div className={`glass-panel rounded-[3rem] p-8 overflow-hidden relative min-h-[300px] flex flex-col ${className}`}>
            <div className="absolute top-8 left-8 z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-[var(--text-accent)]/20 text-[var(--text-accent)]">
                        <Brain size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40" style={{ color: 'var(--text-primary)' }}>Neural_Bitstream</span>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter" style={{ color: 'var(--text-primary)' }}>Decoder_v6.0</h3>
            </div>

            <div className="absolute top-8 right-8 z-10 text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                    <Activity size={12} className="text-[var(--text-accent)] animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30" style={{ color: 'var(--text-primary)' }}>Signal_Integrity</span>
                </div>
                <div className="text-3xl font-black italic text-[var(--text-accent)] shadow-glow">{accuracy}%</div>
            </div>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            />

            <div className="mt-auto relative z-10">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                    <Zap size={20} className="text-[var(--text-accent)]" />
                    <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30" style={{ color: 'var(--text-primary)' }}>Throughput_Confirmed</div>
                        <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Neural_Handshake_Stabilized</div>
                    </div>
                </div>
            </div>

            {/* Fractal Scanning Overlay */}
            <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--text-accent)] to-transparent opacity-20 blur-sm z-0 pointer-events-none"
            />
        </div>
    );
};
