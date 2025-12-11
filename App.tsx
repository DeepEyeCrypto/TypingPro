import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './components/MainLayout';
import TypingPage from './pages/TypingPage';

// Simple router setup
// Using HashRouter for Electron compatibility
export default function App() {
    return (
        <HashRouter>
            <AppProvider>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<TypingPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </AppProvider>
        </HashRouter>
    );
}
