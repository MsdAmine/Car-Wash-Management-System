import React from 'react';

export const PaymentTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                    {['Customer', 'Booking', 'Amount', 'Method', 'Status', 'Paid At', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 animate-pulse">
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                        <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded w-16" /></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                        <td className="px-4 py-3"><div className="h-7 bg-gray-100 rounded w-20" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const PaymentCardSkeleton: React.FC = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="h-3 bg-gray-100 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-24" />
            <div className="h-3 bg-gray-100 rounded w-28" />
            <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
    </div>
);

export const PaymentDetailsSkeleton: React.FC = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
        <div className="grid grid-cols-2 gap-3">
            <div className="h-3 bg-gray-100 rounded w-24" />
            <div className="h-3 bg-gray-100 rounded w-20" />
            <div className="h-3 bg-gray-100 rounded w-28" />
            <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
    </div>
);
