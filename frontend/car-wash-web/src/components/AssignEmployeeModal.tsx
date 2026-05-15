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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40">
            <div className="mx-4 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-950">Assign Employees</h2>
                    <button
                        onClick={onClose}
                        className="text-xl leading-none text-gray-400 hover:text-gray-700"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned Employees</h3>
                        {isLoading ? (
                            <div className="h-8 bg-gray-100 rounded animate-pulse" />
                        ) : assignments.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No employees assigned yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {assignments.map(a => (
                                    <li key={a.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {a.employeeFirstName} {a.employeeLastName}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">{a.employeePosition}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(a.employeeId)}
                                            disabled={removingId === a.employeeId}
                                            className="text-xs font-medium text-red-700 underline-offset-4 hover:underline disabled:opacity-50"
                                        >
                                            {removingId === a.employeeId ? 'Removing...' : 'Remove'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

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
                                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
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
                                    className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {assigning ? 'Assigning...' : 'Assign'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignEmployeeModal;
