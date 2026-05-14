import React from 'react';
import type { WashServiceRequest } from '../types/washService';

interface WashServiceFormProps {
    form: WashServiceRequest;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    error: string | null;
    submitting: boolean;
    submitLabel: string;
    submittingLabel: string;
}

const WashServiceForm: React.FC<WashServiceFormProps> = ({
    form,
    onChange,
    onSubmit,
    onCancel,
    error,
    submitting,
    submitLabel,
    submittingLabel,
}) => {
    return (
        <>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        minLength={2}
                        maxLength={100}
                        value={form.name}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Basic Wash"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        maxLength={500}
                        value={form.description ?? ''}
                        onChange={onChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Optional description of the service"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="0.01"
                        step="0.01"
                        value={form.price === 0 ? '' : form.price}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. 9.99"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="durationMinutes"
                        required
                        min="1"
                        max="480"
                        value={form.durationMinutes === 0 ? '' : form.durationMinutes}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. 30"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={form.active ?? true}
                        onChange={onChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">
                        Active (available for booking)
                    </label>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                    >
                        {submitting ? submittingLabel : submitLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default WashServiceForm;
