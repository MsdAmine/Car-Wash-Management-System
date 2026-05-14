import React from 'react';
import type { WashServiceResponse } from '../types/washService';

interface WashServiceTableProps {
    services: WashServiceResponse[];
    onEdit: (id: string) => void;
    onDeactivate?: (id: string) => void;
    onDelete?: (id: string) => void;
    deactivatingId?: string | null;
    deletingId?: string | null;
    canManage?: boolean;
}

const WashServiceTable: React.FC<WashServiceTableProps> = ({
    services,
    onEdit,
    onDeactivate,
    onDelete,
    deactivatingId,
    deletingId,
    canManage = false,
}) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        {canManage && (
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {services.map(service => (
                        <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{service.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                {service.description || <span className="text-gray-400 italic">No description</span>}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                ${Number(service.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                {service.durationMinutes} min
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    service.active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {service.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            {canManage && (
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(service.id)}
                                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                        >
                                            Edit
                                        </button>
                                        {service.active && onDeactivate && (
                                            <button
                                                onClick={() => onDeactivate(service.id)}
                                                disabled={deactivatingId === service.id}
                                                className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition disabled:opacity-50"
                                            >
                                                {deactivatingId === service.id ? 'Deactivating...' : 'Deactivate'}
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(service.id)}
                                                disabled={deletingId === service.id}
                                                className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50"
                                            >
                                                {deletingId === service.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WashServiceTable;
