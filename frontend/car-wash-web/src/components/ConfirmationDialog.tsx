import React from 'react';

type ConfirmationVariant = 'danger' | 'warning' | 'info';

interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmationVariant;
    onConfirm: () => void;
    onCancel: () => void;
}

const confirmButtonClass: Record<ConfirmationVariant, string> = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-message"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
                <h2 id="confirmation-dialog-title" className="text-lg font-semibold text-gray-800 mb-2">
                    {title}
                </h2>
                <p id="confirmation-dialog-message" className="text-sm text-gray-600 mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm rounded-md transition font-medium ${confirmButtonClass[variant]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
