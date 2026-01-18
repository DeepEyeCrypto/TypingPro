// ═══════════════════════════════════════════════════════════════════
// TOAST CONTAINER: Renders all active toasts from the global store
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { useToastStore } from '../../core/store/toastStore';
import { GlassToast } from './GlassToast';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto"
                    style={{
                        transform: `translateY(-${index * 8}px)`,
                        zIndex: 9999 - index
                    }}
                >
                    <GlassToast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onDismiss={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
