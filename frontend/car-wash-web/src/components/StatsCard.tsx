import React from 'react';

interface StatsCardProps {
    label: string;
    value: string | number;
    colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, colorClass = 'text-blue-600' }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-1">
        <span className="text-sm text-gray-500">{label}</span>
        <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
    </div>
);

export default StatsCard;
