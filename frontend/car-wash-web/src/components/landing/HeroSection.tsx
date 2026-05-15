import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import BookingPreviewCard from './BookingPreviewCard';

const BRAND = 'CarWash Pro';

export default function HeroSection() {
    return (
        <div className="relative w-full max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid min-h-[calc(100vh-2rem)] lg:min-h-[660px] lg:grid-cols-[0.95fr_1.05fr]">
                <section className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-12">
                    <Link to="/" className="self-start text-xl font-bold tracking-tight text-gray-950">
                        {BRAND}
                    </Link>

                    <h1 className="mt-8 max-w-2xl text-4xl font-bold leading-tight text-gray-950 sm:text-5xl lg:text-6xl">
                        Book your car wash with ease
                    </h1>

                    <p className="mt-4 max-w-lg text-base leading-7 text-gray-600">
                        Choose a service, select a vehicle, pick a time, and keep every booking organized from a calm customer workspace.
                    </p>

                    <div className="mt-7">
                        <BookingPreviewCard />
                    </div>

                    <div className="mt-8 grid max-w-md grid-cols-3 gap-3 text-sm">
                        <Metric value="24/7" label="Booking" />
                        <Metric value="4" label="Wash tiers" />
                        <Metric value="1" label="Workspace" />
                    </div>
                </section>

                <section
                    id="about"
                    className="relative flex min-h-[360px] items-center justify-center border-t border-gray-200 bg-stone-100 px-5 py-10 lg:min-h-0 lg:border-l lg:border-t-0 lg:px-10"
                >
                    <div className="w-full max-w-xl">
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Today</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-950">Premium exterior wash</p>
                                </div>
                                <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                                    Available
                                </span>
                            </div>

                            <CarIllustration />

                            <div id="contact" className="grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                                <PreviewItem label="Vehicle" value="Sedan" />
                                <PreviewItem label="Time" value="10:30 AM" />
                                <PreviewItem label="Status" value="Ready" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Navbar />
        </div>
    );
}

function Metric({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
            <p className="text-base font-semibold text-gray-950">{value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{label}</p>
        </div>
    );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-gray-950">{value}</p>
        </div>
    );
}

function CarIllustration() {
    return (
        <svg
            viewBox="0 0 480 260"
            className="my-8 h-auto w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <ellipse cx="240" cy="222" rx="175" ry="13" fill="#111827" opacity="0.08" />
            <path
                d="M72 167 Q75 144 101 140 L139 136 L174 103 Q192 87 219 86 L299 86 Q326 88 347 108 L375 136 L408 145 Q423 149 423 168 L423 196 Q423 207 411 207 L84 207 Q72 207 72 195 Z"
                fill="#1f2937"
            />
            <path d="M184 105 Q198 94 220 94 L294 94 Q315 96 331 113 L346 132 L184 132 Z" fill="#111827" />
            <path d="M197 111 Q205 103 220 102 L244 102 L244 132 L192 132 Z" fill="#e5e7eb" />
            <path d="M254 102 L291 102 Q307 104 320 118 L333 132 L254 132 Z" fill="#e5e7eb" />
            <line x1="247" y1="132" x2="247" y2="196" stroke="#374151" strokeWidth="1.5" />
            <rect x="86" y="164" width="16" height="8" rx="3" fill="#fca5a5" />
            <ellipse cx="407" cy="169" rx="12" ry="6" fill="#fef3c7" />
            <circle cx="145" cy="207" r="31" fill="#111827" />
            <circle cx="145" cy="207" r="20" fill="#374151" />
            <circle cx="145" cy="207" r="8" fill="#9ca3af" />
            <circle cx="347" cy="207" r="31" fill="#111827" />
            <circle cx="347" cy="207" r="20" fill="#374151" />
            <circle cx="347" cy="207" r="8" fill="#9ca3af" />
            <g fill="#ffffff">
                <circle cx="125" cy="154" r="13" />
                <circle cx="142" cy="148" r="9" />
                <circle cx="110" cy="163" r="7" />
                <circle cx="372" cy="154" r="12" />
                <circle cx="388" cy="162" r="8" />
                <circle cx="238" cy="90" r="9" />
                <circle cx="224" cy="84" r="6" />
                <circle cx="251" cy="84" r="6" />
            </g>
            <path d="M182 34 Q187 61 201 88" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            <path d="M240 25 Q240 58 240 82" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            <path d="M300 33 Q295 60 285 87" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
