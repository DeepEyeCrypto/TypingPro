import React, { useMemo } from 'react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';
import { KeyboardLayoutType, VirtualKey, KeyStats } from '../types';

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

  const allKeys = useMemo(() => {
    return KEYBOARD_ROWS.flat();
  }, []);

  const getKeyStyle = (keyObj: VirtualKey) => {
    const mapping = LAYOUTS[layout][keyObj.code] || { default: '', shift: '' };
    const label = keyObj.label || mapping.default.toUpperCase();
    const subLabel = keyObj.label ? '' : mapping.shift;

    const isTarget = activeKey && (mapping.default === activeKey || mapping.shift === activeKey);
    const isPressed = pressedKeys.has(mapping.default) || pressedKeys.has(mapping.shift) || (keyObj.label && pressedKeys.has(keyObj.label));
    const isFingerTarget = expectedFinger && keyObj.finger === expectedFinger;

    let heatIntensity = 0;
    if (heatmapStats) {
      const char = mapping.default.toLowerCase();
      const stat = heatmapStats[char];
      if (stat && stat.errorCount > 0) {
        heatIntensity = Math.min(stat.errorCount / 5, 1);
      }
    }

    if (keyObj.code === 'Space') {
      const spacePressed = pressedKeys.has(' ');
      const spaceTarget = activeKey === ' ';
      const spaceFingerTarget = expectedFinger === 'thumb' || expectedFinger === 'right-thumb' || expectedFinger === 'left-thumb';
      return { ...styleResult(spaceTarget, spacePressed, 0, !!spaceFingerTarget, 'thumb'), label: '', subLabel: '', isFingerTarget: !!spaceFingerTarget };
    }

    return { ...styleResult(!!isTarget, isPressed, heatIntensity, !!isFingerTarget, keyObj.finger || ''), label, subLabel, isFingerTarget: !!isFingerTarget };
  };

  const styleResult = (isTarget: boolean, isPressed: boolean, heat: number, isFingerTarget: boolean, finger: string) => {
    let baseClass = "rounded-xl flex flex-col items-center justify-center text-[clamp(0.6rem,1.2vw,1rem)] font-black transition-all duration-75 select-none border h-full relative overflow-hidden";
    let colorClass = "bg-white/5 text-white/50 border-white/5 shadow-lg";
    let heatStyle: React.CSSProperties = {};

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

    return { className: `${baseClass} ${colorClass}`, style: heatStyle };
  };

  return (
    <div className="w-full flex justify-center py-4 md:py-8 transition-all duration-700">
      <div
        className="w-full max-w-[1200px] grid grid-cols-[repeat(30,1fr)] grid-rows-4 gap-2 p-6 glass-panel rounded-3xl border border-white/5 shadow-3xl"
        style={{ aspectRatio: '3 / 1' }}
      >
        {allKeys.map((keyObj, idx) => {
          const { className, label, subLabel, style, isFingerTarget } = getKeyStyle(keyObj);
          // Scale grid-column-span based on width. Default width is 1. 2 units = span 2.
          // QWERTY row 1 has ~14 keys. 14 * 2 = 28. Plus some margin for 30 cols.
          const span = Math.round((keyObj.width || 1) * 2);

          return (
            <div
              key={`${idx}-${keyObj.code}`}
              className={`${className} border-white/5 hover:border-white/10`}
              style={{ ...style, gridColumn: `span ${span}` }}
            >
              <div className="flex flex-col items-center leading-none pointer-events-none z-10">
                {(!keyObj.label && subLabel && subLabel !== label) && (
                  <span className="text-[clamp(6px,0.8vw,10px)] opacity-20 mb-0.5 font-bold">{subLabel}</span>
                )}
                <span className="truncate font-black tracking-tighter opacity-70 uppercase">{label}</span>
              </div>

              {keyObj.finger && (
                <div
                  className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full transition-all duration-300 ${isFingerTarget ? 'scale-150 shadow-[0_0_8px_currentColor] animate-pulse' : 'opacity-40'}`}
                  style={{
                    backgroundColor: FINGER_COLORS[keyObj.finger]?.replace('0.4', '1') || 'rgba(255,255,255,0.5)',
                    color: FINGER_COLORS[keyObj.finger]?.replace('0.4', '1')
                  }}
                />
              )}

              {keyObj.homing && (
                <div className="absolute bottom-[15%] w-[30%] h-[6%] bg-brand/40 rounded-full shadow-[0_0_5px_rgba(var(--brand-rgb),0.5)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(VirtualKeyboard);
