import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import { useApp } from '@/contexts/AppContext';

export const GoogleCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUserProfile } = useApp();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('Google Auth Error:', error);
            navigate('/?auth_error=' + error);
            return;
        }

        if (code) {
            exchangeCode(code);
        }
    }, [searchParams, navigate]);

    const exchangeCode = async (code: string) => {
        try {
            const userData = await invoke<any>('exchange_oauth_code', { provider: 'google', code });
            // Depending on Google's response, you might need to fetch profile separately
            // but the user wants to "redirect to app" on success.
            console.log('Google User Data:', userData);

            // In a real app, you'd fetch the user profile here with the access_token
            // For now, let's assume we store the token and mock the profile or handle it in backend

            // If the backend returns the full profile:
            if (userData.access_token) {
                // Fetches profile using access_token
                const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: { Authorization: `Bearer ${userData.access_token}` }
                });
                const profile = await profileRes.json();
                setUserProfile({
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    avatar: profile.picture,
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
        <div className="flex flex-col items-center justify-center h-screen bg-[#323437] text-[#e2b714]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e2b714] mb-4"></div>
            <h2 className="text-xl font-bold uppercase tracking-widest">Authenticating with Google...</h2>
        </div>
    );
};
