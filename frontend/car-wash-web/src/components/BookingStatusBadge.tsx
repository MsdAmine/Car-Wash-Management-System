import React from 'react';
import type { BookingStatus } from '../types/booking';

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
    PENDING:   { label: 'Pending',   className: 'bg-gray-100 text-gray-700' },
    CONFIRMED: { label: 'Confirmed', className: 'bg-gray-900 text-white' },
    COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

interface BookingStatusBadgeProps {
    status: BookingStatus;
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
    const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
};

export default BookingStatusBadge;
