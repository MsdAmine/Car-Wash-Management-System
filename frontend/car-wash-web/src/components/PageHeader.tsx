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
                            ? 'px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium'
                            : 'px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium'
                    }
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default PageHeader;
