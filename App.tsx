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


// Header and Sidebar are now managed within pages or specific layouts to prevent duplication

export default function App(): React.ReactNode {
    return (
        <ErrorBoundary name="GlobalApp">
            <BrowserRouter>
                <AppProvider>
                    <SoundProvider>
                        <ThemeProvider>
                            <Routes>
                                <Route path="/" element={<TypingPage />} />
                                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                                <Route path="/auth/github/callback" element={<GitHubCallback />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </ThemeProvider>
                    </SoundProvider>
                </AppProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

