import React from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg'
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg'
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={`glass-unified p-8 rounded-2xl w-full ${sizeClasses[size]}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    {title && <h2 className="text-2xl font-bold">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="opacity-50 hover:opacity-100 transition-opacity text-2xl"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div>{children}</div>
            </div>
        </div>
    )
}
