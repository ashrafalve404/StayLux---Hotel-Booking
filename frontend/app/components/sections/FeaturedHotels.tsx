'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Hotel {
  id: number;
  name: string;
  description: string;
  city: string;
  country: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
}

const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207d620?w=400&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
];

export default function FeaturedHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hotels')
      .then((res) => res.json())
      .then((data) => {
        setHotels(data?.slice(0, 6) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getImageUrl = (index: number) => hotelImages[index % hotelImages.length];

  return (
    <section className="py-12 bg-slate-50" id="hotels">
      <div className="max-w-6xl mx-auto px-3">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-2">Featured</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Handpicked Selection</h2>
          <p className="text-slate-600 text-sm">Curated collection of luxury accommodations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg animate-pulse h-64 md:h-72"></div>
            ))
          ) : hotels.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-slate-500">No hotels available</p>
            </div>
          ) : (
            hotels.map((hotel, index) => (
              <Link
                key={hotel.id}
                href={`/hotels/${hotel.id}`}
                className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="h-32 md:h-40 bg-slate-100 relative">
                  <img src={getImageUrl(index)} alt={hotel.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-white/90 rounded-full text-xs text-slate-700">{hotel.city}</span>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center bg-white/90 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs text-amber-400">★</span>
                    <span className="text-xs font-semibold text-slate-800 ml-0.5">{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">{hotel.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{hotel.country}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500">From</span>
                      <p className="text-base font-bold text-orange-500">{formatCurrency(hotel.pricePerNight)}</p>
                    </div>
                    <span className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded">View</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/hotels" className="inline-block px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
            Browse All Hotels
          </Link>
        </div>
      </div>
    </section>
  );
}