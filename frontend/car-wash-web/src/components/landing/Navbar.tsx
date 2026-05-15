import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

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
    const [isMobileSignupOpen, setIsMobileSignupOpen] = useState(false);
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
        <>
            {/* Desktop pill nav — sits over the right visual panel */}
            <nav className="hidden lg:flex absolute top-8 right-8 left-[52%] z-30 items-center justify-between bg-white/70 backdrop-blur-md rounded-full px-2 py-1.5 shadow-sm">
                <div className="flex items-center pl-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.label}
                            to={link.href}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-full hover:bg-white/60 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-full hover:bg-white/60 transition-colors"
                    >
                        Login
                    </Link>
                    <div className="relative" ref={signupRef}>
                        <button
                            type="button"
                            onClick={() => setIsSignupMenuOpen(prev => !prev)}
                            aria-haspopup="menu"
                            aria-expanded={isSignupMenuOpen}
                            className="text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-colors"
                        >
                            Sign up
                            <svg
                                className={`w-3 h-3 transition-transform ${isSignupMenuOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isSignupMenuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50"
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
                </div>
            </nav>

            {/* Mobile hamburger — top-right of card */}
            <button
                type="button"
                className="lg:hidden absolute top-5 right-5 z-30 p-2.5 rounded-full bg-white shadow-md text-gray-700 hover:text-gray-900"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
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

            {/* Mobile menu drawer */}
            {menuOpen && (
                <div className="lg:hidden absolute top-16 right-4 left-4 z-30 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex flex-col gap-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.label}
                            to={link.href}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2.5 rounded-lg hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2.5 rounded-lg hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                    >
                        Login
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-2 flex flex-col gap-1">
                        <button
                            type="button"
                            onClick={() => setIsMobileSignupOpen(prev => !prev)}
                            aria-expanded={isMobileSignupOpen}
                            className="w-full flex items-center justify-between text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2.5 rounded-lg transition-colors"
                        >
                            Sign up
                            <svg
                                className={`w-3.5 h-3.5 transition-transform ${isMobileSignupOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isMobileSignupOpen && (
                            <div className="flex flex-col gap-1 mt-1">
                                {signupOptions.map(option => (
                                    <Link
                                        key={option.href}
                                        to={option.href}
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setIsMobileSignupOpen(false);
                                        }}
                                        className="block px-3 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="text-sm font-semibold text-gray-900">{option.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
