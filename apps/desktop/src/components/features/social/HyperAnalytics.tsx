import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './HyperAnalytics.css';

interface AnalyticsSummary {
    average_latency: number;
    accuracy: number;
    heatmap: Record<string, number>;
}

export const HyperAnalytics: React.FC = () => {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await invoke<AnalyticsSummary>('get_analytics_summary');
                setSummary(data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 3000); // Live updates every 3s
        return () => clearInterval(interval);
    }, []);

    const getKeyColor = (latency: number) => {
        if (!latency) return 'rgba(255, 255, 255, 0.05)';
        // Scale: 0ms (cyan) -> 500ms+ (purple/red)
        const hue = Math.max(180 - (latency / 3), 0);
        return `hsla(${hue}, 100%, 50%, 0.6)`;
    };

    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    return (
        <div className="hyper-analytics glass-panel">
            <div className="analytics-header">
                <h2>Hyper-Analytics</h2>
                <div className="summary-pills">
                    <div className="pill">
                        <label>AVG LATENCY</label>
                        <span>{Math.round(summary?.average_latency || 0)}ms</span>
                    </div>
                    <div className="pill">
                        <label>ACCURACY</label>
                        <span>{Math.round(summary?.accuracy || 0)}%</span>
                    </div>
                </div>
            </div>

            <div className="heatmap-container">
                <label className="section-label">3D KEYBOARD HEATMAP</label>
                <div className="keyboard-visualizer">
                    {keys.map((row, i) => (
                        <div key={i} className="key-row">
                            {row.map(key => {
                                const latency = summary?.heatmap[key.toLowerCase()] || 0;
                                return (
                                    <div
                                        key={key}
                                        className="key-cap"
                                        style={{ backgroundColor: getKeyColor(latency) }}
                                    >
                                        <span className="key-char">{key}</span>
                                        {latency > 0 && <span className="key-val">{Math.round(latency)}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="fatigue-engine">
                <div className="fatigue-header">
                    <label>FATIGUE DETECTION</label>
                    <span className="engine-status">ACTIVE</span>
                </div>
                <div className="fatigue-gauge">
                    <div className="gauge-track">
                        <div
                            className="gauge-fill"
                            style={{ width: `${Math.min((summary?.average_latency || 0) / 10, 100)}%` }}
                        ></div>
                    </div>
                    <div className="gauge-labels">
                        <span>STABLE</span>
                        <span>FATIGUED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
