import React from 'react';
import type { BookingStatus } from '../types/booking';

type BadgeConfig = {
    label: string;
    className: string;
};

const bookingStatusConfig: Record<BookingStatus, BadgeConfig> = {
    PENDING: { label: 'Pending', className: 'bg-gray-100 text-gray-700 ring-gray-200' },
    CONFIRMED: { label: 'Confirmed', className: 'bg-gray-900 text-white ring-gray-900' },
    IN_PROGRESS: { label: 'In progress', className: 'bg-neutral-200 text-neutral-900 ring-neutral-300' },
    COMPLETED: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-700 ring-red-200' },
    NO_SHOW: { label: 'No show', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
};

interface BookingStatusBadgeProps {
    status: BookingStatus;
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
    const config = bookingStatusConfig[status];
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}>
            {config.label}
        </span>
    );
};

export default BookingStatusBadge;
