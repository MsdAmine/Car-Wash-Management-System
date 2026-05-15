import { Link } from 'react-router-dom';

const BRAND = 'CarWash Pro';

const footerLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Booking', href: '/book-appointment' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Contact', href: '#contact' },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                    {/* Brand & tagline */}
                    <div className="max-w-xs">
                        <p className="text-lg font-bold tracking-tight">{BRAND}</p>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                            A modern platform for managing car wash bookings and operations.
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap gap-x-8 gap-y-3">
                        {footerLinks.map(link => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Divider + copyright */}
                <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs text-gray-600">
                        © {year} {BRAND}. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-600">
                        Built for professional car wash management.
                    </p>
                </div>
            </div>
        </footer>
    );
}
