import React from 'react';

interface MonoTextProps {
    children: React.ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
    variant?: 'primary' | 'secondary' | 'muted';
    className?: string;
}

/**
 * MonoText: A typography wrapper that enforces strict monochrome hover behavior.
 * Logic: Light Mode = Dark Grey -> Black | Dark Mode = Light Grey -> White
 */
export const MonoText: React.FC<MonoTextProps> = ({
    children,
    as: Component = 'p',
    variant = 'primary',
    className = ""
}) => {

    const variants = {
        primary: "text-gray-900 hover:text-black dark:text-gray-200 dark:hover:text-white font-bold",
        secondary: "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white font-medium",
        muted: "text-gray-400 hover:text-gray-900 dark:text-gray-600 dark:hover:text-gray-300",
    };

    return (
        <Component
            className={`
                transition-colors duration-300 ease-in-out cursor-default
                ${variants[variant]}
                ${className}
            `}
        >
            {children}
        </Component>
    );
};
