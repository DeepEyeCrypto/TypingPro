
import React from 'react';
import { KEYBOARD_ROWS, LAYOUTS } from '../constants';
import { KeyboardLayoutType } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  pressedKeys: Set<string>;
  layout: KeyboardLayoutType;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, pressedKeys, layout }) => {

  const getKeyStyle = (keyObj: any) => {
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
    let colorClass = "bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(0,0,0,0.3)]";

    if (isTarget) {
      // Target Styling (Orange/Highlight)
      colorClass = "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 ring-2 ring-orange-400/50 dark:ring-orange-500/30 z-10";
    }

    if (isPressed) {
      // Pressed State: Pressed down, solid color
      baseClass += " transform scale-[0.96] translate-y-[1px] shadow-none ring-0";
      if (isTarget) {
        colorClass = "bg-[#34C759] text-white border-green-600 dark:border-green-500 shadow-inner";
      } else {
        colorClass = "bg-[#007AFF] text-white border-blue-600 dark:border-blue-500 shadow-inner";
      }
    } else {
      // Idle/Hover State: Add hover lift and glow
      // Only apply hover effects if not pressed to avoid conflict
      baseClass += " hover:scale-105 hover:-translate-y-0.5 hover:shadow-md hover:z-20 hover:border-gray-300 dark:hover:border-gray-500";
    }

    return { className: `${baseClass} ${colorClass}` };
  };

  return (
    <div className="w-full h-full p-1 md:p-2 select-none flex flex-col justify-end">
      <div className="flex flex-col items-stretch justify-between gap-1 md:gap-1.5 w-full h-full max-h-[50vh] bg-[#E5E7EB] dark:bg-[#111827] p-1.5 md:p-2 rounded-xl border border-gray-300 dark:border-gray-800 shadow-inner">
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
