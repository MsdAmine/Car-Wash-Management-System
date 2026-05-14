import React from 'react';

interface RevenueSummaryProps {
    dailyRevenue: number;
    monthlyRevenue: number;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);

const RevenueSummary: React.FC<RevenueSummaryProps> = ({ dailyRevenue, monthlyRevenue }) => (
    <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Today's Revenue</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(dailyRevenue)}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Monthly Revenue</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(monthlyRevenue)}</p>
        </div>
    </div>
);

export default RevenueSummary;
