import React, { useEffect, useState } from 'react';
import washServiceService from '../services/washServiceService';
import type { WashServiceResponse } from '../types/washService';

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
        <div className="max-w-5xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Our Wash Services</h1>
                <p className="mt-2 text-gray-500">Choose from our range of professional car wash packages.</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={fetchServices}
                        className="ml-4 text-sm font-medium underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                    <p className="ml-3 text-gray-500">Loading services...</p>
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No services available at the moment.</p>
                    <p className="text-sm mt-1">Please check back later.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map(service => (
                        <div
                            key={service.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h2>
                            {service.description && (
                                <p className="text-sm text-gray-500 mb-4 flex-1">{service.description}</p>
                            )}
                            {!service.description && <div className="flex-1" />}
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-2xl font-bold text-blue-600">
                                    ${Number(service.price).toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {service.durationMinutes} min
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Services;
