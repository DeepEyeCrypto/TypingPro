import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GoogleCallback } from './src/components/auth/GoogleCallback';
import { GitHubCallback } from './src/components/auth/GitHubCallback';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AppProvider, useApp } from './contexts/AppContext';
import { SoundProvider } from './contexts/SoundContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppShell } from './components/layout/AppShell';
import { ZenHeader as Header } from './components/layout/ZenHeader';
import Sidebar from './components/Sidebar';
import TypingPage from './pages/TypingPage';
import { PerformanceOverlay } from './components/PerformanceOverlay';


const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isSidebarCollapsed, setIsSidebarCollapsed } = useApp();
    return (
        <AppShell
            header={<Header />}
            sidebar={<Sidebar />}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={setIsSidebarCollapsed}
        >
            <div className="w-full max-w-[1000px] mx-auto h-full flex flex-col">
                {children}
            </div>
            <PerformanceOverlay />
        </AppShell>
    );
};

export default function App(): React.ReactNode {
    return (
        <ErrorBoundary name="GlobalApp">
            <BrowserRouter>
                <AppProvider>
                    <SoundProvider>
                        <ThemeProvider>
                            <LayoutWrapper>
                                <Routes>
                                    <Route path="/" element={<TypingPage />} />
                                    <Route path="/auth/google/callback" element={<GoogleCallback />} />
                                    <Route path="/auth/github/callback" element={<GitHubCallback />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </LayoutWrapper>
                        </ThemeProvider>
                    </SoundProvider>
                </AppProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

