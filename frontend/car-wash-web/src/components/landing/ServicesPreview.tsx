import { Link } from 'react-router-dom';

interface Service {
    name: string;
    description: string;
    duration: string;
    price: string;
}

const services: Service[] = [
    {
        name: 'Basic Wash',
        description: 'Quick exterior wash for everyday cleaning.',
        duration: '20 min',
        price: 'From $10',
    },
    {
        name: 'Premium Wash',
        description: 'Full exterior with hand-dry and tire shine.',
        duration: '40 min',
        price: 'From $25',
    },
    {
        name: 'Interior Cleaning',
        description: 'Deep vacuum, wipe-down, and odor refresh.',
        duration: '60 min',
        price: 'From $40',
    },
    {
        name: 'Full Detailing',
        description: 'Complete interior and exterior restoration.',
        duration: '120 min',
        price: 'From $80',
    },
];

export default function ServicesPreview() {
    return (
        <section className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular services</h2>
                        <p className="mt-1.5 text-sm text-gray-500">
                            Professional packages for every need and budget.
                        </p>
                    </div>
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors self-start sm:self-auto shrink-0"
                    >
                        View all services
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {services.map((service, index) => (
                        <ServiceCard key={service.name} service={service} featured={index === 1} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ service, featured }: { service: Service; featured: boolean }) {
    return (
        <div
            className={`relative rounded-2xl border p-6 flex flex-col gap-4 hover:shadow-md transition-all ${
                featured
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
            }`}
        >
            {featured && (
                <span className="absolute top-4 right-4 text-xs font-semibold bg-white/15 text-white px-2.5 py-1 rounded-full">
                    Popular
                </span>
            )}

            {/* Service icon */}
            <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    featured ? 'bg-white/15' : 'bg-gray-100'
                }`}
            >
                <svg
                    className={`w-5 h-5 ${featured ? 'text-white' : 'text-gray-600'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className={`text-base font-semibold ${featured ? 'text-white' : 'text-gray-900'}`}>
                    {service.name}
                </h3>
                <p className={`mt-1 text-sm leading-relaxed ${featured ? 'text-gray-300' : 'text-gray-500'}`}>
                    {service.description}
                </p>
            </div>

            {/* Meta */}
            <div className={`flex items-center gap-2 pt-4 border-t ${featured ? 'border-white/15' : 'border-gray-100'}`}>
                <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
                        featured ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {service.duration}
                </span>
                <span className={`text-sm font-bold ml-auto ${featured ? 'text-white' : 'text-gray-900'}`}>
                    {service.price}
                </span>
            </div>

            <Link
                to="/book-appointment"
                className={`mt-1 w-full text-center text-sm font-semibold py-2.5 rounded-xl transition-colors ${
                    featured
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
                Book Now
            </Link>
        </div>
    );
}
