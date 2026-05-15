import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';
import { getDashboardPath } from '../lib/authRoutes';

const inputClass =
    'block w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition';

const AuthVisualPanel: React.FC = () => (
    <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-10 items-center justify-center">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-white/30 blur-3xl" aria-hidden="true" />

        <div className="relative w-full max-w-sm">
            <svg viewBox="0 0 320 200" className="w-full h-auto" aria-hidden="true">
                <ellipse cx="160" cy="170" rx="120" ry="10" fill="#0f172a" opacity="0.08" />
                <path d="M60 140 L90 95 Q100 85 115 85 L210 85 Q225 85 235 95 L260 140 Z" fill="#1f2937" />
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

            <div className="absolute -top-2 -left-2 bg-white rounded-2xl shadow-md px-4 py-2 text-sm font-medium text-gray-900">
                Fast booking
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl shadow-md px-4 py-2 text-sm font-medium text-gray-900">
                Secure access
            </div>
        </div>
    </div>
);

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const user = await login({ email, password });

            navigate(getDashboardPath(user.role));
        } catch (err) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-900" aria-hidden="true" />
                            <span className="font-semibold text-gray-900">{APP_NAME}</span>
                        </div>
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
                            Back to home
                        </Link>
                    </div>

                    <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
                    <p className="mt-2 text-gray-500">Sign in to manage your car wash bookings.</p>

                    {error && (
                        <div role="alert" className="mt-6 flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
                            <span className="text-sm text-gray-900">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={inputClass}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className={inputClass}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-2xl px-4 py-3 transition"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-gray-900 underline underline-offset-4 hover:no-underline">
                            Create one
                        </Link>
                    </p>
                </div>

                <AuthVisualPanel />
            </div>
        </div>
    );
};

export default Login;
