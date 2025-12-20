import React, { useEffect, useRef, memo } from 'react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';
import { KeyboardLayoutType, KeyStats } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  pressedKeys: Set<string>;
  layout: KeyboardLayoutType;
  heatmapStats?: Record<string, KeyStats>;
  heatmapData?: Record<string, { color: string }>; // New granular heatmap
  expectedFinger?: string | null;
  osLayout?: 'win' | 'mac';
}

const FINGER_COLORS: Record<string, string> = {
  'left-pinky': 'rgba(236, 72, 113, 0.4)',
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
  heatmapData,
  expectedFinger,
  osLayout = 'win'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // OS Specific Label Mapping
  const getOSLabel = (code: string, defaultLabel: string) => {
    if (osLayout === 'mac') {
      if (code === 'ControlLeft' || code === 'ControlRight') return 'control ⌃';
      if (code === 'AltLeft' || code === 'AltRight') return 'option ⌥';
      if (code === 'MetaLeft' || code === 'MetaRight') return 'command ⌘';
    } else {
      if (code === 'ControlLeft' || code === 'ControlRight') return 'Ctrl';
      if (code === 'AltLeft' || code === 'AltRight') return 'Alt';
      if (code === 'MetaLeft' || code === 'MetaRight') return 'Win';
    }
    return defaultLabel;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains('dark');

    const virtualWidth = 3200;
    const virtualHeight = 1000;
    const gap = 15;
    const padding = 60;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 2;
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

      KEYBOARD_ROWS.forEach((row) => {
        let currentX = padding;
        row.forEach((keyObj) => {
          const width = (keyObj.width || 1) * colWidth * 2;
          const rectX = currentX;
          const rectY = currentY;
          const rectW = width - gap;
          const rectH = rowHeight - gap;

          const mapping = LAYOUTS[layout][keyObj.code] || { default: '', shift: '' };
          const char = mapping.default.toLowerCase();
          const isActive = !!(activeKey && (mapping.default === activeKey || mapping.shift === activeKey || (keyObj.code === 'Space' && activeKey === ' ')));
          const isPressed = pressedKeys.has(mapping.default) || pressedKeys.has(mapping.shift) || (keyObj.label && pressedKeys.has(keyObj.label)) || (keyObj.code === 'Space' && pressedKeys.has(' '));
          const isFingerTarget = !!(expectedFinger && (keyObj.finger === expectedFinger || (keyObj.code === 'Space' && expectedFinger === 'thumb')));

          // Heatmap logic
          const heatmapInfo = heatmapData?.[char];

          const borderRadius = osLayout === 'mac' ? 24 : 16;

          ctx.beginPath();
          ctx.roundRect(rectX, rectY, rectW, rectH, borderRadius);

          let fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
          let strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
          let textColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)';

          if (heatmapInfo && !isActive && !isPressed) {
            fillStyle = heatmapInfo.color;
            strokeStyle = 'rgba(255,255,255,0.05)';
            textColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
          } else if (isFingerTarget && !isPressed) {
            fillStyle = FINGER_COLORS[keyObj.finger || ''] || fillStyle;
            strokeStyle = 'transparent';
          } else if (isActive) {
            const accentColor = osLayout === 'mac' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(56, 189, 248, 0.15)';
            const accentStroke = osLayout === 'mac' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(56, 189, 248, 0.4)';

            fillStyle = isDark ? accentColor : 'rgba(14, 165, 233, 0.1)';
            strokeStyle = isDark ? accentStroke : 'rgba(14, 165, 233, 0.3)';
            textColor = isDark ? (osLayout === 'mac' ? '#fff' : '#38bdf8') : '#0284c7';

            ctx.shadowBlur = 15;
            ctx.shadowColor = accentStroke;
          }

          if (isPressed) {
            fillStyle = isActive ? (osLayout === 'mac' ? 'rgba(255,255,255,0.4)' : '#0ea5e9') : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)');
            textColor = '#fff';
            ctx.translate(0, 4);
          }

          ctx.fillStyle = fillStyle;
          ctx.fill();
          if (strokeStyle !== 'transparent') {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          ctx.shadowBlur = 0;

          ctx.fillStyle = textColor;
          const fontSize = keyObj.code.length > 5 ? 36 : 48;
          ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const label = getOSLabel(keyObj.code, keyObj.label || mapping.default.toUpperCase());
          ctx.fillText(label, rectX + rectW / 2, rectY + rectH / 2);

          if (isPressed) ctx.translate(0, -4);

          currentX += width;
        });
        currentY += rowHeight;
      });
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [activeKey, pressedKeys, layout, heatmapStats, heatmapData, expectedFinger, osLayout]);

  return (
    <div className="w-full flex justify-center py-6 contain-content select-none">
      <div className="w-full lg:w-[95%] xl:w-[1100px] aspect-[3.2/1] bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-[40px] p-4 md:p-6 shadow-xl overflow-hidden transition-all duration-300">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};

export default memo(VirtualKeyboard);
