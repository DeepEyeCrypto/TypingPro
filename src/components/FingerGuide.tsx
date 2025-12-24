import React from 'react';
import './FingerGuide.css';

interface FingerGuideProps {
    fingersInvolved: string[];
}

export const FingerGuide: React.FC<FingerGuideProps> = ({ fingersInvolved }) => {
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
    ];

    const fingerMap: { [key: string]: string } = {
        'Q': 'LeftPinky',
        'W': 'LeftRing',
        'E': 'LeftMiddle',
        'R': 'LeftIndex',
        'T': 'LeftIndex',
        'Y': 'RightIndex',
        'U': 'RightIndex',
        'I': 'RightMiddle',
        'O': 'RightRing',
        'P': 'RightPinky',
        'A': 'LeftPinky',
        'S': 'LeftRing',
        'D': 'LeftMiddle',
        'F': 'LeftIndex',
        'G': 'LeftIndex',
        'H': 'RightIndex',
        'J': 'RightIndex',
        'K': 'RightMiddle',
        'L': 'RightRing',
        ';': 'RightPinky',
        'Z': 'LeftPinky',
        'X': 'LeftRing',
        'C': 'LeftMiddle',
        'V': 'LeftIndex',
        'B': 'LeftIndex',
        'N': 'RightIndex',
        'M': 'RightIndex',
        ',': 'RightMiddle',
        '.': 'RightRing',
        '/': 'RightPinky',
    };

    return (
        <div className="finger-guide">
            <h3>Finger Guide</h3>
            <div className="keyboard-diagram">
                {keyboardLayout.map((row, idx) => (
                    <div key={idx} className="keyboard-row">
                        {row.map(key => (
                            <div
                                key={key}
                                className={`key ${fingersInvolved.includes(fingerMap[key]) ? 'active' : 'inactive'
                                    }`}
                            >
                                {key}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FingerGuide;
