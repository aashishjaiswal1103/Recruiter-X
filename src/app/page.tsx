import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import SocialProofBand from '../components/landing/SocialProofBand';
import ProblemSection from '../components/landing/ProblemSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import FAQSection from '../components/landing/FAQSection';
import CTABand from '../components/landing/CTABand';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <SocialProofBand />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesGrid />
      <FAQSection />
      <CTABand />
      <Footer />
    </main>
  );
}
