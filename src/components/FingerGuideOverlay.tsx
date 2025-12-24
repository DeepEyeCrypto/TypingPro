import React from 'react';
import './FingerGuideOverlay.css';

interface FingerGuideOverlayProps {
    fingersInvolved: string[];
}

export const FingerGuideOverlay: React.FC<FingerGuideOverlayProps> = ({
    fingersInvolved,
}) => {
    const isPulsing = (finger: string) => fingersInvolved.includes(finger);

    return (
        <div className="finger-guide-overlay">
            <div className="hand left-hand">
                <div className={`finger pinky ${isPulsing('LeftPinky') ? 'pulse' : ''}`}>P</div>
                <div className={`finger ring ${isPulsing('LeftRing') ? 'pulse' : ''}`}>R</div>
                <div className={`finger middle ${isPulsing('LeftMiddle') ? 'pulse' : ''}`}>M</div>
                <div className={`finger index ${isPulsing('LeftIndex') ? 'pulse' : ''}`}>I</div>
            </div>

            <div className="center-text">
                <p className="instruction">Focus on the screen</p>
                <p className="sub-instruction">Maintain correct finger positioning</p>
            </div>

            <div className="hand right-hand">
                <div className={`finger index ${isPulsing('RightIndex') ? 'pulse' : ''}`}>I</div>
                <div className={`finger middle ${isPulsing('RightMiddle') ? 'pulse' : ''}`}>M</div>
                <div className={`finger ring ${isPulsing('RightRing') ? 'pulse' : ''}`}>R</div>
                <div className={`finger pinky ${isPulsing('RightPinky') ? 'pulse' : ''}`}>P</div>
            </div>
        </div>
    );
};

export default FingerGuideOverlay;
