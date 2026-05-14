import React from 'react';

export const BookingCardSkeleton: React.FC = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-56 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-44" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-16 ml-4" />
        </div>
        <div className="flex gap-3 mt-4">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-100 rounded w-12" />
        </div>
    </div>
);

export const BookingTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                    {['Customer', 'Vehicle', 'Service', 'Appointment', 'Total', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 animate-pulse">
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-28" /></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-36" /></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-14" /></td>
                        <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded w-16" /></td>
                        <td className="px-4 py-3"><div className="h-7 bg-gray-100 rounded w-24" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const BookingEmployeeSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse"
            >
                <div className="flex items-start gap-4 flex-1">
                    <div className="text-center min-w-[56px]">
                        <div className="h-6 bg-gray-200 rounded w-12 mb-1" />
                        <div className="h-3 bg-gray-100 rounded w-10" />
                    </div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-36 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-52" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                    <div className="h-7 bg-gray-100 rounded w-24" />
                </div>
            </div>
        ))}
    </div>
);
