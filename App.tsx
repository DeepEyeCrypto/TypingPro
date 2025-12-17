import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { SoundProvider } from './contexts/SoundContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/MainLayout';
import TypingPage from './pages/TypingPage';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
    return (
        <HashRouter>
            <AppProvider>
                <SoundProvider>
                    <ThemeProvider>
                        <ErrorBoundary>
                            <Routes>
                                <Route path="/" element={<MainLayout />}>
                                    <Route index element={<TypingPage />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Route>
                            </Routes>
                        </ErrorBoundary>
                    </ThemeProvider>
                </SoundProvider>
            </AppProvider>
        </HashRouter>
    );
}
