import React from 'react';
import { Link } from 'react-router-dom';
import BookingStatusBadge from './BookingStatusBadge';
import type { BookingResponse } from '../types/booking';

interface RecentBookingsProps {
    bookings: BookingResponse[];
    linkPrefix?: string;
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings, linkPrefix = '/bookings' }) => {
    if (bookings.length === 0) {
        return <p className="text-gray-500 text-sm italic">No recent bookings.</p>;
    }

    return (
        <ul className="divide-y divide-gray-100">
            {bookings.map(b => (
                <li key={b.id} className="py-3 flex items-center justify-between text-sm">
                    <div className="space-y-0.5">
                        <p className="font-medium text-gray-800">{b.washServiceName}</p>
                        <p className="text-gray-500">
                            {b.vehicleLicensePlate} &middot;{' '}
                            {new Date(b.appointmentDateTime).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <BookingStatusBadge status={b.status} />
                        <Link
                            to={`${linkPrefix}/${b.id}`}
                            className="text-blue-600 hover:underline text-xs font-medium"
                        >
                            View →
                        </Link>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default RecentBookings;
