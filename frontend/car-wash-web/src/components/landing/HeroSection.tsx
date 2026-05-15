import { Link } from 'react-router-dom';
import BookingPreviewCard from './BookingPreviewCard';

export default function HeroSection() {
    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left column */}
                    <div>
                        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-6">
                            Professional Car Wash
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
                            Book your car wash<br />
                            <span className="text-gray-400">in minutes</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
                            Choose a service, select your vehicle, pick a time, and track everything from one simple dashboard.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            <Link
                                to="/book-appointment"
                                className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Book a Wash
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-2 border border-gray-300 text-gray-900 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                View Services
                            </Link>
                        </div>

                        <BookingPreviewCard />
                    </div>

                    {/* Right column — Tailwind illustration */}
                    <div className="flex justify-center lg:justify-end">
                        <CarWashIllustration />
                    </div>
                </div>
            </div>
        </section>
    );
}

function CarWashIllustration() {
    return (
        <div className="relative w-full max-w-md aspect-[4/3] bg-gray-950 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Background bubbles */}
            <div className="absolute inset-0">
                <Bubble size={80} top="10%" left="5%" opacity={0.08} />
                <Bubble size={48} top="20%" left="75%" opacity={0.1} />
                <Bubble size={32} top="60%" left="80%" opacity={0.12} />
                <Bubble size={64} top="70%" left="10%" opacity={0.07} />
                <Bubble size={24} top="40%" left="60%" opacity={0.15} />
                <Bubble size={16} top="80%" left="50%" opacity={0.1} />
            </div>

            {/* Water stream lines */}
            <div className="absolute top-0 left-1/4 w-px h-1/2 bg-gradient-to-b from-blue-400/30 to-transparent" />
            <div className="absolute top-0 left-1/3 w-px h-2/3 bg-gradient-to-b from-blue-300/20 to-transparent" />
            <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gradient-to-b from-blue-400/25 to-transparent" />
            <div className="absolute top-0 left-2/3 w-px h-2/3 bg-gradient-to-b from-blue-300/20 to-transparent" />

            {/* Car silhouette */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                <svg
                    viewBox="0 0 240 100"
                    className="w-56 h-auto drop-shadow-lg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Car body */}
                    <rect x="20" y="55" width="200" height="30" rx="8" fill="white" fillOpacity="0.15" />
                    {/* Car roof */}
                    <path d="M55 55 L75 25 L165 25 L185 55 Z" fill="white" fillOpacity="0.2" />
                    {/* Windows */}
                    <path d="M80 52 L92 30 L148 30 L160 52 Z" fill="white" fillOpacity="0.35" />
                    <line x1="120" y1="30" x2="120" y2="52" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
                    {/* Wheels */}
                    <circle cx="70" cy="85" r="15" fill="white" fillOpacity="0.12" />
                    <circle cx="70" cy="85" r="8" fill="white" fillOpacity="0.2" />
                    <circle cx="170" cy="85" r="15" fill="white" fillOpacity="0.12" />
                    <circle cx="170" cy="85" r="8" fill="white" fillOpacity="0.2" />
                    {/* Shine highlight */}
                    <path d="M85 33 Q95 26 115 27" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
                </svg>

                {/* Service badge */}
                <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-xs font-semibold tracking-wide">Premium Wash Active</span>
                </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
    );
}

function Bubble({ size, top, left, opacity }: { size: number; top: string; left: string; opacity: number }) {
    return (
        <div
            className="absolute rounded-full border border-blue-400"
            style={{
                width: size,
                height: size,
                top,
                left,
                opacity,
            }}
        />
    );
}
