import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    label?: string;
    center?: boolean;
}

const sizeClass: Record<SpinnerSize, string> = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label, center = false }) => {
    const spinner = (
        <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
            <div
                className={`${sizeClass[size]} rounded-full border-gray-200 border-t-blue-600 animate-spin`}
                role="status"
                aria-label={label ?? 'Loading'}
            />
            {label && <span className="text-sm text-gray-500">{label}</span>}
        </div>
    );

    if (center) {
        return <div className="flex justify-center items-center py-10">{spinner}</div>;
    }

    return spinner;
};

export default LoadingSpinner;
