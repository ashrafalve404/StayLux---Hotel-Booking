'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  inclusions: string[];
  image?: string;
}

const packageImages: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  2: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=400&q=80',
  3: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
  4: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
  5: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
  6: 'https://images.unsplash.com/photo-1540541338287-41700207d620?w=400&q=80',
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        setPackages(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = !searchTerm || 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMinPrice = !minPrice || pkg.price >= parseInt(minPrice);
    const matchesMaxPrice = !maxPrice || pkg.price <= parseInt(maxPrice);
    const matchesDuration = !duration || pkg.duration === parseInt(duration);
    
    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesDuration;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setDuration('');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-slate-50 pt-20">
        <div className="max-w-6xl mx-auto px-3 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Special Packages</h1>
            <p className="text-slate-600 text-sm">All-inclusive deals for your perfect vacation</p>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search packages..."
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Duration</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="">Any</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="4">4 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
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
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No packages found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPackages.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.id}`}
                  className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="h-32 md:h-40 bg-slate-100">
                    <img
                      src={packageImages[pkg.id] || packageImages[1]}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">
                      {pkg.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{pkg.duration} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500">From</span>
                        <p className="text-base font-bold text-orange-500">{formatCurrency(pkg.price)}</p>
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