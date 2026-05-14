import React, { useEffect } from 'react';

interface ModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg';
}

const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

const Modal: React.FC<ModalProps> = ({ open, title, onClose, children, maxWidth = 'md' }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidthClass[maxWidth]} mx-4`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
