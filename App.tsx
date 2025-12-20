import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { SoundProvider } from './contexts/SoundContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppShell } from './components/layout/AppShell';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TypingPage from './pages/TypingPage';
import { ErrorBoundary } from './components/ErrorBoundary';

import { PerformanceOverlay } from './components/PerformanceOverlay';

/**
 * TypingPro Core Entry
 * Rewritten for Clean Slate - v0.0.68+
 */
export default function App(): React.ReactNode {
    return (
        <ErrorBoundary name="GlobalApp">
            <HashRouter>
                <AppProvider>
                    <SoundProvider>
                        <ThemeProvider>
                            <AppShell
                                header={<Header />}
                                sidebar={<Sidebar />}
                            >
                                <Routes>
                                    <Route path="/" element={<TypingPage />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                                <PerformanceOverlay />
                            </AppShell>
                        </ThemeProvider>
                    </SoundProvider>
                </AppProvider>
            </HashRouter>
        </ErrorBoundary>
    );
}
