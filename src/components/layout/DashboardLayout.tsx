import React, { useState } from 'react';
import { AppShell } from '../src/components/layout/AppShell';
import { SideNav } from '../src/components/layout/SideNav';
import { TopBar } from '../src/components/layout/TopBar';
import { TypingField } from '../src/components/TypingField';
import { Card } from '../src/components/ui/Card';
import { StatDisplay } from '../src/components/ui/StatDisplay';
import { Button } from '../src/components/ui/Button';
import { SoundSelector } from '../src/components/settings/SoundSelector';

/**
 * REFACTORED APP ENTRY (MOCK)
 * Shows how TypingPro will look using the new primitives.
 */
export const DashboardLayout = () => {
    const [activeTab, setActiveTab] = useState('practice');

    const navItems = [
        { id: 'practice', icon: <PracticeIcon />, label: 'Practice', onClick: () => setActiveTab('practice'), active: activeTab === 'practice' },
        { id: 'tests', icon: <TestIcon />, label: 'Tests', onClick: () => setActiveTab('tests'), active: activeTab === 'tests' },
        { id: 'analytics', icon: <AnalyticsIcon />, label: 'Analytics', onClick: () => setActiveTab('analytics'), active: activeTab === 'analytics' },
        { id: 'social', icon: <SocialIcon />, label: 'Social', onClick: () => setActiveTab('social'), active: activeTab === 'social' },
        { id: 'settings', icon: <SettingsIcon />, label: 'Settings', onClick: () => setActiveTab('settings'), active: activeTab === 'settings' },
    ];

    return (
        <AppShell
            sidebar={<SideNav items={navItems} />}
            topbar={
                <TopBar
                    title="TYPING PERFORMANCE SUITE"
                    stats={{ wpm: 124, accuracy: 98, rank: 'DIAMOND III' }}
                    actions={<Button variant="ghost" size="sm">LOGOUT</Button>}
                />
            }
        >

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full w-full">
                {/* TYPING SECTION */}
                <section className="flex flex-col items-center">
                    {/* TypingField would go here, wrapped in a high-focus container */}
                    <div className="w-full max-w-4xl pt-12">
                        {/* Mocking the performance field */}
                        <Card className="border-white/10 bg-white/5 dark:bg-black/30">
                            <div className="flex justify-center py-12">
                                <span className="mono-text-interactive opacity-20 font-mono text-2xl">TYPING_ENGINE_READY_V1.2.40</span>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* METRICS ROW */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Live Performance" subtitle="Real-time Metrics">
                        <div className="grid grid-cols-2 gap-4">
                            <StatDisplay label="WPM" value={124} trend="up" color="neutral" />
                            <StatDisplay label="ACC" value="98%" trend="neutral" />
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <StatDisplay label="Raw Speed" value="132" subValue="kpm" />
                        </div>
                    </Card>

                    <Card title="Rank Progression" subtitle="Diamond Division" action={<Button variant="primary" size="sm">VIEW_LADDER</Button>}>
                        <div className="space-y-4">
                            <div className="h-2 w-full bg-white/5 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-900 dark:bg-white w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                            </div>
                            <p className="text-[10px] mono-text-interactive opacity-40 uppercase font-bold text-center">782 / 1000 RP TO MASTER</p>
                        </div>
                    </Card>

                    <Card title="Recent Activity" subtitle="Past 24 Hours">
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-white/5 transition-colors group">
                                    <span className="mono-text-interactive opacity-60">Practice Session #{i}</span>
                                    <span className="mono-text-interactive font-mono">118 wpm</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* SOUND ENGINE VERIFICATION */}
                <section>
                    <Card title="Audio Engineering" subtitle="Latency & Profile Test">
                        <SoundSelector />
                    </Card>
                </section>
            </div>
        </AppShell>
    );
};

// ICONS (Simple SVG components)
const PracticeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" /></svg>;
const TestIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AnalyticsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const SocialIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
