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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
};

export default DateTimeSelector;
