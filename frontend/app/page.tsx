'use client';

import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import FeaturedHotels from './components/sections/FeaturedHotels';
import PackagesSection from './components/sections/PackagesSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import Footer from './components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedHotels />
        <PackagesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
