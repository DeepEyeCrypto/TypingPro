import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ConfigValidator: React.FC = () => {
    const [missingKeys, setMissingKeys] = useState<string[]>([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const env = (import.meta as any).env || {};
        console.log('[ConfigValidator] import.meta.env keys:', Object.keys(env));
        console.log('[ConfigValidator] VITE_GOOGLE_CLIENT_ID exists:', !!env.VITE_GOOGLE_CLIENT_ID);

        const requiredKeys = [
            'VITE_GOOGLE_CLIENT_ID',
            'VITE_GITHUB_CLIENT_ID'
        ];

        const missing = requiredKeys.filter(key => !env[key] || env[key].includes('your_'));

        if (missing.length > 0) {
            setMissingKeys(missing);
            setShow(true);
        }
    }, []);

    if (!show) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[9999] max-w-sm animate-in slide-in-from-right-10 duration-500">
            <div className="bg-[#ca4754] text-white p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black uppercase tracking-widest text-xs mb-2">Config Warning</h3>
                        <p className="text-[10px] opacity-80 leading-relaxed font-mono">
                            The following environment variables are missing or using placeholders:
                        </p>
                        <ul className="mt-3 space-y-1">
                            {missingKeys.map(key => (
                                <li key={key} className="text-[9px] font-bold bg-black/20 px-2 py-1 rounded-md border border-white/5 font-mono">
                                    {key}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-[9px] opacity-60 italic">
                            Check your .env file and restart the dev server.
                        </p>
                    </div>
                    <button onClick={() => setShow(false)} className="opacity-40 hover:opacity-100 transition-opacity">
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
