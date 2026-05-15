import { Link } from 'react-router-dom';

interface ActivityCard {
    title: string;
    service: string;
    detail: string;
    linkLabel: string;
    linkHref: string;
    icon: 'calendar' | 'check' | 'star';
}

const cards: ActivityCard[] = [
    {
        title: 'Upcoming Booking',
        service: 'Premium Wash',
        detail: 'Tomorrow, 10:30 AM',
        linkLabel: 'View details',
        linkHref: '/my-bookings',
        icon: 'calendar',
    },
    {
        title: 'Recent Service',
        service: 'Interior Cleaning',
        detail: 'Completed last week',
        linkLabel: 'See history',
        linkHref: '/my-bookings',
        icon: 'check',
    },
    {
        title: 'Suggested Service',
        service: 'Full Detailing',
        detail: 'Recommended for your vehicle',
        linkLabel: 'Explore',
        linkHref: '/services',
        icon: 'star',
    },
];

export default function ActivitySection() {
    return (
        <section className="bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Your bookings and activity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {cards.map(card => (
                        <ActivityCard key={card.title} card={card} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ActivityCard({ card }: { card: ActivityCard }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
            {/* Icon area */}
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <ActivityIcon type={card.icon} />
            </div>

            {/* Content */}
            <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {card.title}
                </p>
                <p className="text-base font-semibold text-gray-900">{card.service}</p>
                <p className="text-sm text-gray-500 mt-0.5">{card.detail}</p>
            </div>

            {/* Action */}
            <Link
                to={card.linkHref}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors self-start"
            >
                {card.linkLabel}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </Link>
        </div>
    );
}

function ActivityIcon({ type }: { type: ActivityCard['icon'] }) {
    if (type === 'calendar') {
        return (
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
        );
    }
    if (type === 'check') {
        return (
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        );
    }
    return (
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
    );
}
