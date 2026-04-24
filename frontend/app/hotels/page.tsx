'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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

const hotelImages: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
  2: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80',
  3: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
  4: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
  5: 'https://images.unsplash.com/photo-1540541338287-41700207d620?w=400&q=80',
  6: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
  7: 'https://images.unsplash.com/photo-1618773928121-c32242e6f099?w=400&q=80',
  8: 'https://images.unsplash.com/photo-1564501049416-61c3a7012eae?w=400&q=80',
};

function HotelsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    fetch('http://localhost:3001/hotels')
      .then((res) => res.json())
      .then((data) => {
        setHotels(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-slate-50 pt-20">
        <div className="max-w-6xl mx-auto px-3 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Find Your Perfect Hotel</h1>
            <p className="text-slate-600 text-sm">Browse luxury accommodations worldwide</p>
          </div>

          <div className="mb-5">
            <input
              type="text"
              placeholder="Search hotels by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg animate-pulse h-56"></div>
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No hotels found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredHotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  href={`/hotels/${hotel.id}`}
                  className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="h-32 md:h-40 bg-slate-100">
                    <img
                      src={hotelImages[hotel.id] || hotelImages[1]}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">{hotel.city}, {hotel.country}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                      <span className="text-amber-400">★</span>
                      <span>{hotel.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500">From</span>
                        <p className="text-base font-bold text-orange-500">{formatCurrency(hotel.pricePerNight)}</p>
                      </div>
                      <span className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded">View</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
}