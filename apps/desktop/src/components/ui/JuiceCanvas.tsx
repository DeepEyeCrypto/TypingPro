import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

export interface JuiceCanvasHandle {
    spawnBurst: (x: number, y: number, color: string, count: number) => void;
    spawnSpark: (x: number, y: number, color: string) => void;
}

export const JuiceCanvas = forwardRef<JuiceCanvasHandle, { className?: string }>((props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrame = useRef<number>();

    useImperativeHandle(ref, () => ({
        spawnBurst: (x, y, color, count) => {
            for (let i = 0; i < count; i++) {
                particles.current.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10 - 5,
                    life: 1.0,
                    color,
                    size: Math.random() * 4 + 2
                });
            }
        },
        spawnSpark: (x, y, color) => {
            particles.current.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                life: 0.8,
                color,
                size: Math.random() * 2 + 1
            });
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // Gravity
                p.life -= 0.02;

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrame.current = requestAnimationFrame(update);
        };

        update();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-[100] ${props.className || ''}`}
        />
    );
});
