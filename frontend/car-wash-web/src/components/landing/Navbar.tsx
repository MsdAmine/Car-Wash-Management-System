import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const BRAND = 'CarWash Pro';

const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Booking', href: '/book-appointment' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
];

const signupOptions = [
    {
        title: 'I am a client',
        description: 'Book services and manage your vehicles.',
        href: '/register?role=CUSTOMER',
    },
    {
        title: 'I am a car washer',
        description: 'Manage assigned washes and daily operations.',
        href: '/register?role=EMPLOYEE',
    },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSignupMenuOpen, setIsSignupMenuOpen] = useState(false);
    const signupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isSignupMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (signupRef.current && !signupRef.current.contains(event.target as Node)) {
                setIsSignupMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSignupMenuOpen]);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight shrink-0">
                    {BRAND}
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.label}
                            to={link.href}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                        Login
                    </Link>
                    <div className="relative" ref={signupRef}>
                        <button
                            type="button"
                            onClick={() => setIsSignupMenuOpen(prev => !prev)}
                            aria-haspopup="menu"
                            aria-expanded={isSignupMenuOpen}
                            className="text-sm font-semibold text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors inline-flex items-center gap-1"
                        >
                            Sign up
                            <svg
                                className={`w-3.5 h-3.5 transition-transform ${isSignupMenuOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isSignupMenuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50"
                            >
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                                    Create your account
                                </div>
                                {signupOptions.map(option => (
                                    <Link
                                        key={option.href}
                                        to={option.href}
                                        role="menuitem"
                                        onClick={() => setIsSignupMenuOpen(false)}
                                        className="block px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="text-sm font-semibold text-gray-900">{option.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link
                        to="/book-appointment"
                        className="text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
                    >
                        Book Now
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
                    {navLinks.map(link => (
                        <Link
                            key={link.label}
                            to={link.href}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 py-1"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-700 text-center py-2 border border-gray-200 rounded-lg"
                            onClick={() => setMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <div className="pt-2 mt-1 border-t border-gray-100 flex flex-col gap-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                                Create your account
                            </div>
                            {signupOptions.map(option => (
                                <Link
                                    key={option.href}
                                    to={option.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="block w-full text-left px-3 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="text-sm font-semibold text-gray-900">{option.title}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                                </Link>
                            ))}
                        </div>
                        <Link
                            to="/book-appointment"
                            className="text-sm font-semibold text-white bg-gray-900 text-center py-2 rounded-lg"
                            onClick={() => setMenuOpen(false)}
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
