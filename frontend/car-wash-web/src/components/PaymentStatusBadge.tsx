import React from 'react';
import type { PaymentStatus } from '../types/payment';

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
    PENDING:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
    FAILED:    { label: 'Failed',    className: 'bg-red-100 text-red-800' },
    REFUNDED:  { label: 'Refunded',  className: 'bg-gray-100 text-gray-600' },
};

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
    const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' };
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
};

export default PaymentStatusBadge;
