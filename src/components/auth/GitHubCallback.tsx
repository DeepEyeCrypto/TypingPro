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
            const userData = await invoke<any>('exchange_oauth_code', { provider: 'github', code });
            console.log('GitHub Token Data:', userData);

            if (userData.access_token) {
                // Fetches profile using access_token
                const profileRes = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `token ${userData.access_token}`,
                        Accept: 'application/json'
                    }
                });
                const profile = await profileRes.json();
                setUserProfile({
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email || '',
                    avatar: profile.avatar_url,
                    token: userData.access_token,
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
            }

            navigate('/');
        } catch (err) {
            console.error('Exchange failed:', err);
            navigate('/?auth_error=exchange_failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#323437] text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <h2 className="text-xl font-bold uppercase tracking-widest">Authenticating with GitHub...</h2>
        </div>
    );
};
