import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../lib/apiError';
import { APP_NAME } from '../config';
import { getDashboardPath } from '../lib/authRoutes';

type PublicRole = 'CUSTOMER' | 'EMPLOYEE';

type FieldErrors = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
};

function validate(form: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!form.email.trim()) errors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email address.';
    if (!form.phone.trim()) errors.phone = 'Phone number is required.';
    if (!form.password) errors.password = 'Password is required.';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    return errors;
}

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

const baseInputClass =
    'block w-full bg-gray-50 border rounded-xl px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition';

const Register: React.FC = () => {
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role');
    const role: PublicRole = roleParam === 'EMPLOYEE' ? 'EMPLOYEE' : 'CUSTOMER';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role,
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const updated = { ...formData, [name]: value };
            setFieldErrors(validate(updated));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const name = e.target.name;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFieldErrors(validate(formData));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate(formData);
        if (Object.values(errors).some(Boolean)) {
            setFieldErrors(errors);
            setTouched({ firstName: true, lastName: true, email: true, phone: true, password: true });
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const user = await register({ ...formData, role });
            navigate(getDashboardPath(user.role));
        } catch (err) {
            setError(getApiErrorMessage(err, {
                409: 'An account with this email already exists.',
                400: 'Invalid registration data. Please check your input.',
            }, 'Registration failed. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    const fieldClass = (name: keyof FieldErrors) =>
        `${baseInputClass} ${
            touched[name] && fieldErrors[name]
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-gray-900 focus:border-gray-900'
        }`;

    const title =
        role === 'EMPLOYEE' ? 'Create your car washer account' : 'Create your client account';
    const subtitle =
        role === 'EMPLOYEE'
            ? 'Manage assigned washes and daily operations.'
            : 'Book services, manage vehicles, and track your appointments.';

    return (
        <div className="lg:h-screen lg:overflow-hidden min-h-screen bg-gray-100 flex items-center justify-center px-4 py-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-900" aria-hidden="true" />
                            <span className="font-semibold text-gray-900">{APP_NAME}</span>
                        </div>
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
                            Back to home
                        </Link>
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    <p className="mt-1 text-sm text-gray-500">{subtitle}</p>

                    {error && (
                        <div role="alert" className="mt-4 flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
                            <span className="text-sm text-gray-900">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    placeholder="John"
                                    aria-required="true"
                                    aria-invalid={touched.firstName && !!fieldErrors.firstName}
                                    aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                                    className={fieldClass('firstName')}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.firstName && fieldErrors.firstName && (
                                    <p id="firstName-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    placeholder="Doe"
                                    aria-required="true"
                                    aria-invalid={touched.lastName && !!fieldErrors.lastName}
                                    aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                                    className={fieldClass('lastName')}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.lastName && fieldErrors.lastName && (
                                    <p id="lastName-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                aria-required="true"
                                aria-invalid={touched.email && !!fieldErrors.email}
                                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                                className={fieldClass('email')}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {touched.email && fieldErrors.email && (
                                <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                                Phone number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="+1 (555) 000-0000"
                                aria-required="true"
                                aria-invalid={touched.phone && !!fieldErrors.phone}
                                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                                className={fieldClass('phone')}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {touched.phone && fieldErrors.phone && (
                                <p id="phone-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                aria-required="true"
                                aria-invalid={touched.password && !!fieldErrors.password}
                                aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
                                className={fieldClass('password')}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {touched.password && fieldErrors.password ? (
                                <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.password}</p>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition mt-1"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-gray-900 underline underline-offset-4 hover:no-underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                <AuthVisualPanel />
            </div>
        </div>
    );
};

export default Register;
