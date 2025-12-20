import React, { useMemo, memo } from 'react';
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

/**
 * Optimized Key Component
 * Minimal re-renders through strict prop checking.
 */
const Key = memo(({
  keyObj,
  layout,
  isActive,
  isPressed,
  isFingerTarget,
  heatIntensity
}: {
  keyObj: VirtualKey,
  layout: KeyboardLayoutType,
  isActive: boolean,
  isPressed: boolean,
  isFingerTarget: boolean,
  heatIntensity: number
}) => {
  const mapping = LAYOUTS[layout][keyObj.code] || { default: '', shift: '' };
  const label = keyObj.label || mapping.default.toUpperCase();
  const subLabel = keyObj.label ? '' : mapping.shift;

  // Render logic optimized for speed
  let baseClass = "rounded-xl flex flex-col items-center justify-center text-[clamp(0.6rem,1.2vw,1rem)] font-black select-none border h-full relative overflow-hidden will-change-transform contain-content transition-all duration-75";
  let colorClass = "bg-white/5 text-white/50 border-white/5 shadow-sm";
  let style: React.CSSProperties = { gridColumn: `span ${Math.round((keyObj.width || 1) * 2)}` };

  if (isFingerTarget && !isPressed) {
    const color = FINGER_COLORS[keyObj.finger || ''] || 'rgba(255,255,255,0.1)';
    style.backgroundColor = color;
    style.borderColor = color.replace('0.4', '0.6');
  } else if (heatIntensity > 0 && !isActive && !isPressed) {
    style.backgroundColor = `rgba(239, 68, 68, ${heatIntensity * 0.4})`;
    style.borderColor = `rgba(239, 68, 68, ${heatIntensity * 0.6})`;
    colorClass = "text-white";
  }

  if (isActive) {
    colorClass = "bg-brand/20 text-brand border-brand/40 ring-1 ring-brand z-10 shadow-cyan-glow text-white";
  }

  if (isPressed) {
    baseClass += " transform scale-95 translate-y-0.5";
    colorClass = isActive ? "bg-green-500 text-white border-green-400" : "bg-brand text-white border-brand";
  }

  return (
    <div className={`${baseClass} ${colorClass}`} style={style}>
      <div className="flex flex-col items-center leading-none pointer-events-none z-10">
        {(!keyObj.label && subLabel && subLabel !== label) && (
          <span className="text-[clamp(6px,0.8vw,10px)] opacity-20 mb-0.5 font-bold uppercase">{subLabel}</span>
        )}
        <span className="truncate font-black tracking-tighter opacity-70 uppercase">{label}</span>
      </div>

      {keyObj.finger && (
        <div
          className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${isFingerTarget ? 'scale-150 animate-pulse' : 'opacity-40'}`}
          style={{ backgroundColor: FINGER_COLORS[keyObj.finger]?.replace('0.4', '1') }}
        />
      )}

      {keyObj.homing && <div className="absolute bottom-[18%] w-[30%] h-[3px] bg-white/20 rounded-full" />}
    </div>
  );
});

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  pressedKeys,
  layout,
  heatmapStats,
  expectedFinger
}) => {
  const allKeys = useMemo(() => KEYBOARD_ROWS.flat(), []);

  return (
    <div className="w-full flex justify-center py-4 md:py-6">
      <div
        className="w-full max-w-[1100px] grid grid-cols-[repeat(30,1fr)] grid-rows-4 gap-1.5 p-6 glass-panel rounded-3xl"
        style={{ aspectRatio: '3.2 / 1' }}
      >
        {allKeys.map((keyObj, idx) => {
          const mapping = LAYOUTS[layout][keyObj.code] || { default: '', shift: '' };

          // Pre-calculate target/pressed/heat outside specific key component for shallow prop checks
          const isActive = !!(activeKey && (mapping.default === activeKey || mapping.shift === activeKey || (keyObj.code === 'Space' && activeKey === ' ')));
          const isPressed = pressedKeys.has(mapping.default) || pressedKeys.has(mapping.shift) || (keyObj.label && pressedKeys.has(keyObj.label)) || (keyObj.code === 'Space' && pressedKeys.has(' '));
          const isFingerTarget = !!(expectedFinger && (keyObj.finger === expectedFinger || (keyObj.code === 'Space' && expectedFinger === 'thumb')));

          let heatIntensity = 0;
          if (heatmapStats) {
            const stat = heatmapStats[mapping.default.toLowerCase()];
            if (stat && stat.errorCount > 0) heatIntensity = Math.min(stat.errorCount / 5, 1);
          }

          return (
            <Key
              key={`${idx}-${keyObj.code}`}
              keyObj={keyObj}
              layout={layout}
              isActive={isActive}
              isPressed={isPressed}
              isFingerTarget={isFingerTarget}
              heatIntensity={heatIntensity}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(VirtualKeyboard);
