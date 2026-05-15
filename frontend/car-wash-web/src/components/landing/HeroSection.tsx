import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import BookingPreviewCard from './BookingPreviewCard';
import { APP_NAME } from '../../config';

export default function HeroSection() {
    return (
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg relative">
            <div className="grid lg:grid-cols-2 lg:gap-2 p-3 lg:p-4">
                {/* Left section — brand, headline, description, booking form */}
                <section className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 flex flex-col">
                    <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight self-start">
                        {APP_NAME}
                    </Link>

                    <h1 className="mt-6 lg:mt-8 text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
                        <span className="text-gray-900">Book your car wash with ease</span>
                        <br />
                        <span className="text-gray-400">Manage everything online</span>
                    </h1>

                    <p className="mt-4 text-gray-600 text-base leading-relaxed max-w-md">
                        Choose your service, select your vehicle, pick a time, and track your booking from one simple dashboard.
                    </p>

                    <div className="mt-5">
                        <BookingPreviewCard />
                    </div>
                </section>

                {/* Right section — visual panel */}
                <section
                    id="about"
                    className="relative rounded-lg bg-gray-900 overflow-hidden min-h-[320px] sm:min-h-[380px] lg:h-[560px] xl:h-[600px] flex items-center justify-center"
                >
                    {/* Decorative bubbles */}
                    <Bubbles />

                    {/* Car illustration */}
                    <div className="relative z-10 w-full px-6 sm:px-10">
                        <CarIllustration />
                    </div>
                </section>
            </div>

            {/* Navbar — absolute positioned over the right panel (desktop) or top-right hamburger (mobile) */}
            <Navbar />
        </div>
    );
}

function CarIllustration() {
    return (
        <svg
            viewBox="0 0 480 280"
            className="w-full h-auto max-h-[320px] drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="bodyGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="windowGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#dbeafe" />
                    <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
            </defs>

            {/* Ground shadow */}
            <ellipse cx="240" cy="240" rx="190" ry="14" fill="#0f172a" fillOpacity="0.04" />

            {/* Foam puddle */}
            <ellipse cx="240" cy="232" rx="170" ry="10" fill="white" fillOpacity="0.7" />
            <circle cx="120" cy="232" r="6" fill="white" />
            <circle cx="380" cy="234" r="5" fill="white" />
            <circle cx="80" cy="236" r="4" fill="white" fillOpacity="0.8" />
            <circle cx="420" cy="230" r="4" fill="white" fillOpacity="0.8" />

            {/* Car body */}
            <path
                d="M70 175 Q70 155 95 150 L140 145 L175 110 Q190 95 215 93 L300 93 Q325 95 345 115 L370 145 L405 155 Q420 158 420 175 L420 205 Q420 215 410 215 L80 215 Q70 215 70 205 Z"
                fill="url(#bodyGrad)"
            />

            {/* Roof highlight */}
            <path
                d="M180 110 Q193 100 215 99 L295 99 Q318 100 335 118 L350 138 L180 138 Z"
                fill="#1e293b"
            />

            {/* Windows */}
            <path
                d="M192 115 Q200 107 217 106 L245 106 L245 138 L188 138 Z"
                fill="url(#windowGrad)"
                fillOpacity="0.9"
            />
            <path
                d="M255 106 L292 106 Q310 108 322 122 L335 138 L255 138 Z"
                fill="url(#windowGrad)"
                fillOpacity="0.9"
            />

            {/* Window shine */}
            <path d="M200 113 Q210 109 225 110" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
            <path d="M265 112 Q280 109 300 113" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />

            {/* Door line */}
            <line x1="245" y1="138" x2="245" y2="200" stroke="#0f172a" strokeOpacity="0.5" strokeWidth="1.5" />

            {/* Headlight */}
            <ellipse cx="405" cy="175" rx="10" ry="6" fill="#fde68a" />
            <ellipse cx="405" cy="175" rx="6" ry="3" fill="#fef9c3" />

            {/* Taillight */}
            <rect x="75" y="170" width="10" height="8" rx="2" fill="#fca5a5" />

            {/* Wheels */}
            <circle cx="145" cy="215" r="32" fill="#0f172a" />
            <circle cx="145" cy="215" r="22" fill="#1e293b" />
            <circle cx="145" cy="215" r="10" fill="#475569" />
            <circle cx="145" cy="215" r="4" fill="#94a3b8" />

            <circle cx="345" cy="215" r="32" fill="#0f172a" />
            <circle cx="345" cy="215" r="22" fill="#1e293b" />
            <circle cx="345" cy="215" r="10" fill="#475569" />
            <circle cx="345" cy="215" r="4" fill="#94a3b8" />

            {/* Foam clouds on body */}
            <g opacity="0.95">
                <circle cx="120" cy="160" r="14" fill="white" />
                <circle cx="138" cy="152" r="10" fill="white" />
                <circle cx="105" cy="170" r="8" fill="white" />
                <circle cx="130" cy="172" r="7" fill="white" />
            </g>
            <g opacity="0.95">
                <circle cx="370" cy="160" r="13" fill="white" />
                <circle cx="385" cy="170" r="9" fill="white" />
                <circle cx="395" cy="158" r="7" fill="white" />
            </g>
            <g opacity="0.9">
                <circle cx="240" cy="100" r="10" fill="white" />
                <circle cx="225" cy="92" r="6" fill="white" />
                <circle cx="252" cy="93" r="7" fill="white" />
            </g>

            {/* Water streams */}
            <path d="M180 30 Q185 60 200 90" stroke="rgba(255,255,255,0.35)" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M240 20 Q240 55 240 88" stroke="rgba(255,255,255,0.35)" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M300 28 Q295 58 285 90" stroke="rgba(255,255,255,0.35)" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

function Bubbles() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-[12%] left-[10%] w-3 h-3 rounded-full bg-white/80 shadow-sm" />
            <span className="absolute top-[20%] left-[18%] w-2 h-2 rounded-full bg-white/70" />
            <span className="absolute top-[8%] right-[18%] w-4 h-4 rounded-full bg-white/70 shadow-sm" />
            <span className="absolute top-[16%] right-[28%] w-2 h-2 rounded-full bg-white/60" />
            <span className="absolute bottom-[28%] left-[8%] w-3 h-3 rounded-full bg-white/70" />
            <span className="absolute bottom-[18%] right-[12%] w-2.5 h-2.5 rounded-full bg-white/70" />
            <span className="absolute top-[35%] left-[6%] w-1.5 h-1.5 rounded-full bg-white/80" />
            <span className="absolute top-[60%] right-[8%] w-2 h-2 rounded-full bg-white/70" />
        </div>
    );
}
