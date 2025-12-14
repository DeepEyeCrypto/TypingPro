import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useApp } from '../contexts/AppContext';
import { Outlet } from 'react-router-dom';
import { LESSONS } from '../constants';
import SettingsModal from './SettingsModal';
import HistoryModal from './HistoryModal';
import AchievementsModal from './AchievementsModal';
import StatsDashboard from './StatsDashboard';
import UserProfilesModal from './UserProfilesModal';
import TutorialsModal from './TutorialsModal';

export default function MainLayout() {
    const {
        currentProfile, settings, systemTheme, lessonProgress, history, earnedBadges, activeLessonId,
        updateUserSetting, switchProfile, clearUserHistory, profiles, createNewProfile, user,
        login, logout
    } = useApp();

    const handleLogin = async () => {
        try {
            await login();
        } catch (error: any) {
            if (error === "Cancelled" || error.message === "Cancelled") return;
            alert("Login Failed: " + error);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [modal, setModal] = useState<'none' | 'settings' | 'history' | 'achievements' | 'dashboard' | 'profiles' | 'tutorials'>('none');
    const [initialVideoId, setInitialVideoId] = useState<number | undefined>(undefined);

    const handleOpenTutorials = (videoId?: number) => {
        setInitialVideoId(videoId);
        setModal('tutorials');
    };

    // Toggle Theme Helper
    const handleThemeToggle = () => {
        const effectiveTheme = settings.theme === 'system' ? systemTheme : settings.theme;
        const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
        updateUserSetting('theme', newTheme);
    };

    const unlockedMap: Record<number, boolean> = {};
    Object.keys(lessonProgress).forEach(k => {
        unlockedMap[Number(k)] = lessonProgress[Number(k)].unlocked;
    });

    return (
        <div className="h-screen w-screen flex flex-col bg-[#F5F5F7] dark:bg-[#0B1120] overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {/* 
         Header needs callbacks. We will wire them to modals here.
         We might need to pass `currentLessonId` from the Outlet? 
         A simple way is `useOutletContext`. 
      */}
            <Header
                // These props will be overridden or managed by the page logic via Context or Outlet context unfortunately.
                // If Header is just "Nav", it shouldn't care about "Current Lesson".
                // But it does showing the progress bar.
                // Let's assume for now we pass defaults and the specific Page updates it via a separate mechanism or we ignore for a moment.
                // Actually, cleaner is: Header uses `useApp` for global stuff, and maybe `useGame` for game stuff.
                // For this pass, I will just render it with dummy lesson ID 1 if not provided, 
                // OR better: The TypingPage should render the Header? No, Layout does.
                currentLessonId={activeLessonId}
                totalLessons={LESSONS.length}
                onSelectLesson={() => {/* Handle Nav via Router? */ }}
                onOpenSettings={() => setModal('settings')}
                onOpenHistory={() => setModal('history')}
                onOpenAchievements={() => setModal('achievements')}
                onOpenDashboard={() => setModal('dashboard')}
                onOpenTutorials={() => handleOpenTutorials()}
                toggleDarkMode={handleThemeToggle}
                isDarkMode={(settings.theme === 'system' ? systemTheme : settings.theme) === 'dark'}
                progress={0} // Live progress... tough one.
                unlockedLessons={unlockedMap}
                currentProfile={currentProfile}
                onSwitchProfile={() => setModal('profiles')}
                onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
            />

            <div className="flex flex-1 overflow-hidden pt-[52px]">
                <Sidebar
                    currentLessonId={1}
                    onSelectLesson={() => { }}
                    lessonProgress={lessonProgress}
                    isOpen={isSidebarOpen}
                />

                <main className="flex-1 flex flex-col relative min-w-0">
                    <Outlet context={{ setIsSidebarOpen, onOpenTutorials: handleOpenTutorials }} />
                </main>
            </div>

            {/* Modals */}
            {modal === 'history' && <HistoryModal history={history} onClose={() => setModal('none')} onClear={clearUserHistory} />}
            {modal === 'achievements' && <AchievementsModal earnedBadges={earnedBadges} onClose={() => setModal('none')} />}
            {modal === 'dashboard' && <StatsDashboard history={history} onClose={() => setModal('none')} />}
            {modal === 'settings' && <SettingsModal onClose={() => setModal('none')} />}
            {modal === 'tutorials' && <TutorialsModal onClose={() => setModal('none')} initialVideoId={initialVideoId} />}
            {modal === 'profiles' && <UserProfilesModal
                profiles={profiles}
                currentProfile={currentProfile}
                onSelect={(p) => { switchProfile(p); setModal('none'); }}
                onCreate={(name) => createNewProfile(name)}
                onClose={() => setModal('none')}
            />}
        </div>
    );
}
