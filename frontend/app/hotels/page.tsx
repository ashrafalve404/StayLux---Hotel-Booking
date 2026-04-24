'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Search, Star, MapPin, SlidersHorizontal } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [cityFilter, setCityFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetch('/api/hotels')
      .then((res) => res.json())
      .then((data) => {
        setHotels(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cities = [...new Set(hotels.map(h => h.city))];

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = !searchTerm || 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = !cityFilter || hotel.city === cityFilter;
    const matchesMinPrice = !minPrice || hotel.pricePerNight >= parseInt(minPrice);
    const matchesMaxPrice = !maxPrice || hotel.pricePerNight <= parseInt(maxPrice);
    const matchesRating = !minRating || hotel.rating >= parseFloat(minRating);
    
    return matchesSearch && matchesCity && matchesMinPrice && matchesMaxPrice && matchesRating;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const clearFilters = () => {
    setCityFilter('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSearchTerm('');
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

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search hotels by name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg text-sm font-medium flex items-center gap-2 ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">City</label>
                  <select 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Max Price</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Min Rating</label>
                  <select 
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="">Any</option>
                    <option value="4.5">4.5+</option>
                    <option value="4">4+</option>
                    <option value="3.5">3.5+</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={clearFilters}
                className="mt-3 text-sm text-orange-500 hover:text-orange-600"
              >
                Clear all filters
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg animate-pulse h-56"></div>
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No hotels found</p>
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
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
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