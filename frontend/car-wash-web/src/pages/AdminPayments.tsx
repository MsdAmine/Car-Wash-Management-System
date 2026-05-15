import React, { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';
import { PAYMENT_STATUSES, type PaymentStatus } from '../types/booking';
import type { PaymentMethod, PaymentResponse } from '../types/payment';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { getApiErrorMessage } from '../lib/apiError';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    CASH: 'Cash',
    CARD: 'Card',
    BANK_TRANSFER: 'Bank transfer',
    MOBILE_PAYMENT: 'Mobile payment',
};

const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [...PAYMENT_STATUSES];

const formatDateTime = (value: string | null) => {
    if (!value) return 'Not recorded';
    return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const formatCurrency = (amount: number | string) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(amount));

const AdminPayments: React.FC = () => {
    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'ALL'>('ALL');
    const [pendingStatus, setPendingStatus] = useState<{ id: string; status: PaymentStatus; customerEmail: string } | null>(null);

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await paymentService.getAll();
            setPayments([...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (err) {
            setError(getApiErrorMessage(err, {}, 'Failed to load payments. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void Promise.resolve().then(fetchPayments);
    }, []);

    const applyStatusChange = async (id: string, status: PaymentStatus) => {
        setUpdatingId(id);
        setActionError(null);
        try {
            const updated = await paymentService.updateStatus(id, { status });
            setPayments(prev => prev.map(payment => payment.id === id ? updated : payment));
        } catch (err) {
            setActionError(getApiErrorMessage(err, {
                400: 'Invalid payment status.',
                404: 'Payment not found.',
            }, 'Failed to update payment status. Please try again.'));
        } finally {
            setUpdatingId(null);
        }
    };

    const handleStatusSelect = (payment: PaymentResponse, status: PaymentStatus) => {
        if (status === payment.status) return;
        if (status === 'CONFIRMED' || status === 'REFUNDED') {
            setPendingStatus({ id: payment.id, status, customerEmail: payment.customerEmail });
            return;
        }
        applyStatusChange(payment.id, status);
    };

    const handleConfirmStatusChange = async () => {
        if (!pendingStatus) return;
        const { id, status } = pendingStatus;
        setPendingStatus(null);
        await applyStatusChange(id, status);
    };

    const displayed = filterStatus === 'ALL'
        ? payments
        : payments.filter(payment => payment.status === filterStatus);

    const statusCounts = PAYMENT_STATUS_OPTIONS.reduce((acc, status) => {
        acc[status] = payments.filter(payment => payment.status === status).length;
        return acc;
    }, {} as Record<PaymentStatus, number>);

    const totalAmount = displayed.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const confirmedAmount = payments
        .filter(payment => payment.status === 'CONFIRMED')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-950">Payments</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Track manual payment records and update payment status.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Confirmed</p>
                        <p className="text-sm font-semibold text-gray-950">{formatCurrency(confirmedAmount)}</p>
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        Status
                        <select
                            value={filterStatus}
                            onChange={event => setFilterStatus(event.target.value as PaymentStatus | 'ALL')}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        >
                            <option value="ALL">All ({payments.length})</option>
                            {PAYMENT_STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status} ({statusCounts[status]})</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            {error && (
                <div role="alert" className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <span className="text-sm">{error}</span>
                    <button onClick={fetchPayments} className="text-sm font-medium text-red-700 underline underline-offset-4 hover:text-red-900">
                        Retry
                    </button>
                </div>
            )}

            {actionError && (
                <div role="alert" aria-live="polite" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {actionError}
                </div>
            )}

            {loading ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Loading payments" aria-busy="true">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="border-b border-gray-100 p-5 last:border-b-0">
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                            <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                        </div>
                    ))}
                </div>
            ) : displayed.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
                    <p className="font-medium text-gray-600">No payments found</p>
                    <p className="mt-1 text-sm text-gray-400">
                        {filterStatus === 'ALL' ? 'Payment records will appear here once they are created.' : 'No payments match this status.'}
                    </p>
                    {filterStatus !== 'ALL' && (
                        <button
                            onClick={() => setFilterStatus('ALL')}
                            className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Show all payments
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-sm text-gray-600">
                        Showing {displayed.length} payment{displayed.length !== 1 ? 's' : ''} totaling{' '}
                        <span className="font-semibold text-gray-950">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" aria-label="Payments list">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Customer</th>
                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Booking</th>
                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Method</th>
                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Amount</th>
                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Paid At</th>
                                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
                                    <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Update</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {displayed.map(payment => (
                                    <tr key={payment.id} className="transition hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-900">{payment.customerEmail}</p>
                                            {payment.notes && <p className="mt-1 max-w-xs truncate text-xs text-gray-500">{payment.notes}</p>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                                                {payment.bookingId.slice(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{PAYMENT_METHOD_LABELS[payment.method]}</td>
                                        <td className="px-5 py-4 font-semibold text-gray-950">{formatCurrency(payment.amount)}</td>
                                        <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">{formatDateTime(payment.paidAt)}</td>
                                        <td className="px-5 py-4">
                                            <PaymentStatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <select
                                                value={payment.status}
                                                disabled={updatingId === payment.id}
                                                onChange={event => handleStatusSelect(payment, event.target.value as PaymentStatus)}
                                                aria-label={`Update payment status for ${payment.customerEmail}`}
                                                className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {PAYMENT_STATUS_OPTIONS.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmationDialog
                open={pendingStatus !== null}
                title="Update Payment Status"
                message={`Mark this payment for ${pendingStatus?.customerEmail ?? 'the customer'} as ${pendingStatus?.status ?? 'updated'}?`}
                confirmLabel="Update Status"
                cancelLabel="Cancel"
                variant="info"
                onConfirm={handleConfirmStatusChange}
                onCancel={() => setPendingStatus(null)}
            />
        </div>
    );
};

export default AdminPayments;
