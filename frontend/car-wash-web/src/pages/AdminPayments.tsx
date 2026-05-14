import React, { useEffect, useState } from 'react';
import paymentService from '../services/paymentService';
import type { PaymentResponse, PaymentStatus, UpdatePaymentStatusRequest } from '../types/payment';
import PaymentStatusBadge from '../components/PaymentStatusBadge';
import { PaymentTableSkeleton } from '../components/PaymentSkeletons';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUSES: PaymentStatus[] = ['PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED'];

const METHOD_LABELS: Record<string, string> = {
    CASH: 'Cash',
    CARD: 'Card',
    BANK_TRANSFER: 'Bank Transfer',
    MOBILE_PAYMENT: 'Mobile Payment',
};

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const AdminPayments: React.FC = () => {
    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'ALL'>('ALL');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await paymentService.getAll();
            setPayments(data);
        } catch {
            setError('Failed to load payments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleConfirm = async () => {
        if (!confirmingId) return;
        const id = confirmingId;
        setConfirmingId(null);
        setUpdatingId(id);
        setActionError(null);
        try {
            const updated = await paymentService.confirm(id);
            setPayments(prev => prev.map(p => p.id === id ? updated : p));
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 400) {
                setActionError('Payment is already confirmed.');
            } else if (status === 404) {
                setActionError('Payment not found.');
            } else {
                setActionError('Failed to confirm payment. Please try again.');
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const handleStatusChange = async (id: string, status: PaymentStatus) => {
        setUpdatingId(id);
        setActionError(null);
        const request: UpdatePaymentStatusRequest = { status };
        try {
            const updated = await paymentService.updateStatus(id, request);
            setPayments(prev => prev.map(p => p.id === id ? updated : p));
        } catch (err: any) {
            const httpStatus = err.response?.status;
            if (httpStatus === 404) {
                setActionError('Payment not found.');
            } else {
                setActionError('Failed to update payment status. Please try again.');
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const displayed = filterStatus === 'ALL'
        ? payments
        : payments.filter(p => p.status === filterStatus);

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Payments</h1>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as PaymentStatus | 'ALL')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">All Statuses</option>
                    {STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchPayments} className="ml-4 text-sm font-medium underline hover:no-underline">
                        Retry
                    </button>
                </div>
            )}

            {actionError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {actionError}
                </div>
            )}

            {loading ? (
                <PaymentTableSkeleton rows={5} />
            ) : displayed.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">No payments found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Booking ID</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Method</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Paid At</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.map(payment => (
                                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700">{payment.customerEmail}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                        {payment.bookingId.slice(0, 8)}…
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 font-medium">
                                        ${Number(payment.amount).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {METHOD_LABELS[payment.method] ?? payment.method}
                                    </td>
                                    <td className="px-4 py-3">
                                        <PaymentStatusBadge status={payment.status} />
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {payment.paidAt ? formatDateTime(payment.paidAt) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {payment.status === 'PENDING' && (
                                                <button
                                                    onClick={() => setConfirmingId(payment.id)}
                                                    disabled={updatingId === payment.id}
                                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            <select
                                                value={payment.status}
                                                disabled={updatingId === payment.id}
                                                onChange={e => handleStatusChange(payment.id, e.target.value as PaymentStatus)}
                                                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {STATUSES.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                open={confirmingId !== null}
                title="Confirm Payment"
                message="Are you sure you want to mark this payment as confirmed? This will record the current time as the payment date."
                confirmLabel="Yes, Confirm"
                cancelLabel="Cancel"
                onConfirm={handleConfirm}
                onCancel={() => setConfirmingId(null)}
            />
        </div>
    );
};

export default AdminPayments;
