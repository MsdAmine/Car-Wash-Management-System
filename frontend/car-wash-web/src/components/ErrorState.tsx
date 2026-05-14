import React from 'react';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    message = 'Something went wrong. Please try again.',
    onRetry,
    retryLabel = 'Try again',
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 text-red-300 text-5xl" aria-hidden="true">
                &#9888;
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">Something went wrong</h3>
            <p className="text-sm text-gray-400 mb-5 max-w-xs">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
                >
                    {retryLabel}
                </button>
            )}
        </div>
    );
};

export default ErrorState;
