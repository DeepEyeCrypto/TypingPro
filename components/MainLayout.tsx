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
        login, logout, isSidebarCollapsed, setIsSidebarCollapsed, activeModal, setActiveModal
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
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={setIsSidebarCollapsed}
            header={
                <Header />
            }
            sidebar={
                <Sidebar />
            }
        >
            <Outlet context={{ setIsSidebarOpen: setIsSidebarCollapsed }} />

            {/* Modals */}
            {activeModal === 'history' && <HistoryModal history={history} onClose={() => setActiveModal('none')} onClear={clearUserHistory} />}
            {activeModal === 'achievements' && <AchievementsModal earnedBadges={earnedBadges} onClose={() => setActiveModal('none')} />}
            {activeModal === 'dashboard' && <StatsDashboard history={history} onClose={() => setActiveModal('none')} />}
            {activeModal === 'settings' && <SettingsModal onClose={() => setActiveModal('none')} />}
            {activeModal === 'profiles' && <UserProfilesModal
                profiles={profiles}
                currentProfile={currentProfile}
                onSelect={(p) => { switchProfile(p); setActiveModal('none'); }}
                onCreate={(name) => createNewProfile(name)}
                onClose={() => setActiveModal('none')}
            />}
        </AppShell>
    );
}
