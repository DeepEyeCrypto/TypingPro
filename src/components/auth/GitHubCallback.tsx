import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import { useApp } from '@/contexts/AppContext';

export const GitHubCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUserProfile } = useApp();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('GitHub Auth Error:', error);
            navigate('/?auth_error=' + error);
            return;
        }

        if (code) {
            exchangeCode(code);
        }
    }, [searchParams, navigate]);

    const exchangeCode = async (code: string) => {
        try {
            const { authService } = await import('@/services/authService');
            const user = await authService.completeOAuthFlow('github', code);

            setUserProfile({
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.picture,
                token: user.token,
                xp: 0,
                level: 1,
                streakCount: 1,
                createdAt: new Date().toISOString(),
                progression: {
                    unlockedLessons: [1],
                    completedLessons: {},
                    weaknessHeatmap: {},
                    dailyQuests: [],
                    badges: [],
                    totalWordsTyped: 0,
                    totalTimeSpent: 0
                }
            });

            navigate('/');
        } catch (err: any) {
            console.error('Exchange failed:', err);
            navigate('/?auth_error=' + encodeURIComponent(err.message || 'exchange_failed'));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#323437] text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <h2 className="text-xl font-bold uppercase tracking-widest">Authenticating with GitHub...</h2>
        </div>
    );
};
