import React, { useEffect } from 'react';
import { useDevStore } from '../../../core/store/devStore';
import './DevHud.css';

export const DevHud: React.FC = () => {
    const { isHudVisible, engineState, refreshEngineState, forceCheat } = useDevStore();

    useEffect(() => {
        if (!isHudVisible) return;

        const interval = setInterval(() => {
            refreshEngineState();
        }, 100); // 10Hz refresh

        return () => clearInterval(interval);
    }, [isHudVisible, refreshEngineState]);

    if (!isHudVisible) return null;

    return (
        <div className="dev-hud-overlay no-drag">
            <div className="dev-hud-header">
                <span className="hud-title">TACTICAL_DEBUG_V1</span>
                <span className="hud-version">TYPINGPRO_CORE</span>
            </div>

            {engineState ? (
                <div className="hud-grid">
                    <div className="hud-track">
                        <span className="track-label">[ENG] ENGINE_METRICS</span>
                        <div className="track-data">
                            <span>WPM: <span className="value">{engineState.metrics.net_wpm.toFixed(1)}</span></span>
                            <span>ACC: <span className="value">{engineState.metrics.accuracy.toFixed(1)}%</span></span>
                            <span>CONS: <span className="value">{engineState.metrics.consistency.toFixed(1)}%</span></span>
                        </div>
                    </div>

                    <div className="hud-track">
                        <span className="track-label">[TEL] TELEMETRY_PHYSICS</span>
                        <div className="track-data">
                            <span>LATENCY: <span className="value">{engineState.last_latency.toFixed(2)}ms</span></span>
                            <span>AVG: <span className="value">{engineState.avg_latency.toFixed(2)}ms</span></span>
                            <span>SDEV: <span className="value">{engineState.std_dev.toFixed(2)}</span></span>
                            <span>BUF: <span className="value">{engineState.telemetry_buffer_size}</span></span>
                        </div>
                    </div>

                    <div className="hud-track">
                        <span className="track-label">[SEC] SECURITY_LAYER</span>
                        <div className="track-data">
                            <span>IS_BOT: <span className={`value ${engineState.metrics.is_bot ? 'alert' : 'safe'}`}>
                                {engineState.metrics.is_bot ? 'TRUE' : 'FALSE'}
                            </span></span>
                            <span>FLAGS: <span className="value hex">{engineState.metrics.cheat_flags || 'NONE'}</span></span>
                            <button
                                className="hud-action-btn"
                                onClick={() => forceCheat(!engineState.metrics.is_bot)}
                            >
                                TOGGLE_CHEAT_SIGNAL
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hud-loading">CONNECTING_TO_ENGINE...</div>
            )}
        </div>
    );
};
