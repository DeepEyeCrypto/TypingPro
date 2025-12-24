import React, { useState, useEffect } from 'react';
import { CurriculumSelector } from '../components/CurriculumSelector';
import { TypingArea } from '../components/TypingArea';
import { TopBar } from '../components/TopBar';
import { Lesson } from '../data/CurriculumDatabase';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for guest or logged in user in localStorage
        const savedUser = localStorage.getItem('typingPro_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }

        // Performance optimizations: Disable some browser behaviors
        const preventDefault = (e: Event) => e.preventDefault();
        document.addEventListener('contextmenu', preventDefault);

        return () => {
            document.removeEventListener('contextmenu', preventDefault);
        };
    }, []);

    return (
        <div className="dashboard-page">
            <TopBar isLoggedIn={isLoggedIn} user={user} />

            <main className="main-content">
                {!currentLesson ? (
                    <CurriculumSelector onSelectLesson={setCurrentLesson} />
                ) : (
                    <TypingArea
                        lesson={currentLesson}
                        onBack={() => setCurrentLesson(null)}
                        isLoggedIn={isLoggedIn}
                    />
                )}
            </main>

            {/* Decorative liquid background for consistent premium feel */}
            <div className="dashboard-background">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>
        </div>
    );
};

export default DashboardPage;
