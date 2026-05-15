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
    iconColor = 'text-blue-600',
    valueColor = 'text-gray-800',
}) => (
    <div className={`${bg} rounded-2xl p-5 flex items-center gap-4 border border-gray-200 shadow-sm`}>
        <div className={`${iconColor} shrink-0`}>{icon}</div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className={`text-2xl font-bold ${valueColor} mt-0.5`}>{value}</p>
        </div>
    </div>
);

export default StatsCard;
