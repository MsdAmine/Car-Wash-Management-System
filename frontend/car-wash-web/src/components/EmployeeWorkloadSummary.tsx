import React from 'react';

interface EmployeeWorkloadSummaryProps {
    assignedBookings: number;
    bookingsInProgress: number;
}

const EmployeeWorkloadSummary: React.FC<EmployeeWorkloadSummaryProps> = ({
    assignedBookings,
    bookingsInProgress,
}) => (
    <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Total Assigned</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{assignedBookings}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide">In Progress</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">{bookingsInProgress}</p>
        </div>
    </div>
);

export default EmployeeWorkloadSummary;
