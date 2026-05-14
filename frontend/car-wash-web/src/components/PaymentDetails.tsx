import React, { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';
import type { PaymentResponse } from '../types/payment';
import PaymentStatusBadge from './PaymentStatusBadge';
import { PaymentDetailsSkeleton } from './PaymentSkeletons';

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const METHOD_LABELS: Record<string, string> = {
    CASH: 'Cash',
    CARD: 'Card',
    BANK_TRANSFER: 'Bank Transfer',
    MOBILE_PAYMENT: 'Mobile Payment',
};

interface PaymentDetailsProps {
    bookingId: string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ bookingId }) => {
    const [payment, setPayment] = useState<PaymentResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        paymentService.getByBookingId(bookingId)
            .then(setPayment)
            .catch((err: any) => {
                const status = err.response?.status;
                if (status === 404) {
                    setError(null);
                    setPayment(null);
                } else {
                    setError('Failed to load payment information.');
                }
            })
            .finally(() => setLoading(false));
    }, [bookingId]);

    if (loading) return <PaymentDetailsSkeleton />;

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
            </div>
        );
    }

    if (!payment) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Payment</p>
                <p className="text-sm text-gray-400 italic">No payment recorded for this booking.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-700">Payment</p>
                <PaymentStatusBadge status={payment.status} />
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                    <dt className="text-gray-500">Amount</dt>
                    <dd className="font-medium text-gray-800">${Number(payment.amount).toFixed(2)}</dd>
                </div>
                <div>
                    <dt className="text-gray-500">Method</dt>
                    <dd className="font-medium text-gray-800">{METHOD_LABELS[payment.method] ?? payment.method}</dd>
                </div>
                {payment.paidAt && (
                    <div className="col-span-2">
                        <dt className="text-gray-500">Paid At</dt>
                        <dd className="font-medium text-gray-800">{formatDateTime(payment.paidAt)}</dd>
                    </div>
                )}
                {payment.notes && (
                    <div className="col-span-2">
                        <dt className="text-gray-500">Notes</dt>
                        <dd className="text-gray-800">{payment.notes}</dd>
                    </div>
                )}
            </dl>
        </div>
    );
};

export default PaymentDetails;
