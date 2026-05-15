import React from 'react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    bg?: string;
    iconColor?: string;
    valueColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    icon,
    bg = 'bg-white',
    iconColor = 'text-gray-500',
    valueColor = 'text-gray-900',
}) => (
    <div className={`${bg} rounded-lg p-5 flex items-center gap-4 border border-gray-100 border-l-2 border-l-gray-300`}>
        <div className={`${iconColor} shrink-0`}>{icon}</div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={`text-2xl font-bold ${valueColor} mt-0.5`}>{value}</p>
        </div>
    </div>
);

export default StatsCard;
