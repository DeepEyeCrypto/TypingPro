import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import {
    X, Volume2, Keyboard, Layout, Type, MousePointer2, Palette, Cloud, Terminal,
    History, Trophy, LayoutDashboard, Users, Chrome, Github, Sun, Moon, Laptop,
    ScanLine, AlertCircle, Activity, Search, Loader2, Monitor
} from 'lucide-react';
import { THEMES } from '../constants/themes';
import { FANCY_FONTS } from '../constants';
import { ThemeMode, FontSize, CursorStyle, KeyboardLayoutType } from '../types';

interface SettingsModalProps {
    onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const { settings, updateUserSetting, systemTheme } = useApp();
    const [fontSearch, setFontSearch] = useState('');

    // Preload fonts for preview
    useEffect(() => {
        FANCY_FONTS.forEach(font => {
            if (!font.url) return;
            const id = `preview-font-${font.family.replace(/\s+/g, '-').toLowerCase()}`;
            if (!document.getElementById(id)) {
                const link = document.createElement('link');
                link.id = id;
                link.href = font.url;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        });
    }, []);

    const filteredFonts = FANCY_FONTS.filter(f =>
        f.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
        f.category.toLowerCase().includes(fontSearch.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative border border-white/20 dark:border-gray-700 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 scrollbar-thin">
                    {/* Appearance */}
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            {settings.theme === 'light' ? <Sun className="w-5 h-5 text-gray-500" /> :
                                settings.theme === 'dark' ? <Moon className="w-5 h-5 text-gray-500" /> :
                                    <Laptop className="w-5 h-5 text-gray-500" />}
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Appearance</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(['system', 'light', 'dark'] as ThemeMode[]).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => updateUserSetting('theme', mode)}
                                    className={`py-2 text-sm font-medium rounded-lg border transition-all ${settings.theme === mode
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                        : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gameplay & Visuals */}
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-5">
                        <div className="flex items-center gap-3 mb-1">
                            <ScanLine className="w-5 h-5 text-gray-500" />
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">Gameplay & Visuals</h3>
                        </div>

                        {/* Theme Selection */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <Palette className="w-5 h-5 text-gray-500" />
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Theme</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => updateUserSetting('themeName', theme.name)}
                                        className={`
                                        flex flex-col items-center justify-center p-3 rounded-lg border transition-all
                                        ${settings.themeName === theme.name
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm'
                                                : 'bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                            }
                                    `}
                                        style={{
                                            '--theme-bg': theme.bgColor,
                                            '--theme-main': theme.mainColor,
                                            '--theme-sub': theme.subColor
                                        } as React.CSSProperties}
                                    >
                                        <div className="flex gap-1 mb-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.bgColor }} />
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.mainColor }} />
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.subColor }} />
                                        </div>
                                        <span className={`text-xs font-semibold ${settings.themeName === theme.name ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {theme.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Font Size</label>
                                <div className="grid grid-cols-4 gap-1">
                                    {(['small', 'medium', 'large', 'xl'] as FontSize[]).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => updateUserSetting('fontSize', size)}
                                            className={`
                                                flex items-center justify-center py-2 rounded-lg border text-xs font-bold transition-all
                                                ${settings.fontSize === size
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                                                }
                                            `}
                                            title={size.charAt(0).toUpperCase() + size.slice(1)}
                                        >
                                            {size === 'small' ? 'A' : size === 'medium' ? 'A+' : size === 'large' ? 'A++' : 'MAX'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cursor Style */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Cursor Style</label>
                                <div className="grid grid-cols-4 gap-1">
                                    {(['block', 'line', 'underline', 'box'] as CursorStyle[]).map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => updateUserSetting('cursorStyle', style)}
                                            className={`
                                                flex items-center justify-center py-2 rounded-lg border transition-all
                                                ${settings.cursorStyle === style
                                                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400'
                                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                                }
                                            `}
                                            title={style.charAt(0).toUpperCase() + style.slice(1)}
                                        >
                                            <div className="w-4 h-4 flex items-center justify-center relative">
                                                {style === 'block' && <div className="w-2.5 h-3.5 bg-current rounded-[1px]" />}
                                                {style === 'line' && <div className="w-0.5 h-3.5 bg-current" />}
                                                {style === 'underline' && <div className="w-3 h-0.5 bg-current mt-3" />}
                                                {style === 'box' && <div className="w-3 h-3.5 border-2 border-current rounded-[1px]" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Caret Speed */}
                        <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Caret Animation</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['off', 'smooth', 'fast'] as const).map((speed) => (
                                    <button
                                        key={speed}
                                        onClick={() => updateUserSetting('caretSpeed', speed)}
                                        className={`py-2 text-sm font-medium rounded-lg border transition-all ${settings.caretSpeed === speed
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                                            : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {speed.charAt(0).toUpperCase() + speed.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stop On Error */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className={`w-5 h-5 ${settings.stopOnError ? 'text-red-500' : 'text-gray-400'}`} />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Stop on Error</h3>
                                    <p className="text-xs text-gray-500">Cursor halts until correct key is pressed</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateUserSetting('stopOnError', !settings.stopOnError)}
                                className={`w-11 h-6 rounded-full p-1 transition-colors ${settings.stopOnError ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.stopOnError ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {/* Performance Mode */}
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div className="flex items-center gap-3">
                                <Activity className={`w-5 h-5 ${settings.performanceMode ? 'text-brand' : 'text-gray-400'}`} />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Performance Mode</h3>
                                    <p className="text-xs text-gray-500">Disables blurs and heavy animations for low-end devices</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateUserSetting('performanceMode', !settings.performanceMode)}
                                className={`w-11 h-6 rounded-full p-1 transition-colors ${settings.performanceMode ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.performanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Font Selection */}
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Type className="w-5 h-5 text-gray-500" />
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">App Font</h3>
                            </div>
                            <div className="relative w-48">
                                <Search className="w-3 h-3 absolute left-3 top-2.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter fonts..."
                                    value={fontSearch}
                                    onChange={(e) => setFontSearch(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                            {filteredFonts.map((font) => (
                                <button
                                    key={font.name}
                                    onClick={() => updateUserSetting('fontFamily', font.family)}
                                    className={`
                                        group relative flex flex-col items-start p-3 rounded-lg border transition-all text-left
                                        ${settings.fontFamily === font.family
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm'
                                            : 'bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between w-full mb-1">
                                        <span className={`text-xs font-semibold ${settings.fontFamily === font.family ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {font.name}
                                        </span>
                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                            {font.category}
                                        </span>
                                    </div>
                                    <div
                                        className="text-lg leading-tight w-full truncate"
                                        style={{ fontFamily: `"${font.family}", sans-serif` }}
                                    >
                                        Elegant Typography
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Keyboard Layout */}
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Keyboard className="w-5 h-5 text-gray-500" />
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200">Keyboard Layout</h3>
                                <p className="text-xs text-gray-500">Visual mapping only</p>
                            </div>
                        </div>
                        <select
                            value={settings.keyboardLayout}
                            onChange={(e) => updateUserSetting('keyboardLayout', e.target.value as KeyboardLayoutType)}
                            className="bg-gray-100 dark:bg-gray-900 border-none rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="qwerty">QWERTY</option>
                            <option value="dvorak">Dvorak</option>
                            <option value="colemak">Colemak</option>
                        </select>
                    </div>

                    {/* Sound */}
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-5 h-5 text-gray-500" />
                                <div>
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Sound Effects</h3>
                                </div>
                            </div>
                            <button
                                onClick={() => updateUserSetting('soundEnabled', !settings.soundEnabled)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {settings.soundEnabled && (
                            <>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Volume</label>
                                    <input
                                        type="range" min="0" max="1" step="0.1"
                                        value={settings.volume}
                                        onChange={(e) => updateUserSetting('volume', parseFloat(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                </div>

                                <div className="pt-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Switch Profile</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['mechanical', 'creamy', 'laptop', 'nk-cream'] as const).map(profile => (
                                            <button
                                                key={profile}
                                                onClick={() => updateUserSetting('soundProfile', profile)}
                                                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all text-center ${settings.soundProfile === profile
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                                                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                                                    }`}
                                            >
                                                {profile.charAt(0).toUpperCase() + profile.slice(1).replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
