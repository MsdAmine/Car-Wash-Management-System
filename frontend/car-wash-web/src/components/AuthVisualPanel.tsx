import React from 'react';

const AuthVisualPanel: React.FC = () => (
    <div className="hidden lg:flex relative overflow-hidden bg-gray-900 p-10 items-center justify-center">
        <div className="relative w-full max-w-sm">
            <svg viewBox="0 0 320 200" className="w-full h-auto" aria-hidden="true">
                <ellipse cx="160" cy="170" rx="120" ry="10" fill="#0f172a" opacity="0.04" />
                <path d="M60 140 L90 95 Q100 85 115 85 L210 85 Q225 85 235 95 L260 140 Z" fill="#475569" />
                <path d="M100 95 L115 95 L120 130 L100 130 Z" fill="#cbd5e1" opacity="0.85" />
                <path d="M130 95 L200 95 L205 130 L125 130 Z" fill="#cbd5e1" opacity="0.85" />
                <path d="M215 95 L225 95 L235 130 L215 130 Z" fill="#cbd5e1" opacity="0.85" />
                <rect x="50" y="138" width="220" height="8" rx="4" fill="#111827" />
                <circle cx="95" cy="150" r="14" fill="#111827" />
                <circle cx="95" cy="150" r="6" fill="#374151" />
                <circle cx="225" cy="150" r="14" fill="#111827" />
                <circle cx="225" cy="150" r="6" fill="#374151" />
                {[
                    [40, 70, 10], [55, 50, 7], [75, 35, 9], [110, 25, 6],
                    [250, 30, 8], [275, 50, 10], [290, 75, 7], [60, 110, 5],
                    [270, 110, 6], [30, 90, 6],
                ].map(([cx, cy, r], i) => (
                    <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" opacity="0.9" />
                ))}
            </svg>

            <div className="absolute -top-2 -left-2 bg-white/10 border border-white/10 rounded-md px-4 py-2 text-sm font-medium text-gray-300">
                Fast booking
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white/10 border border-white/10 rounded-md px-4 py-2 text-sm font-medium text-gray-300">
                Secure access
            </div>
        </div>
    </div>
);

export default AuthVisualPanel;
