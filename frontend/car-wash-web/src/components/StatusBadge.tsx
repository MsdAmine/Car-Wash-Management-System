import React from 'react';

type BadgeVariant = 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';

interface StatusBadgeProps {
    label: string;
    variant?: BadgeVariant;
}

const variantClass: Record<BadgeVariant, string> = {
    gray:   'bg-gray-100 text-gray-500',
    blue:   'bg-blue-100 text-blue-800',
    green:  'bg-green-100 text-green-800',
    red:    'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant = 'gray' }) => {
    return (
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${variantClass[variant]}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
