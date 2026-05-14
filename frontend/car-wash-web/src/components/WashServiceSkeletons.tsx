import React from 'react';

export const ServiceCardSkeleton: React.FC = () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-full mb-1" />
        <div className="h-4 bg-gray-100 rounded w-5/6 mb-6" />
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="h-7 bg-gray-200 rounded w-16" />
            <div className="h-5 bg-gray-100 rounded w-14" />
        </div>
    </div>
);

export const ServiceTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
                <tr>
                    {['Name', 'Description', 'Price', 'Duration', 'Status', 'Actions'].map(h => (
                        <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {Array.from({ length: rows }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-40" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-14" /></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                        <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded w-14" /></td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <div className="h-7 bg-gray-200 rounded w-12" />
                                <div className="h-7 bg-gray-100 rounded w-20" />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
