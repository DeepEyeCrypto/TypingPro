import React, { useMemo } from 'react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';
import { KeyboardLayoutType, VirtualKey, KeyStats } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  pressedKeys: Set<string>;
  layout: KeyboardLayoutType;
  heatmapStats?: Record<string, KeyStats>;
}

/**
 * VirtualKeyboard - Clean Rewrite
 * Features:
 * - Premium Liquid Glass styling
 * - Heatmap integration for missed keys
 * - High-performance rendering with React.memo
 */
const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  pressedKeys,
  layout,
  heatmapStats
}) => {

  const getKeyStyle = (keyObj: VirtualKey) => {
    const mapping = LAYOUTS[layout][keyObj.code] || { default: '', shift: '' };
    const label = keyObj.label || mapping.default.toUpperCase();
    const subLabel = keyObj.label ? '' : mapping.shift;

    const producesActiveKey = activeKey && (mapping.default === activeKey || mapping.shift === activeKey);
    const isPressed = pressedKeys.has(mapping.default) || pressedKeys.has(mapping.shift) || (keyObj.label && pressedKeys.has(keyObj.label));

    // Heatmap Logic
    let heatIntensity = 0;
    if (heatmapStats) {
      const char = mapping.default.toLowerCase();
      const stat = heatmapStats[char];
      if (stat && stat.errorCount > 0) {
        heatIntensity = Math.min(stat.errorCount / 5, 1); // Cap at 5 errors for max intensity
      }
    }

    // Special handling for Space
    if (keyObj.code === 'Space') {
      const spacePressed = pressedKeys.has(' ');
      const spaceTarget = activeKey === ' ';
      return { ...styleResult(spaceTarget, spacePressed, 0), label: '', subLabel: '' };
    }

    return { ...styleResult(!!producesActiveKey, isPressed, heatIntensity), label, subLabel };
  };

  const styleResult = (isTarget: boolean, isPressed: boolean, heat: number) => {
    let baseClass = "rounded-lg flex flex-col items-center justify-center text-sm md:text-base font-semibold transition-all duration-75 select-none border h-full relative overflow-hidden";

    // Default Glass Style
    let colorClass = "bg-white/5 text-white/70 border-white/10 shadow-lg backdrop-blur-md";

    // Heatmap Background (Red tint)
    let heatStyle: React.CSSProperties = {};
    if (heat > 0 && !isTarget && !isPressed) {
      heatStyle = {
        backgroundColor: `rgba(239, 68, 68, ${heat * 0.4})`,
        borderColor: `rgba(239, 68, 68, ${heat * 0.6})`,
        color: '#fff'
      };
    }

    if (isTarget) {
      colorClass = "bg-brand/20 text-brand border-brand/40 ring-2 ring-brand/50 z-10 shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)]";
    }

    if (isPressed) {
      baseClass += " transform scale-95 translate-y-0.5 shadow-none ring-0";
      colorClass = isTarget
        ? "bg-green-500 text-white border-green-400 shadow-inner"
        : "bg-brand text-white border-brand shadow-inner";
    }

    return { className: `${baseClass} ${colorClass}`, style: heatStyle };
  };

  return (
    <div className="w-full flex justify-center py-6 overflow-hidden">
      <div className="inline-flex flex-col gap-2 p-5 glass-panel rounded-[2rem] border border-white/10 shadow-2xl origin-top transition-transform duration-500 
        scale-[0.55] sm:scale-[0.7] md:scale-75 lg:scale-90 xl:scale-100 2xl:scale-110">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-2 h-10 md:h-12 lg:h-14">
            {row.map((keyObj, keyIdx) => {
              const { className, label, subLabel, style } = getKeyStyle(keyObj);
              return (
                <div
                  key={`${rowIdx}-${keyIdx}`}
                  className={`${className} border-white/5 hover:border-white/20`}
                  style={{ ...style, flexGrow: keyObj.width || 1, flexBasis: 0, minWidth: 0 }}
                >
                  <div className="flex flex-col items-center leading-none pointer-events-none">
                    {(!keyObj.label && subLabel && subLabel !== label) && (
                      <span className="text-[10px] opacity-30 mb-1 font-bold">{subLabel}</span>
                    )}
                    <span className="truncate font-black tracking-tighter opacity-80">{label}</span>
                  </div>
                  {keyObj.homing && (
                    <div className="absolute bottom-1.5 w-4 h-0.5 bg-white/20 rounded-full" />
                  )}
                  {style.backgroundColor && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
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
