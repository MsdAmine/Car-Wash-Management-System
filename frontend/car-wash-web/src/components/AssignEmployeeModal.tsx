import React, { useEffect, useState } from 'react';
import employeeService from '../services/employeeService';
import type { BookingAssignmentResponse, EmployeeResponse } from '../types/employee';

interface AssignEmployeeModalProps {
    bookingId: string;
    onClose: () => void;
}

const AssignEmployeeModal: React.FC<AssignEmployeeModalProps> = ({ bookingId, onClose }) => {
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [assignments, setAssignments] = useState<BookingAssignmentResponse[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoadingEmployees(true);
        setLoadingAssignments(true);
        try {
            const [emps, assigns] = await Promise.all([
                employeeService.list(),
                employeeService.getBookingAssignments(bookingId),
            ]);
            setEmployees(emps.filter(e => e.active));
            setAssignments(assigns);
        } catch {
            setError('Failed to load data. Please try again.');
        } finally {
            setLoadingEmployees(false);
            setLoadingAssignments(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [bookingId]);

    const assignedEmployeeIds = new Set(assignments.map(a => a.employeeId));
    const availableEmployees = employees.filter(e => !assignedEmployeeIds.has(e.id));

    const handleAssign = async () => {
        if (!selectedEmployeeId) return;
        setAssigning(true);
        setError(null);
        try {
            const newAssignment = await employeeService.assignToBooking(bookingId, { employeeId: selectedEmployeeId });
            setAssignments(prev => [...prev, newAssignment]);
            setSelectedEmployeeId('');
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 409) {
                setError('This employee is already assigned to this booking.');
            } else if (status === 400) {
                setError(err.response?.data?.message || 'Cannot assign this employee to the booking.');
            } else if (status === 404) {
                setError('Employee or booking not found.');
            } else {
                setError('Failed to assign employee. Please try again.');
            }
        } finally {
            setAssigning(false);
        }
    };

    const handleRemove = async (employeeId: string) => {
        setRemovingId(employeeId);
        setError(null);
        try {
            await employeeService.removeFromBooking(bookingId, employeeId);
            setAssignments(prev => prev.filter(a => a.employeeId !== employeeId));
        } catch {
            setError('Failed to remove assignment. Please try again.');
        } finally {
            setRemovingId(null);
        }
    };

    const isLoading = loadingEmployees || loadingAssignments;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Assign Employees</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Current assignments */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned Employees</h3>
                        {isLoading ? (
                            <div className="h-8 bg-gray-100 rounded animate-pulse" />
                        ) : assignments.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No employees assigned yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {assignments.map(a => (
                                    <li key={a.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                                        <div>
                                            <span className="text-sm font-medium text-gray-800">
                                                {a.employeeFirstName} {a.employeeLastName}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">{a.employeePosition}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(a.employeeId)}
                                            disabled={removingId === a.employeeId}
                                            className="text-red-600 hover:underline text-xs disabled:opacity-50"
                                        >
                                            {removingId === a.employeeId ? 'Removing...' : 'Remove'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Assign new employee */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Add Employee</h3>
                        {isLoading ? (
                            <div className="h-9 bg-gray-100 rounded animate-pulse" />
                        ) : availableEmployees.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">All active employees are already assigned.</p>
                        ) : (
                            <div className="flex gap-2">
                                <select
                                    value={selectedEmployeeId}
                                    onChange={e => setSelectedEmployeeId(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select employee...</option>
                                    {availableEmployees.map(e => (
                                        <option key={e.id} value={e.id}>
                                            {e.firstName} {e.lastName} ({e.position})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAssign}
                                    disabled={!selectedEmployeeId || assigning}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {assigning ? 'Assigning...' : 'Assign'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignEmployeeModal;
