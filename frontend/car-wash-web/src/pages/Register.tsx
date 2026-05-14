import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../lib/apiError';

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

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: 'CUSTOMER'
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
            await register(formData);
            navigate('/');
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
        `block w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400 transition ${
            touched[name] && fieldErrors[name]
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-500'
        }`;

    const fieldClassWithIcon = (name: keyof FieldErrors) =>
        `block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400 transition ${
            touched[name] && fieldErrors[name]
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-500'
        }`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <svg className="w-9 h-9 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white">SparkleWash</h1>
                    <p className="text-blue-200 mt-1 text-sm">Car Wash Management System</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Create your account</h2>
                    <p className="text-sm text-gray-500 mb-6">Start managing your car wash experience</p>

                    {error && (
                        <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    First Name <span className="text-red-500" aria-hidden="true">*</span>
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
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Last Name <span className="text-red-500" aria-hidden="true">*</span>
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address <span className="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    aria-required="true"
                                    aria-invalid={touched.email && !!fieldErrors.email}
                                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                                    className={fieldClassWithIcon('email')}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {touched.email && fieldErrors.email && (
                                <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone Number <span className="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="+1 (555) 000-0000"
                                    aria-required="true"
                                    aria-invalid={touched.phone && !!fieldErrors.phone}
                                    aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                                    className={fieldClassWithIcon('phone')}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {touched.phone && fieldErrors.phone && (
                                <p id="phone-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password <span className="text-red-500" aria-hidden="true">*</span>
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    aria-required="true"
                                    aria-invalid={touched.password && !!fieldErrors.password}
                                    aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
                                    className={fieldClassWithIcon('password')}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {touched.password && fieldErrors.password ? (
                                <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.password}</p>
                            ) : (
                                <p id="password-hint" className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
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
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
