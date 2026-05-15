import Navbar from '../components/landing/Navbar';
import StatusStrip from '../components/landing/StatusStrip';
import HeroSection from '../components/landing/HeroSection';
import ActivitySection from '../components/landing/ActivitySection';
import ServicesPreview from '../components/landing/ServicesPreview';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <StatusStrip />
            <main className="flex-1">
                <HeroSection />
                <ActivitySection />
                <ServicesPreview />
            </main>
            <Footer />
        </div>
    );
}
