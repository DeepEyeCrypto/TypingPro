import React, { useMemo } from 'react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';
import { KeyboardLayoutType, VirtualKey, KeyStats } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  pressedKeys: Set<string>;
  layout: KeyboardLayoutType;
  heatmapStats?: Record<string, KeyStats>;
  expectedFinger?: string | null; // New prop
}

const FINGER_COLORS: Record<string, string> = {
  'left-pinky': 'rgba(236, 72, 153, 0.4)', // Pink
  'left-ring': 'rgba(168, 85, 247, 0.4)',  // Purple
  'left-middle': 'rgba(99, 102, 241, 0.4)', // Indigo
  'left-index': 'rgba(59, 130, 246, 0.4)',  // Blue
  'right-index': 'rgba(16, 185, 129, 0.4)', // Green
  'right-middle': 'rgba(245, 158, 11, 0.4)', // Amber
  'right-ring': 'rgba(249, 115, 22, 0.4)',  // Orange
  'right-pinky': 'rgba(239, 68, 68, 0.4)',  // Red
  'thumb': 'rgba(107, 114, 128, 0.4)'       // Gray
};

/**
 * VirtualKeyboard - Clean Rewrite
 * Features:
 * - Premium Liquid Glass styling
 * - Heatmap integration for missed keys
 * - Finger-specific highlighting for learning
 */
const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  pressedKeys,
  layout,
  heatmapStats,
  expectedFinger
}) => {

  const getKeyStyle = (keyObj: VirtualKey) => {
    const mapping = LAYOUTS[layout][keyObj.code] || { default: '', shift: '' };
    const label = keyObj.label || mapping.default.toUpperCase();
    const subLabel = keyObj.label ? '' : mapping.shift;

    const isTarget = activeKey && (mapping.default === activeKey || mapping.shift === activeKey);
    const isPressed = pressedKeys.has(mapping.default) || pressedKeys.has(mapping.shift) || (keyObj.label && pressedKeys.has(keyObj.label));

    // Finger Highlight Logic
    const isFingerTarget = expectedFinger && keyObj.finger === expectedFinger;

    // Heatmap Logic
    let heatIntensity = 0;
    if (heatmapStats) {
      const char = mapping.default.toLowerCase();
      const stat = heatmapStats[char];
      if (stat && stat.errorCount > 0) {
        heatIntensity = Math.min(stat.errorCount / 5, 1);
      }
    }

    // Special handling for Space
    if (keyObj.code === 'Space') {
      const spacePressed = pressedKeys.has(' ');
      const spaceTarget = activeKey === ' ';
      const spaceFingerTarget = expectedFinger === 'thumb' || expectedFinger === 'right-thumb' || expectedFinger === 'left-thumb';
      return { ...styleResult(spaceTarget, spacePressed, 0, spaceFingerTarget, 'thumb'), label: '', subLabel: '' };
    }

    return { ...styleResult(!!isTarget, isPressed, heatIntensity, !!isFingerTarget, keyObj.finger || ''), label, subLabel };
  };

  const styleResult = (isTarget: boolean, isPressed: boolean, heat: number, isFingerTarget: boolean, finger: string) => {
    let baseClass = "rounded-[clamp(0.25rem,1vw,0.75rem)] flex flex-col items-center justify-center text-[clamp(0.6rem,1.2vw,1rem)] font-black transition-all duration-75 select-none border h-full relative overflow-hidden";
    let colorClass = "bg-white/5 text-white/50 border-white/5 shadow-lg backdrop-blur-md";
    let heatStyle: React.CSSProperties = {};

    // Finger Highlight (Ghost Glow)
    if (isFingerTarget && !isPressed) {
      const color = FINGER_COLORS[finger] || 'rgba(255,255,255,0.1)';
      heatStyle.backgroundColor = color;
      heatStyle.borderColor = color.replace('0.4', '0.6');
      baseClass += " ring-1 ring-white/10";
    }

    if (heat > 0 && !isTarget && !isPressed && !isFingerTarget) {
      heatStyle = {
        backgroundColor: `rgba(239, 68, 68, ${heat * 0.4})`,
        borderColor: `rgba(239, 68, 68, ${heat * 0.6})`,
        color: '#fff'
      };
    }

    if (isTarget) {
      colorClass = "bg-brand/20 text-brand border-brand/40 ring-2 ring-brand z-10 shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)] text-white";
    }

    if (isPressed) {
      baseClass += " transform scale-95 translate-y-1 shadow-none ring-0";
      colorClass = isTarget
        ? "bg-green-500 text-white border-green-400 shadow-inner"
        : "bg-brand text-white border-brand shadow-inner";
    }

    // Homing key indicator
    const isHoming = finger.includes('index') && (isFingerTarget || isTarget);
    if (isHoming) {
      baseClass += " z-20";
    }

    return { className: `${baseClass} ${colorClass}`, style: heatStyle };
  };

  return (
    <div className="w-full flex justify-center py-4 md:py-8 transition-all duration-700">
      <div className="w-full max-w-[95%] lg:max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1400px] aspect-[3/1] flex flex-col gap-[clamp(2px,0.5vw,10px)] p-[clamp(8px,2vw,32px)] glass-panel rounded-[clamp(1rem,3vw,2.5rem)] border border-white/5 shadow-3xl">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-[clamp(2px,0.5vw,10px)] flex-1 min-h-0">
            {row.map((keyObj, keyIdx) => {
              const { className, label, subLabel, style } = getKeyStyle(keyObj);
              return (
                <div
                  key={`${rowIdx}-${keyIdx}`}
                  className={`${className} border-white/5 hover:border-white/10`}
                  style={{ ...style, flexGrow: keyObj.width || 1, flexBasis: 0, minWidth: 0 }}
                >
                  <div className="flex flex-col items-center leading-none pointer-events-none">
                    {(!keyObj.label && subLabel && subLabel !== label) && (
                      <span className="text-[clamp(6px,0.8vw,10px)] opacity-20 mb-0.5 font-bold">{subLabel}</span>
                    )}
                    <span className="truncate font-black tracking-tighter opacity-70 uppercase">{label}</span>
                  </div>
                  {keyObj.homing && (
                    <div className="absolute bottom-[10%] w-[15%] h-[4%] bg-white/20 rounded-full" />
                  )}
                  {style.backgroundColor && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(VirtualKeyboard);
