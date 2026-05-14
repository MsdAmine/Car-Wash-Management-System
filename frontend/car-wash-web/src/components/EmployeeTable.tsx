import React from 'react';
import { Link } from 'react-router-dom';
import type { EmployeeResponse } from '../types/employee';

interface EmployeeTableProps {
    employees: EmployeeResponse[];
    onDeactivate: (id: string, name: string) => void;
    deactivatingId: string | null;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onDeactivate, deactivatingId }) => {
    if (employees.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                <p className="text-lg">No employees found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Position</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Hire Date</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-800 font-medium">
                                {emp.firstName} {emp.lastName}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{emp.email}</td>
                            <td className="px-4 py-3 text-gray-600">{emp.position}</td>
                            <td className="px-4 py-3 text-gray-600">
                                {new Date(emp.hireDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    emp.active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {emp.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/admin/employees/${emp.id}/edit`}
                                        className="text-blue-600 hover:underline text-xs font-medium"
                                    >
                                        Edit
                                    </Link>
                                    {emp.active && (
                                        <button
                                            onClick={() => onDeactivate(emp.id, `${emp.firstName} ${emp.lastName}`)}
                                            disabled={deactivatingId === emp.id}
                                            className="text-red-600 hover:underline text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deactivatingId === emp.id ? 'Deactivating...' : 'Deactivate'}
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

export default EmployeeTable;
