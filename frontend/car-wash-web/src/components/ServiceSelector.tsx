import React from 'react';
import type { WashServiceResponse } from '../types/washService';

interface ServiceSelectorProps {
    services: WashServiceResponse[];
    selectedId: string;
    onChange: (id: string) => void;
    loading?: boolean;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ services, selectedId, onChange, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
                <span className="text-sm text-gray-500">Loading services...</span>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-500">No active wash services available.</p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map(service => (
                <button
                    key={service.id}
                    type="button"
                    onClick={() => onChange(service.id)}
                    className={`flex min-h-32 flex-col rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${
                        selectedId === service.id
                            ? 'border-gray-900 bg-gray-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <span className="font-medium text-gray-900">{service.name}</span>
                    {service.description && (
                        <span className="text-sm text-gray-500 mt-0.5 line-clamp-2">{service.description}</span>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-semibold text-gray-950">${service.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">{service.durationMinutes} min</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ServiceSelector;
