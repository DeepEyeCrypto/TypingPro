import React, { ReactNode } from 'react';
import { useContrastText } from '../hooks/useContrastText';

interface ContrastTextProps {
    bgColor: string;
    children: ReactNode;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

/**
 * ContrastText Component
 * Automatically sets the text color based on the provided background color.
 */
export const ContrastText: React.FC<ContrastTextProps> = ({
    bgColor,
    children,
    className = '',
    as: Component = 'span'
}) => {
    const { textColor } = useContrastText(bgColor);

    return (
        <Component
            style={{ color: textColor }}
            className={`transition-colors duration-300 ${className}`}
        >
            {children}
        </Component>
    );
};

export default ContrastText;
