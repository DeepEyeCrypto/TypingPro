import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './ReleaseHub.css';

interface BuildInfo {
    version: string;
    commit_hash: string;
    target_os: string;
    env: string;
}

export const ReleaseHub: React.FC = () => {
    const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);

    useEffect(() => {
        invoke<BuildInfo>('get_build_info')
            .then(setBuildInfo)
            .catch(console.error);
    }, []);

    return (
        <div className="release-hub glass-panel">
            <div className="hub-header">
                <h2>Release Intelligence</h2>
                <div className="env-badge">
                    <span className={`dot ${buildInfo?.env === 'Production' ? 'pulse-cyan' : 'pulse-amber'}`}></span>
                    {buildInfo?.env || 'Detecting...'}
                </div>
            </div>

            <div className="version-grid">
                <div className="version-stat">
                    <label>Version</label>
                    <span className="val">{buildInfo?.version || '0.0.0'}</span>
                </div>
                <div className="version-stat">
                    <label>Commit</label>
                    <span className="val hash">{buildInfo?.commit_hash || '-------'}</span>
                </div>
                <div className="version-stat">
                    <label>Platform</label>
                    <span className="val">{buildInfo?.target_os || 'Unknown'}</span>
                </div>
            </div>

            <div className="changelog-preview">
                <h3>V1.3.0 - ANALYTICS READY</h3>
                <ul>
                    <li><span className="bullet">⚡</span> Sub-1ms Performance Telemetry</li>
                    <li><span className="bullet">🛡️</span> Automated Build Hardening</li>
                    <li><span className="bullet">🔥</span> 3D Keyboard Heatmaps (Beta)</li>
                </ul>
            </div>

            <footer className="hub-footer">
                <span className="verified-badge">✓ VERIFIED BUILD</span>
            </footer>
        </div>
    );
};
