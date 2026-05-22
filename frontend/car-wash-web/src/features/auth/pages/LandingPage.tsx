import { Sparkles } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { getServiceImage } from '@/features/services/serviceImages';

const MOCK_SERVICES = [
  { id: '1', name: 'Basic Wash', description: 'Exterior hand wash and dry. Quick and affordable.' },
  { id: '2', name: 'Express Wash', description: "Fast rinse and dry for when you're in a hurry." },
  { id: '3', name: 'Full Detail', description: 'Complete interior and exterior detail service.' },
  { id: '4', name: 'Premium Detail', description: 'Full detail with paint protection and polish.' },
];

const MOCK_STATS = [
  { value: '2,400+', label: 'Happy clients' },
  { value: '180+', label: 'Cars washed weekly' },
  { value: '4.9★', label: 'Average rating' },
  { value: '12', label: 'Expert washers' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Choose a service', description: 'Pick from our range of professional wash and detail packages.' },
  { step: 2, title: 'Book a time slot', description: 'Select a date and time that works for you.' },
  { step: 3, title: 'We come to you', description: 'Your dedicated washer arrives and gets to work.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg" aria-hidden="true" />
            <span className="text-xl font-semibold text-gray-900">WashFlow</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm text-gray-600 hover:text-gray-900">Services</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How it works</a>
            <a href="#services" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
          </div>

          <div className="flex items-center">
            <a href={ROUTES.PUBLIC.LOGIN} className="text-sm text-gray-600 hover:text-gray-900">
              Sign in
            </a>
            <a
              href={ROUTES.PUBLIC.REGISTER}
              className="ml-3 inline-flex items-center justify-center rounded-lg font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 px-3 py-1.5 text-sm"
            >
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Professional car wash, on demand
            </span>
            <h1 className="mt-4 text-4xl font-bold text-gray-900 leading-tight">
              Your car deserves<br />the best care.
            </h1>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-md">
              Book a professional car wash in minutes. We come to you — no queues, no hassle.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={ROUTES.PUBLIC.REGISTER}
                className="inline-flex items-center justify-center rounded-lg font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 px-5 py-2.5 text-base"
              >
                Book your first wash
              </a>
              <span className="text-sm text-gray-400">or</span>
              <a href={ROUTES.PUBLIC.LOGIN} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Sign in
              </a>
            </div>
          </div>

          <img
            src="/images/hero-wide.png"
            alt="Hero — car being washed"
            className="w-full h-80 md:h-96 object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-indigo-600 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {MOCK_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-indigo-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Our services</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Everything your car needs</h2>
          <p className="text-lg text-gray-500 mt-3">Professional wash and detail packages for every need.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {MOCK_SERVICES.map((service) => (
            <a
              key={service.id}
              href={ROUTES.PUBLIC.REGISTER}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow block"
            >
              <img
                src={getServiceImage(service)}
                alt={service.name}
                className="w-full mb-4 aspect-video object-cover"
              />
              <p className="text-lg font-semibold text-gray-900">{service.name}</p>
              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
              <span className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-4 inline-block">
                Book now →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Three simple steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready for a cleaner car?</h2>
          <p className="text-lg text-indigo-200 mt-3">Book your first wash today. No commitment required.</p>
          <a
            href={ROUTES.PUBLIC.REGISTER}
            className="mt-8 inline-block bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg font-semibold text-base transition-colors"
          >
            Book your first wash
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg" aria-hidden="true" />
                <span className="text-xl font-semibold text-white">WashFlow</span>
              </div>
              <p className="text-sm text-gray-400 mt-3">Professional car care, on demand.</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Product</p>
              <a href="#services" className="text-sm text-gray-400 hover:text-white block mb-2">Services</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white block mb-2">How it works</a>
              <a href="#services" className="text-sm text-gray-400 hover:text-white block mb-2">Pricing</a>
              <a href={ROUTES.PUBLIC.REGISTER} className="text-sm text-gray-400 hover:text-white block mb-2">Book now</a>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Company</p>
              <span className="text-sm text-gray-600 block mb-2">About</span>
              <span className="text-sm text-gray-600 block mb-2">Contact</span>
              <span className="text-sm text-gray-600 block mb-2">Privacy</span>
              <span className="text-sm text-gray-600 block mb-2">Terms</span>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">© 2025 WashFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
