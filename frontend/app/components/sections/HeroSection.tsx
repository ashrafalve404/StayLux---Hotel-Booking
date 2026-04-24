'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/hotels?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCityClick = (city: string) => {
    router.push(`/hotels?search=${encodeURIComponent(city)}`);
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Your
            <span className="block text-orange-400">
              Perfect Stay
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl mx-auto">
            Experience luxury accommodations at the world&apos;s finest destinations. 
            Book your dream vacation with exclusive packages.
          </p>

          <div className="max-w-xl mx-auto mb-10">
            <form onSubmit={handleSearch} className="flex rounded-xl bg-white shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search for cities, hotels, or destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-4 text-base text-slate-800 placeholder-slate-400 outline-none"
              />
              <button type="submit" className="px-6 bg-orange-500 text-white font-medium hover:bg-orange-600">
                Search
              </button>
            </form>
            <div className="flex justify-center gap-3 mt-4">
              {['Paris', 'New York', 'Dubai', 'Maldives'].map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-orange-400 hover:bg-white/10 rounded-full transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-slate-400">Happy Guests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-slate-400">Hotels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-sm text-slate-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9</div>
              <div className="text-sm text-slate-400">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}