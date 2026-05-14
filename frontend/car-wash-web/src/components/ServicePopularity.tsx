import React from 'react';
import type { ServiceStatResponse } from '../types/dashboard';

interface ServicePopularityProps {
    services: ServiceStatResponse[];
}

const ServicePopularity: React.FC<ServicePopularityProps> = ({ services }) => {
    if (services.length === 0) {
        return <p className="text-gray-500 text-sm italic">No service data available.</p>;
    }

    const max = Math.max(...services.map(s => s.bookingCount), 1);

    return (
        <ul className="space-y-3">
            {services.map(s => (
                <li key={s.serviceName}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{s.serviceName}</span>
                        <span className="text-gray-500">{s.bookingCount} bookings</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(s.bookingCount / max) * 100}%` }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ServicePopularity;
