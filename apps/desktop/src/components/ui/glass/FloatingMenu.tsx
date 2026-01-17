import React from 'react';
import { GlassSurface } from './GlassSurface';
import { FloatingMenuItem } from './FloatingMenuItem';
import { LayoutGroup } from 'framer-motion';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface FloatingMenuProps {
    items: MenuItem[];
    activeId: string;
    onSelect: (id: string) => void;
    className?: string;
    title?: string;
    bgColor?: string; // Optional background color
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
    items,
    activeId,
    onSelect,
    className = '',
    title,
    bgColor
}) => {
    return (
        <GlassSurface
            className={`w-[350px] p-6 flex flex-col gap-6 ${className}`}
            elevation="high"
        >
            {title && (
                <div className="px-4 pb-2 border-b border-white/5">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                        {title}
                    </h3>
                </div>
            )}

            <LayoutGroup>
                <div className="flex flex-col gap-2">
                    {items.map((item) => (
                        <FloatingMenuItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeId === item.id}
                            onClick={onSelect}
                            bgColor={bgColor}
                        />
                    ))}
                </div>
            </LayoutGroup>
        </GlassSurface>
    );
};
