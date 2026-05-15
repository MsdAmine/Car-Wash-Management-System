import React from 'react';

interface DateTimeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ value, onChange }) => {
    const now = new Date();
    // min: 30 minutes from now, max: 90 days from now
    const min = new Date(now.getTime() + 30 * 60 * 1000);
    const max = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const toInputValue = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    return (
        <input
            type="datetime-local"
            value={value}
            min={toInputValue(min)}
            max={toInputValue(max)}
            onChange={e => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        />
    );
};

export default DateTimeSelector;
