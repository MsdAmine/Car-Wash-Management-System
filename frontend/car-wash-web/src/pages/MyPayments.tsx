import React, { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';
import type { PaymentResponse } from '../types/payment';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import { PaymentCardSkeleton } from '../components/PaymentSkeletons';

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const METHOD_LABELS: Record<string, string> = {
    CASH: 'Cash',
    CARD: 'Card',
    BANK_TRANSFER: 'Bank Transfer',
    MOBILE_PAYMENT: 'Mobile Payment',
};

const MyPayments: React.FC = () => {
    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await paymentService.getMyPayments();
            setPayments(data);
        } catch {
            setError('Failed to load payment history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Payment History</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchPayments} className="ml-4 text-sm font-medium underline hover:no-underline">
                        Retry
                    </button>
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <PaymentCardSkeleton key={i} />)}
                </div>
            ) : payments.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">No payment records found.</p>
                    <p className="text-sm mt-1">Payments will appear here once recorded by staff.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {payments.map(payment => (
                        <div
                            key={payment.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        ${Number(payment.amount).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {METHOD_LABELS[payment.method] ?? payment.method}
                                    </p>
                                </div>
                                <PaymentStatusBadge status={payment.status} />
                            </div>
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                                <div>
                                    <dt className="text-gray-400">Recorded</dt>
                                    <dd>{formatDateTime(payment.createdAt)}</dd>
                                </div>
                                {payment.paidAt && (
                                    <div>
                                        <dt className="text-gray-400">Confirmed At</dt>
                                        <dd>{formatDateTime(payment.paidAt)}</dd>
                                    </div>
                                )}
                            </dl>
                            {payment.notes && (
                                <p className="text-sm text-gray-500 mt-2 italic">{payment.notes}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPayments;
