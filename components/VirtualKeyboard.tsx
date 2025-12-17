
import React from 'react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';
import { KeyboardLayoutType, VirtualKey } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  pressedKeys: Set<string>;
  layout: KeyboardLayoutType;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, pressedKeys, layout }) => {

  const getKeyStyle = (keyObj: VirtualKey) => {
    const mapping = LAYOUTS[layout][keyObj.code] || { default: '', shift: '' };
    const label = keyObj.label || mapping.default.toUpperCase();
    const subLabel = keyObj.label ? '' : mapping.shift;

    // Check if THIS key code is pressed (based on mapping logic or physical key)
    // For a Tutor, we usually highlight based on character match if we don't have physical access API
    // Here we check if the char associated with this key is pressed.

    // Simplification: We check if the Active Key matches the character this key produces
    const producesActiveKey = activeKey && (mapping.default === activeKey || mapping.shift === activeKey);

    // We assume 'pressedKeys' contains characters.
    const isPressed = pressedKeys.has(mapping.default) || pressedKeys.has(mapping.shift) || (keyObj.label && pressedKeys.has(keyObj.label));

    // Special handling for Space
    if (keyObj.code === 'Space') {
      if (activeKey === ' ') return { ...styleResult(true, pressedKeys.has(' ')), label: '', subLabel: '' };
      return { ...styleResult(false, pressedKeys.has(' ')), label: '', subLabel: '' };
    }

    return { ...styleResult(producesActiveKey, isPressed), label, subLabel };
  };

  const styleResult = (isTarget: boolean, isPressed: boolean) => {
    // Base classes for layout and transition
    let baseClass = "rounded md:rounded-md flex flex-col items-center justify-center text-sm md:text-base lg:text-xl font-medium transition-all duration-100 select-none shadow-sm border h-full relative";

    // Default Colors
    let colorClass = "bg-bg-surface text-text-primary border-border shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(0,0,0,0.3)]";

    if (isTarget) {
      // Target Styling (Brand Color)
      colorClass = "bg-brand/10 text-brand border-brand/30 ring-2 ring-brand/50 z-10";
    }

    if (isPressed) {
      // Pressed State: Pressed down, solid color
      baseClass += " transform scale-[0.96] translate-y-[1px] shadow-none ring-0";
      if (isTarget) {
        colorClass = "bg-status-success text-text-inverted border-status-success shadow-inner";
      } else {
        colorClass = "bg-brand text-text-inverted border-brand shadow-inner";
      }
    } else {
      // Idle/Hover State: Add hover lift and glow
      // Only apply hover effects if not pressed to avoid conflict
      baseClass += " hover:scale-105 hover:-translate-y-0.5 hover:shadow-md hover:z-20 hover:border-border-hover";
    }

    return { className: `${baseClass} ${colorClass}` };
  };

  return (
    <div className="w-full h-full p-1 md:p-2 select-none flex flex-col justify-end">
      <div className="flex flex-col items-stretch justify-between gap-1 md:gap-1.5 w-full h-full max-h-[50vh] bg-bg-secondary/50 p-1.5 md:p-2 rounded-xl border border-border shadow-inner">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex w-full h-full gap-1 md:gap-1.5">
            {row.map((keyObj, keyIdx) => {
              const { className, label, subLabel } = getKeyStyle(keyObj);
              return (
                <div key={`${rowIdx}-${keyIdx}`} className={className} style={{ flexGrow: keyObj.width || 1, flexBasis: 0, minWidth: 0 }}>
                  <div className="flex flex-col items-center leading-none pointer-events-none">
                    {/* Show Shift char if it's a single letter key, else hide or custom logic */}
                    {(!keyObj.label && subLabel && subLabel !== label) && <span className="text-[0.6em] opacity-60 mb-[2px]">{subLabel}</span>}
                    <span>{label}</span>
                  </div>
                  {keyObj.homing && (
                    <div className="absolute bottom-1.5 md:bottom-2 w-3 md:w-4 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-between w-full px-2 mt-1 text-[9px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest opacity-60">
        <span>{layout.toUpperCase()}</span>
        <span>Right Hand</span>
      </div>
    </div>
  );
};

export default React.memo(VirtualKeyboard);
