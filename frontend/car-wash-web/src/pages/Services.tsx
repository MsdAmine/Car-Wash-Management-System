import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import washServiceService from '../services/washServiceService';
import type { WashServiceResponse } from '../types/washService';
import { ServiceCardSkeleton } from '../components/WashServiceSkeletons';

const Services: React.FC = () => {
    const [services, setServices] = useState<WashServiceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await washServiceService.listActive();
            setServices(data);
        } catch {
            setError('Failed to load services. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <div className="min-h-screen bg-stone-100">
            <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-950">Wash Services</h1>
                    <p className="mt-1 text-sm text-gray-500">Choose from our range of professional car wash packages.</p>
                </div>

                {error && (
                <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="text-sm">{error}</span>
                    </div>
                    <button
                        onClick={fetchServices}
                        className="text-sm font-medium text-red-700 hover:text-red-900 underline"
                    >
                        Retry
                    </button>
                </div>
                )}

                {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ServiceCardSkeleton key={i} />
                    ))}
                </div>
                ) : services.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No services available</p>
                    <p className="text-sm text-gray-400 mt-1">Please check back later.</p>
                </div>
                ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300"
                        >
                            {/* Popular badge for first service */}
                            {index === 0 && (
                                <span className="mb-3 inline-flex self-start rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                                    </svg>
                                    Most Popular
                                </span>
                            )}
                            <div className="mb-3 flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition group-hover:bg-white">
                                    <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-semibold leading-snug text-gray-950">{service.name}</h2>
                            </div>
                            {service.description && (
                                <p className="text-sm text-gray-500 flex-1 leading-relaxed">{service.description}</p>
                            )}
                            {!service.description && <div className="flex-1" />}
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                <div>
                                    <span className="text-2xl font-bold text-gray-950">
                                        ${Number(service.price).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        {service.durationMinutes} min
                                    </span>
                                </div>
                            </div>
                            <Link
                                to="/book-appointment"
                                className="mt-3 w-full rounded-lg border border-gray-200 bg-white py-2 text-center text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
                            >
                                Book Now
                            </Link>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default Services;
