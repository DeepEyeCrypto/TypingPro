import React from 'react';
import { useLocation } from 'react-router-dom';

interface AppShellProps {
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

/**
 * AppShell provides the main layout structure:
 * - Full constrained height (100vh)
 * - Flex column structure (Header -> Main Content)
 * - Hidden overflow on the shell itself
 */
export const AppShell: React.FC<AppShellProps> = ({
    header,
    sidebar,
    children,
    className = ''
}) => {
    return (
        <div className={`flex flex-col h-screen w-screen bg-bg-primary text-text-primary overflow-hidden font-sans transition-colors duration-200 overscroll-none ${className}`}>
            {/* Header Slot - Always at top */}
            {header && (
                <div className="flex-shrink-0 z-50 relative">
                    {header}
                </div>
            )}

            {/* Main Layout Area */}
            <div className="flex flex-1 min-h-0 relative">
                {/* Sidebar Slot - Responsive
                    Desktop: Visible, fixed width
                    Mobile/Laptop Small: Hidden (or could be in a drawer if implemented later, but for now we follow requirements: "Large screens -> two-column... Smaller screens -> stacked")
                    Wait, requirements say "Smaller screens -> stacked layout, but keyboard should always fit".
                    Usually "stacked" means sidebar might go away or move.
                    If sidebar is "stats/goals", on small screens they might need to be part of the flow or hidden.
                    For this pass, we keep sidebar hidden on small screens (< lg) as per original code,
                    but ensure the main area is flex-col for the stacking of text + keyboard.
                 */}
                {sidebar && (
                    <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-border bg-bg-secondary h-full overflow-y-auto z-10">
                        {sidebar}
                    </aside>
                )}

                {/* Content Area */}
                <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden bg-bg-surface">
                    {children}
                </main>
            </div>
        </div>
    );
};
