import React from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { MonoText } from '../../ui/MonoText';

/**
 * ComponentShowcase: A developer playground to verify high-fidelity components.
 * Demonstrates the orchestration of GlassCard and MonoText.
 */
export const ComponentShowcase: React.FC = () => {
    return (
        <div className="p-20 space-y-12 bg-midnight min-h-screen">
            <section className="space-y-4">
                <MonoText as="h1" variant="primary" className="text-4xl">Architecture_Verification</MonoText>
                <MonoText as="p" variant="secondary">Prototyping the high-end glassmorphism system.</MonoText>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* User Requested Job Preview */}
                <div className="space-y-4">
                    <MonoText as="h3" variant="muted" className="text-[10px] uppercase tracking-[0.4em]">Snippet_Demo</MonoText>
                    <GlassCard intensity="high" className="p-8 w-full max-w-md">
                        <MonoText as="h2" variant="primary" className="text-2xl mb-2">
                            UI/UX Designer
                        </MonoText>
                        <MonoText as="p" variant="secondary">
                            Google • Mountain View
                        </MonoText>
                    </GlassCard>
                </div>

                {/* Intensity Comparison */}
                <div className="space-y-4">
                    <MonoText as="h3" variant="muted" className="text-[10px] uppercase tracking-[0.4em]">Intensity_Scale</MonoText>
                    <div className="flex gap-6">
                        <GlassCard intensity="low" className="p-6 flex-1">
                            <MonoText variant="secondary" className="text-xs">Sidebar_Intensity (Low)</MonoText>
                        </GlassCard>
                        <GlassCard intensity="high" className="p-6 flex-1">
                            <MonoText variant="primary" className="text-xs">Action_Intensity (High)</MonoText>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};
