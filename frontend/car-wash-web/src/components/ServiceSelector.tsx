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
            <div className="flex items-center gap-2 py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500" />
                <span className="text-sm text-gray-500">Loading services...</span>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <p className="text-sm text-gray-500 py-2">No active wash services available.</p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map(service => (
                <button
                    key={service.id}
                    type="button"
                    onClick={() => onChange(service.id)}
                    className={`flex flex-col text-left px-4 py-3 border rounded-lg transition ${
                        selectedId === service.id
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                >
                    <span className="font-medium text-gray-800">{service.name}</span>
                    {service.description && (
                        <span className="text-sm text-gray-500 mt-0.5 line-clamp-2">{service.description}</span>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-semibold text-blue-700">${service.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-400">{service.durationMinutes} min</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ServiceSelector;
