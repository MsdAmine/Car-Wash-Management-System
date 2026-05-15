import React from 'react';
import type { PaymentStatus } from '../types/booking';

type BadgeConfig = {
    label: string;
    className: string;
};

const paymentStatusConfig: Record<PaymentStatus, BadgeConfig> = {
    PENDING: { label: 'Pending', className: 'bg-gray-100 text-gray-700 ring-gray-200' },
    CONFIRMED: { label: 'Confirmed', className: 'bg-gray-900 text-white ring-gray-900' },
    FAILED: { label: 'Failed', className: 'bg-red-50 text-red-700 ring-red-200' },
    REFUNDED: { label: 'Refunded', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
};

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
    const config = paymentStatusConfig[status];
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}>
            {config.label}
        </span>
    );
};

export default PaymentStatusBadge;
