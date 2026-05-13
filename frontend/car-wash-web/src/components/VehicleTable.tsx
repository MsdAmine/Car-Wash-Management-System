import React from 'react';
import type { VehicleResponse } from '../types/vehicle';

interface VehicleTableProps {
    vehicles: VehicleResponse[];
    onEdit: (id: string) => void;
    onDelete?: (id: string) => void;
    deletingId?: string | null;
    canDelete?: boolean;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onEdit, onDelete, deletingId, canDelete = false }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">License Plate</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {vehicles.map(v => (
                        <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{v.brand}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{v.model}</td>
                            <td className="px-6 py-4 text-sm font-mono text-gray-700">{v.licensePlate}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                    {v.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(v.id)}
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                    >
                                        Edit
                                    </button>
                                    {canDelete && onDelete && (
                                        <button
                                            onClick={() => onDelete(v.id)}
                                            disabled={deletingId === v.id}
                                            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50"
                                        >
                                            {deletingId === v.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleTable;
