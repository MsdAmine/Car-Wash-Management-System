import React from 'react';

interface PageHeaderAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: PageHeaderAction;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
            {action && (
                <button
                    onClick={action.onClick}
                    className={
                        action.variant === 'secondary'
                            ? 'rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
                            : 'rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800'
                    }
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default PageHeader;
