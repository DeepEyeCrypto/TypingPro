import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AppShell } from './layout/AppShell';
import Sidebar from '../components/Sidebar';
import { useApp } from '../contexts/AppContext';
import { Outlet } from 'react-router-dom';
import { LESSONS } from '../constants';
import SettingsModal from './SettingsModal';
import HistoryModal from './HistoryModal';
import AchievementsModal from './AchievementsModal';
import StatsDashboard from './StatsDashboard';
import UserProfilesModal from './UserProfilesModal';

export default function MainLayout() {
    const {
        currentProfile, settings, systemTheme, lessonProgress, history, earnedBadges, activeLessonId,
        setActiveLessonId, updateUserSetting, switchProfile, clearUserHistory, profiles, createNewProfile, user,
        login, logout
    } = useApp();

    const handleLogin = async () => {
        try {
            await login();
        } catch (error: unknown) {
            if (error === "Cancelled" || (error instanceof Error && error.message === "Cancelled")) return;
            alert("Login Failed: " + (error instanceof Error ? error.message : String(error)));
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [modal, setModal] = useState<'none' | 'settings' | 'history' | 'achievements' | 'dashboard' | 'profiles'>('none');

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
        <AppShell
            header={
                <Header
                    currentLessonId={activeLessonId}
                    totalLessons={LESSONS.length}
                    onSelectLesson={setActiveLessonId}
                    onOpenSettings={() => setModal('settings')}
                    onOpenHistory={() => setModal('history')}
                    onOpenAchievements={() => setModal('achievements')}
                    onOpenDashboard={() => setModal('dashboard')}
                    // Theme logic is now in ThemeContext/Header, but Header still expects props.
                    // We temporarily pass props until we refactor Header.
                    toggleDarkMode={handleThemeToggle}
                    isDarkMode={(settings.theme === 'system' ? systemTheme : settings.theme) === 'dark'}
                    progress={0}
                    unlockedLessons={unlockedMap}
                    currentProfile={currentProfile}
                    onSwitchProfile={() => setModal('profiles')}
                    onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                    user={user}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                />
            }
            sidebar={
                <Sidebar
                    currentLessonId={activeLessonId}
                    onSelectLesson={setActiveLessonId}
                    lessonProgress={lessonProgress}
                    isOpen={isSidebarOpen}
                />
            }
        >
            <Outlet context={{ setIsSidebarOpen }} />

            {/* Modals */}
            {modal === 'history' && <HistoryModal history={history} onClose={() => setModal('none')} onClear={clearUserHistory} />}
            {modal === 'achievements' && <AchievementsModal earnedBadges={earnedBadges} onClose={() => setModal('none')} />}
            {modal === 'dashboard' && <StatsDashboard history={history} onClose={() => setModal('none')} />}
            {modal === 'settings' && <SettingsModal onClose={() => setModal('none')} />}
            {modal === 'profiles' && <UserProfilesModal
                profiles={profiles}
                currentProfile={currentProfile}
                onSelect={(p) => { switchProfile(p); setModal('none'); }}
                onCreate={(name) => createNewProfile(name)}
                onClose={() => setModal('none')}
            />}
        </AppShell>
    );
}
