// Basic modal for profile switching, extracted from App.tsx
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface UserProfilesModalProps {
    profiles: UserProfile[];
    currentProfile: UserProfile;
    onSelect: (p: UserProfile) => void;
    onCreate: (name: string) => void;
    onClose: () => void;
}

export default function UserProfilesModal({ profiles, currentProfile, onSelect, onCreate, onClose }: UserProfilesModalProps) {
    const [newProfileName, setNewProfileName] = useState('');

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1F2937] w-full max-w-md rounded-2xl shadow-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Select Profile</h3>
                <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
                    {profiles.map(p => (
                        <button
                            key={p.id}
                            onClick={() => onSelect(p)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${currentProfile.id === p.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'}`}
                        >
                            <span className="font-medium">{p.name}</span>
                            {currentProfile.id === p.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="New Profile Name"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={() => { onCreate(newProfileName); setNewProfileName(''); }}
                        disabled={!newProfileName.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        Create
                    </button>
                </div>
                <button onClick={onClose} className="mt-4 w-full py-2 text-gray-500 dark:text-gray-400 text-sm hover:underline">Cancel</button>
            </div>
        </div>
    );
}
