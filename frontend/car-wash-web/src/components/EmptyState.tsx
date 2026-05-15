import React from 'react';

interface EmptyStateAction {
    label: string;
    onClick: () => void;
}

interface EmptyStateProps {
    title: string;
    message?: string;
    icon?: React.ReactNode;
    action?: EmptyStateAction;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && <div className="mb-4 text-gray-300 text-5xl">{icon}</div>}
            <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
            {message && <p className="text-sm text-gray-400 mb-5 max-w-xs">{message}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
