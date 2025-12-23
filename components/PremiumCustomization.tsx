import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Palette, Type, Volume2, Keyboard, Eye, Monitor, Sparkles } from 'lucide-react';

interface PremiumCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumCustomization: React.FC<PremiumCustomizationProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'fonts' | 'sounds' | 'advanced'>('themes');
  
  // Theme presets
  const [selectedTheme, setSelectedTheme] = useState('midnight');
  const themes = [
    {
      id: 'midnight',
      name: 'Midnight',
      bg: '#0f172a',
      text: '#f1f5f9',
      accent: '#00d9ff'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      bg: '#0c4a6e',
      text: '#e2e8f0',
      accent: '#0891b2'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      bg: '#431407',
      text: '#fef3c7',
      accent: '#f97316'
    },
    {
      id: 'forest',
      name: 'Forest',
      bg: '#14532d',
      text: '#dcfce7',
      accent: '#22c55e'
    },
    {
      id: 'neon',
      name: 'Neon',
      bg: '#1a1a2e',
      text: '#00ff88',
      accent: '#ff0080'
    },
    {
      id: 'arctic',
      name: 'Arctic',
      bg: '#f8fafc',
      text: '#1e293b',
      accent: '#06b6d4'
    }
  ];

  // Font options
  const [selectedFont, setSelectedFont] = useState('JetBrains Mono');
  const fonts = [
    { id: 'JetBrains Mono', name: 'JetBrains Mono', category: 'Programming' },
    { id: 'Fira Code', name: 'Fira Code', category: 'Programming' },
    { id: 'Source Code Pro', name: 'Source Code Pro', category: 'Programming' },
    { id: 'IBM Plex Mono', name: 'IBM Plex Mono', category: 'Programming' },
    { id: 'Cascadia Code', name: 'Cascadia Code', category: 'Programming' }
  ];

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [keystrokeSound, setKeystrokeSound] = useState('mechanical');
  const [volume, setVolume] = useState(70);
  const keystrokeSounds = [
    { id: 'mechanical', name: 'Mechanical', icon: '🔧' },
    { id: 'click', name: 'Click', icon: '🖱️' },
    { id: 'bubble', name: 'Bubble', icon: '🫧' },
    { id: 'retro', name: 'Retro', icon: '🕹️' },
    { id: 'off', name: 'Off', icon: '🔇' }
  ];

  // Advanced settings
  const [caretStyle, setCaretStyle] = useState<'beam' | 'underline' | 'block'>('beam');
  const [caretSpeed, setCaretSpeed] = useState<'off' | 'fast' | 'smooth'>('smooth');
  const [keyboardLayout, setKeyboardLayout] = useState<'qwerty' | 'dvorak' | 'colemak'>('qwerty');
  const [uiScale, setUiScale] = useState(100);

  const caretStyles = [
    { id: 'beam', name: 'Beam (|)', icon: '|' },
    { id: 'underline', name: 'Underline (_)', icon: '_' },
    { id: 'block', name: 'Block (█)', icon: '█' }
  ];

  const keyboardLayouts = [
    { id: 'qwerty', name: 'QWERTY' },
    { id: 'dvorak', name: 'Dvorak' },
    { id: 'colemak', name: 'Colemak' }
  ];

  // Apply theme
  useEffect(() => {
    const theme = themes.find(t => t.id === selectedTheme);
    if (theme) {
      document.documentElement.style.setProperty('--bg', theme.bg);
      document.documentElement.style.setProperty('--main', theme.text);
      document.documentElement.style.setProperty('--accent', theme.accent);
    }
  }, [selectedTheme]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'none' // Performance optimized
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Premium Customization</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-800 p-1 rounded-xl">
            {[
              { id: 'themes', label: 'Themes', icon: Palette },
              { id: 'fonts', label: 'Fonts', icon: Type },
              { id: 'sounds', label: 'Sounds', icon: Volume2 },
              { id: 'advanced', label: 'Advanced', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'themes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Choose Theme</h3>
                <div className="grid grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedTheme === theme.id
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                      style={{
                        background: selectedTheme === theme.id ? `${theme.bg}20` : undefined
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-8 h-8 rounded-lg border-2 border-gray-600"
                          style={{ background: theme.bg }}
                        />
                        <span className="text-white font-medium">{theme.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-4 h-4 rounded" style={{ background: theme.text }} />
                        <div className="w-4 h-4 rounded" style={{ background: theme.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'fonts' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Font Selection</h3>
                <div className="space-y-2">
                  {fonts.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                        selectedFont === font.id
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <span className="text-white font-medium">{font.name}</span>
                      <span className="text-xs text-gray-400">{font.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sounds' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Sound Settings</h3>
                
                {/* Master Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-4">
                  <span className="text-white font-medium">Enable Sounds</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      soundEnabled ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    {soundEnabled && <Volume2 className="w-4 h-4 text-white" />}
                  </button>
                </div>

                {/* Keystroke Sound */}
                <div className="space-y-2">
                  <div className="text-white font-medium mb-2">Keystroke Sound</div>
                  <div className="grid grid-cols-3 gap-2">
                    {keystrokeSounds.map((sound) => (
                      <button
                        key={sound.id}
                        onClick={() => setKeystrokeSound(sound.id)}
                        disabled={!soundEnabled}
                        className={`p-3 rounded-lg border transition-all ${
                          keystrokeSound === sound.id && soundEnabled
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        } ${!soundEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{sound.icon}</div>
                          <div className="text-xs text-gray-400">{sound.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Control */}
                {soundEnabled && (
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Volume</span>
                      <span className="text-blue-400">{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-full"
                      disabled={!soundEnabled}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Advanced Settings</h3>
                
                {/* Caret Style */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-4">
                  <div className="text-white font-medium mb-2">Caret Style</div>
                  <div className="grid grid-cols-3 gap-2">
                    {caretStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setCaretStyle(style.id as any)}
                        className={`p-3 rounded-lg border transition-all ${
                          caretStyle === style.id
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1">{style.icon}</div>
                          <div className="text-xs text-gray-400">{style.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caret Speed */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-4">
                  <div className="text-white font-medium mb-2">Caret Animation</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'off', name: 'Off' },
                      { id: 'fast', name: 'Fast' },
                      { id: 'smooth', name: 'Smooth' }
                    ].map((speed) => (
                      <button
                        key={speed.id}
                        onClick={() => setCaretSpeed(speed.id as any)}
                        className={`p-3 rounded-lg border transition-all ${
                          caretSpeed === speed.id
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        {speed.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Keyboard Layout */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-4">
                  <div className="text-white font-medium mb-2">Keyboard Layout</div>
                  <div className="grid grid-cols-3 gap-2">
                    {keyboardLayouts.map((layout) => (
                      <button
                        key={layout.id}
                        onClick={() => setKeyboardLayout(layout.id as any)}
                        className={`p-3 rounded-lg border transition-all ${
                          keyboardLayout === layout.id
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        {layout.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* UI Scale */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">UI Scale</span>
                    <span className="text-blue-400">{uiScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="120"
                    value={uiScale}
                    onChange={(e) => setUiScale(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>80%</span>
                    <span>100%</span>
                    <span>120%</span>
                  </div>
                </div>

                {/* Performance Mode */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Performance Mode</span>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Optimized</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
            >
              Apply Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PremiumCustomization;
