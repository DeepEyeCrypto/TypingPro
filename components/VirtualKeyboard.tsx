import React, { useEffect, useRef, memo } from 'react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';
import { KeyboardLayoutType, KeyStats } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  pressedKeys: Set<string>;
  layout: KeyboardLayoutType;
  heatmapStats?: Record<string, KeyStats>;
  expectedFinger?: string | null;
}

const FINGER_COLORS: Record<string, string> = {
  'left-pinky': 'rgba(236, 72, 153, 0.4)',
  'left-ring': 'rgba(168, 85, 247, 0.4)',
  'left-middle': 'rgba(99, 102, 241, 0.4)',
  'left-index': 'rgba(59, 130, 246, 0.4)',
  'right-index': 'rgba(16, 185, 129, 0.4)',
  'right-middle': 'rgba(245, 158, 11, 0.4)',
  'right-ring': 'rgba(249, 115, 22, 0.4)',
  'right-pinky': 'rgba(239, 68, 68, 0.4)',
  'thumb': 'rgba(107, 114, 128, 0.4)'
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  pressedKeys,
  layout,
  heatmapStats,
  expectedFinger
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use a fixed virtual coordinate system for the keyboard (ratio 3.2 / 1)
    const virtualWidth = 3200;
    const virtualHeight = 1000;
    const gap = 15;
    const padding = 60;

    // Auto-resize canvas to match its display size
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = (rect.width / 3.2) * dpr;
      ctx.scale(canvas.width / virtualWidth, canvas.height / virtualHeight);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, virtualWidth, virtualHeight);

      let currentY = padding;
      const rowHeight = (virtualHeight - (padding * 2) - (gap * 3)) / 4;
      const colWidth = (virtualWidth - (padding * 2)) / 30;

      KEYBOARD_ROWS.forEach((row, rowIndex) => {
        let currentX = padding;
        row.forEach((keyObj) => {
          const width = (keyObj.width || 1) * colWidth * 2;
          const rectX = currentX;
          const rectY = currentY;
          const rectW = width - gap;
          const rectH = rowHeight - gap;

          const mapping = LAYOUTS[layout][keyObj.code] || { default: '', shift: '' };
          const isActive = !!(activeKey && (mapping.default === activeKey || mapping.shift === activeKey || (keyObj.code === 'Space' && activeKey === ' ')));
          const isPressed = pressedKeys.has(mapping.default) || pressedKeys.has(mapping.shift) || (keyObj.label && pressedKeys.has(keyObj.label)) || (keyObj.code === 'Space' && pressedKeys.has(' '));
          const isFingerTarget = !!(expectedFinger && (keyObj.finger === expectedFinger || (keyObj.code === 'Space' && expectedFinger === 'thumb')));

          // Draw Key background
          ctx.beginPath();
          ctx.roundRect(rectX, rectY, rectW, rectH, 15);

          let fillStyle = 'rgba(255, 255, 255, 0.05)';
          let strokeStyle = 'rgba(255, 255, 255, 0.05)';
          let textColor = 'rgba(255, 255, 255, 0.5)';

          if (isFingerTarget && !isPressed) {
            fillStyle = FINGER_COLORS[keyObj.finger || ''] || 'rgba(255,255,255,0.1)';
            strokeStyle = fillStyle.replace('0.4', '0.6');
          } else if (isActive) {
            fillStyle = 'rgba(59, 130, 246, 0.2)';
            strokeStyle = 'rgba(59, 130, 246, 0.6)';
            textColor = '#fff';
          }

          if (isPressed) {
            fillStyle = isActive ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)';
            textColor = '#fff';
            ctx.translate(0, 5); // Press effect
          }

          ctx.fillStyle = fillStyle;
          ctx.fill();
          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw Labels
          ctx.fillStyle = textColor;
          ctx.font = 'bold 45px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const label = keyObj.label || mapping.default.toUpperCase();
          ctx.fillText(label, rectX + rectW / 2, rectY + rectH / 2);

          if (isPressed) ctx.translate(0, -5); // Reset press effect

          currentX += width;
        });
        currentY += rowHeight;
      });
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [activeKey, pressedKeys, layout, heatmapStats, expectedFinger]);

  return (
    <div className="w-full flex justify-center py-4 md:py-6 contain-content">
      <div className="w-full max-w-[1100px] aspect-[3.2/1] bg-[#0d0d0d66] border border-[#00f2ff33] rounded-3xl p-2 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};

export default memo(VirtualKeyboard);
