
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TypingArea from './components/TypingArea';
import VirtualKeyboard from './components/VirtualKeyboard';
import HistoryModal from './components/HistoryModal';
import AchievementsModal from './components/AchievementsModal';
import StatsDashboard from './components/StatsDashboard';
import Sidebar from './components/Sidebar';
import { LESSONS, BADGES, FANCY_FONTS } from './constants';
import { Lesson, Stats, LessonProgress, HistoryEntry, UserProfile, UserSettings, EarnedBadge, KeyboardLayoutType, ThemeMode, FontSize, CursorStyle } from './types';
import { generateSmartLesson } from './services/geminiService';
import { 
    getHistory, saveHistory, clearHistory, 
    getLessonProgress, updateLessonProgress, unlockLesson, 
    getSettings, saveSettings,
    getProfiles, createProfile,
    getEarnedBadges, saveEarnedBadge
} from './services/storageService';
import { setVolume } from './services/audioService';
import { Loader2, Download, Trophy, X, Lock, Keyboard, Volume2, Monitor, Sun, Moon, Laptop, Type, Search, Eye, AlertCircle, ScanLine } from 'lucide-react';

export default function App() {
  // --- Profiles ---
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>({ id: 'default', name: 'Guest', createdAt: '' });
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // --- Settings ---
  const [settings, setUserSettings] = useState<UserSettings>({ 
      theme: 'system', 
      keyboardLayout: 'qwerty', 
      soundEnabled: true, 
      volume: 0.5,
      showKeyboard: true,
      fontFamily: 'Inter',
      fontSize: 'large',
      cursorStyle: 'block',
      stopOnError: false
  });

  // --- Theme State ---
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // --- Game Data ---
  const [lessonProgress, setLessonProgress] = useState<Record<number, LessonProgress>>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);

  // --- Current Lesson ---
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [activeLesson, setActiveLesson] = useState<Lesson>(LESSONS[0]);
  const [retryCount, setRetryCount] = useState(0); // Forces TypingArea reset

  // --- Gameplay ---
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [modalStats, setModalStats] = useState<Stats | null>(null);
  const [liveStats, setLiveStats] = useState({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
  
  // --- UI Panels ---
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // --- Font Filter State ---
  const [fontSearch, setFontSearch] = useState('');

  // --- Initialization ---

  // Detect System Theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Load Profiles
    const loadedProfiles = getProfiles();
    setProfiles(loadedProfiles);
    
    // Set active profile (default to first or persisted)
    // For simplicity, default to first. Real app might check LastUsedProfile
    const active = loadedProfiles[0];
    setCurrentProfile(active);
  }, []);

  // When Profile Changes, Load Data
  useEffect(() => {
    if (!currentProfile.id) return;

    const progress = getLessonProgress(currentProfile.id);
    const hist = getHistory(currentProfile.id);
    const prefs = getSettings(currentProfile.id);
    const badges = getEarnedBadges(currentProfile.id);

    setLessonProgress(progress);
    setHistory(hist);
    setUserSettings(prefs);
    setEarnedBadges(badges);
    setVolume(prefs.volume);

    // Restore Lesson
    const savedId = localStorage.getItem(`last_lesson_${currentProfile.id}`);
    const id = savedId ? parseInt(savedId, 10) : 1;
    if (progress[id]?.unlocked) {
        handleLessonSelect(id, false); // false = don't save redundant state
    } else {
        handleLessonSelect(1, false);
    }
  }, [currentProfile.id]);

  // --- Apply Font and Theme ---
  useEffect(() => {
      saveSettings(currentProfile.id, settings);
      setVolume(settings.volume);
      
      const effectiveTheme = settings.theme === 'system' ? systemTheme : settings.theme;
      if (effectiveTheme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }

      // Load active font if it's not the default
      if (settings.fontFamily !== 'Inter') {
        const fontObj = FANCY_FONTS.find(f => f.family === settings.fontFamily);
        if (fontObj && fontObj.url) {
            // Check if stylesheet exists
            const id = `font-${settings.fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
            if (!document.getElementById(id)) {
                const link = document.createElement('link');
                link.id = id;
                link.href = fontObj.url;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        }
      }
      
      // Apply font globally
      // We use !important to override Tailwind's font-sans
      document.body.style.setProperty('font-family', `"${settings.fontFamily}", sans-serif`, 'important');

  }, [settings, currentProfile.id, systemTheme]);

  // --- Load All Preview Fonts on Settings Open ---
  useEffect(() => {
    if (showSettings) {
        // Create a single consolidated link or multiple links for all fancy fonts to enable live preview
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
    }
  }, [showSettings]);


  // --- Keyboard & Shortcuts ---
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => new Set(prev).add(e.key));
      
      // Shortcuts (Alt + Key)
      if (e.altKey) {
          if (e.code === 'KeyN') handleNextLesson();
          if (e.code === 'KeyR') {
               // Restart
               handleRetry();
          }
          if (e.code === 'KeyB') {
            setIsSidebarOpen(prev => !prev);
          }
      }
    };
    
    const handleUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [activeLesson, currentLessonId]); // Depend on lesson for shortcuts


  // --- Handlers ---

  const handleCreateProfile = () => {
      if (newProfileName.trim()) {
          const p = createProfile(newProfileName.trim());
          setProfiles(prev => [...prev, p]);
          setCurrentProfile(p);
          setNewProfileName('');
          setShowProfileSwitcher(false);
      }
  };

  const handleLessonSelect = (id: number, save = true) => {
    const progress = lessonProgress[id];
    if (!progress?.unlocked) return; 

    const lesson = LESSONS.find(l => l.id === id);
    if (lesson) {
        setCurrentLessonId(id);
        setActiveLesson(lesson);
        setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
        setRetryCount(0); // Reset retry count for new lesson
        if (save) localStorage.setItem(`last_lesson_${currentProfile.id}`, id.toString());
    }
  };

  const handleRetry = () => {
      setModalStats(null);
      setLiveStats({ wpm: 0, accuracy: 100, errors: 0, progress: 0 });
      setRetryCount(c => c + 1); // Increment to force key change and remount
  };

  const handleComplete = (stats: Stats) => {
    // New requirements: 100% Accuracy AND 22 WPM
    const passedCriteria = stats.accuracy === 100 && stats.wpm >= 22;
    
    // Update Progress
    const updatedProgress = updateLessonProgress(currentProfile.id, activeLesson.id, {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        completed: passedCriteria
    });

    // Unlock Next
    if (passedCriteria) {
        const nextId = activeLesson.id + 1;
        if (LESSONS.find(l => l.id === nextId)) {
            unlockLesson(currentProfile.id, nextId);
            updatedProgress[nextId] = { ...updatedProgress[nextId], unlocked: true };
        }
    }
    setLessonProgress({...updatedProgress});

    // Save History
    const historyEntry: HistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        lessonId: activeLesson.id,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        durationSeconds: (Date.now() - (stats.startTime || 0)) / 1000
    };
    saveHistory(currentProfile.id, historyEntry);
    const newHistory = [historyEntry, ...history];
    setHistory(newHistory);

    // Check Badges
    BADGES.forEach(badge => {
        if (!earnedBadges.some(eb => eb.badgeId === badge.id)) {
            if (badge.condition(newHistory, updatedProgress)) {
                saveEarnedBadge(currentProfile.id, badge.id);
                setEarnedBadges(prev => [...prev, { badgeId: badge.id, earnedAt: new Date().toISOString() }]);
                // Could show toast notification here
            }
        }
    });

    setModalStats({ ...stats, completed: passedCriteria });
  };

  const handleNextLesson = () => {
    setModalStats(null);
    if (currentLessonId < LESSONS.length) {
        handleLessonSelect(currentLessonId + 1);
    }
  };

  const handleSmartLesson = async () => {
    setIsLoadingAi(true);
    setShowSettings(false);
    
    // Find weak keys from history
    const newLesson = await generateSmartLesson(['f', 'j', 'd', 'k', 's', 'l'], 'medium');
    setIsLoadingAi(false);
    
    if (newLesson) {
        setActiveLesson(newLesson);
        setCurrentLessonId(999); 
        setRetryCount(0);
    }
  };

  const updateSetting = (key: keyof UserSettings, val: any) => {
      setUserSettings(prev => ({ ...prev, [key]: val }));
  };

  // Quick Toggle Handler for Header
  const handleThemeToggle = () => {
    const effectiveTheme = settings.theme === 'system' ? systemTheme : settings.theme;
    // Toggle logic: If Dark -> Light, If Light -> Dark.
    // This sets a manual override. To go back to system, user must use Settings modal.
    const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    updateSetting('theme', newTheme);
  };

  const unlockedMap: Record<number, boolean> = {};
  Object.keys(lessonProgress).forEach(k => {
      unlockedMap[Number(k)] = lessonProgress[Number(k)].unlocked;
  });

  const isEffectiveDarkMode = (settings.theme === 'system' ? systemTheme : settings.theme) === 'dark';

  const filteredFonts = FANCY_FONTS.filter(f => f.name.toLowerCase().includes(fontSearch.toLowerCase()) || f.category.toLowerCase().includes(fontSearch.toLowerCase()));

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F5F5F7] dark:bg-[#0B1120] overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header 
        currentLessonId={currentLessonId} 
        totalLessons={LESSONS.length} 
        onSelectLesson={handleLessonSelect}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHistory={() => setShowHistory(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenDashboard={() => setShowDashboard(true)}
        toggleDarkMode={handleThemeToggle}
        isDarkMode={isEffectiveDarkMode}
        progress={liveStats.progress}
        unlockedLessons={unlockedMap}
        currentProfile={currentProfile}
        onSwitchProfile={() => setShowProfileSwitcher(true)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      <div className="flex flex-1 overflow-hidden pt-[52px]">
        
        <Sidebar 
            currentLessonId={currentLessonId}
            onSelectLesson={handleLessonSelect}
            lessonProgress={lessonProgress}
            isOpen={isSidebarOpen}
        />

        <main className="flex-1 flex flex-col relative min-w-0">
            {isLoadingAi && (
                <div className="absolute inset-0 z-50 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                    <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Generating...</p>
                </div>
            )}

            <div className="flex-1 flex flex-col justify-center items-center w-full px-2 py-2 relative z-10 h-full">
                <div className="w-full text-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">{activeLesson.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{activeLesson.description}</p>
                </div>

                <div className="w-full h-full flex items-center justify-center">
                    <TypingArea 
                        key={`${activeLesson.id}-${currentProfile.id}-${retryCount}`} 
                        content={activeLesson.content}
                        activeLessonId={activeLesson.id}
                        isActive={!modalStats && !showSettings && !showHistory && !showDashboard}
                        soundEnabled={settings.soundEnabled}
                        onComplete={handleComplete}
                        onRestart={() => setActiveLesson({...activeLesson})}
                        onActiveKeyChange={setActiveKey}
                        onStatsUpdate={setLiveStats}
                        fontFamily={settings.fontFamily}
                        fontSize={settings.fontSize}
                        cursorStyle={settings.cursorStyle}
                        stopOnError={settings.stopOnError}
                    />
                </div>
            </div>

            <div className="h-[40vh] bg-white/50 dark:bg-[#111827]/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 w-full flex flex-col items-center justify-start pt-2 pb-4 relative z-0 shadow-2xl">
                <div className="flex items-center gap-12 mb-2 py-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">WPM</span>
                        <span className="font-mono text-2xl font-bold text-gray-800 dark:text-white leading-none">{liveStats.wpm}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Accuracy</span>
                        <span className={`font-mono text-2xl font-bold leading-none ${liveStats.accuracy < 100 ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>
                            {liveStats.accuracy}%
                        </span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Errors</span>
                        <span className={`font-mono text-2xl font-bold leading-none ${liveStats.errors > 0 ? 'text-[#FF3B30]' : 'text-gray-800 dark:text-gray-200'}`}>
                            {liveStats.errors}
                        </span>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-[95%]">
                    {settings.showKeyboard && (
                        <VirtualKeyboard 
                            activeKey={activeKey}
                            pressedKeys={pressedKeys} 
                            layout={settings.keyboardLayout}
                        />
                    )}
                </div>
            </div>
        </main>
      </div>

      {/* MODALS */}

      {modalStats && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-sm w-full transform transition-all scale-100 flex flex-col items-center text-center border border-white/20 dark:border-gray-700 ring-1 ring-black/5">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg text-white ${modalStats.completed ? 'bg-gradient-to-tr from-green-400 to-green-600 shadow-green-400/30' : 'bg-gradient-to-tr from-orange-400 to-orange-600 shadow-orange-400/30'}`}>
                    {modalStats.completed ? <Trophy className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {modalStats.completed ? "Lesson Complete!" : "Try Again"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {modalStats.completed ? "Great job! You've unlocked the next lesson." : "You need 100% accuracy and 22 WPM to pass."}
                </p>
                <div className="grid grid-cols-3 gap-3 w-full my-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className={`text-xl font-bold ${modalStats.wpm >= 22 ? 'text-gray-800 dark:text-white' : 'text-[#FF3B30]'}`}>{modalStats.wpm}</div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">WPM</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className={`text-xl font-bold ${modalStats.accuracy === 100 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>{modalStats.accuracy}%</div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Acc</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className={`text-xl font-bold ${modalStats.errors === 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>{modalStats.errors}</div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Err</div>
                    </div>
                </div>
                <div className="flex gap-3 w-full mt-2">
                    <button 
                        onClick={handleRetry}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Retry
                    </button>
                    <button 
                        onClick={handleNextLesson}
                        disabled={!modalStats.completed}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all ${
                            modalStats.completed 
                            ? 'bg-[#007AFF] hover:bg-blue-600 shadow-blue-200 dark:shadow-blue-900/30' 
                            : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50 shadow-none'
                        }`}
                    >
                        {modalStats.completed ? "Next" : "Locked"}
                    </button>
                </div>
            </div>
        </div>
      )}

      {showHistory && (
          <HistoryModal 
            history={history} 
            onClose={() => setShowHistory(false)} 
            onClear={() => { clearHistory(currentProfile.id); setHistory([]); }}
          />
      )}

      {showAchievements && (
          <AchievementsModal 
            earnedBadges={earnedBadges} 
            onClose={() => setShowAchievements(false)} 
          />
      )}

      {showDashboard && (
          <StatsDashboard 
            history={history} 
            onClose={() => setShowDashboard(false)} 
          />
      )}

      {showProfileSwitcher && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white dark:bg-[#1F2937] w-full max-w-md rounded-2xl shadow-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Profile</h3>
                  <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
                      {profiles.map(p => (
                          <button
                            key={p.id}
                            onClick={() => { setCurrentProfile(p); setShowProfileSwitcher(false); }}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${currentProfile.id === p.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'}`}
                          >
                              <span className="font-medium">{p.name}</span>
                              {currentProfile.id === p.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                          </button>
                      ))}
                  </div>
                  <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="New Profile Name"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button 
                        onClick={handleCreateProfile}
                        disabled={!newProfileName.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                          Create
                      </button>
                  </div>
                  <button onClick={() => setShowProfileSwitcher(false)} className="mt-4 w-full py-2 text-gray-500 dark:text-gray-400 text-sm hover:underline">Cancel</button>
              </div>
          </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
             <div className="bg-white/95 dark:bg-[#1F2937]/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative border border-white/20 dark:border-gray-700 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                    <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
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
                                    onClick={() => updateSetting('theme', mode)}
                                    className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                                        settings.theme === mode 
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

                         {/* Font Size */}
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Font Size</label>
                                <div className="grid grid-cols-4 gap-1">
                                    {(['small', 'medium', 'large', 'xl'] as FontSize[]).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => updateSetting('fontSize', size)}
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
                                            onClick={() => updateSetting('cursorStyle', style)}
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
                                onClick={() => updateSetting('stopOnError', !settings.stopOnError)}
                                className={`w-11 h-6 rounded-full p-1 transition-colors ${settings.stopOnError ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.stopOnError ? 'translate-x-5' : 'translate-x-0'}`} />
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
                                    onClick={() => updateSetting('fontFamily', font.family)}
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
                            {filteredFonts.length === 0 && (
                                <div className="col-span-2 text-center text-gray-400 py-4 text-sm">No fonts found</div>
                            )}
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
                            onChange={(e) => updateSetting('keyboardLayout', e.target.value as KeyboardLayoutType)}
                            className="bg-gray-100 dark:bg-gray-900 border-none rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                         >
                             <option value="qwerty">QWERTY</option>
                             <option value="dvorak">Dvorak</option>
                             <option value="colemak">Colemak</option>
                         </select>
                    </div>

                    {/* Sound */}
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                         <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-5 h-5 text-gray-500" />
                                <div>
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Sound Effects</h3>
                                </div>
                            </div>
                            <button 
                                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                         </div>
                         {settings.soundEnabled && (
                             <input 
                                type="range" min="0" max="1" step="0.1"
                                value={settings.volume}
                                onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
                                className="w-full accent-blue-600"
                             />
                         )}
                    </div>

                    {/* AI Coach */}
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                             <Monitor className="w-4 h-4 text-gray-500" /> AI Practice
                        </h3>
                        <button 
                            onClick={handleSmartLesson}
                            className="w-full py-2 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Loader2 className="w-3 h-3" /> Generate Smart Lesson
                        </button>
                    </div>

                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={() => {
                                const data = JSON.stringify(history, null, 2);
                                const blob = new Blob([data], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `typing-history-${currentProfile.name}.json`;
                                a.click();
                            }}
                            className="w-full py-2 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-3 h-3" /> Export Data
                        </button>
                    </div>
                </div>
             </div>
        </div>
      )}
    </div>
  );
}
