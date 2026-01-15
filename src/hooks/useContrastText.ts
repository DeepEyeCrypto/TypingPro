import { useMemo, useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

/**
 * Pure JS fallback for contrast calculation (YIQ formula)
 * Fast, synchronous, and works without Tauri bridge.
 */
export const getContrastText = (hexcolor: string): string => {
    // If hexcolor is invalid or empty, return white as safe default
    if (!hexcolor || typeof hexcolor !== 'string') return '#FFFFFF';

    const hex = hexcolor.replace('#', '');
    if (hex.length !== 6) return '#FFFFFF';

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // YIQ formula - weights colors by perceived brightness
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
};

/**
 * useContrastText Hook
 * Synchronously provides a fallback color while optionally fetching
 * the high-precision WCAG color from the Rust backend.
 */
export const useContrastText = (bgColor: string) => {
    const [nativeColor, setNativeColor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fallback used immediately
    const fallbackColor = useMemo(() => getContrastText(bgColor), [bgColor]);

    useEffect(() => {
        // Attempt to get high-precision color from Rust
        invoke<string>('contrast_get_text_color', { bgHex: bgColor })
            .then(setNativeColor)
            .catch((err) => {
                console.warn('Contrast native bridge failed:', err);
                setError(err.toString());
            });
    }, [bgColor]);

    return {
        textColor: nativeColor || fallbackColor,
        error,
        isNative: !!nativeColor
    };
};
