'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        setPackages(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Special Packages</h1>
            <p className="text-slate-600 text-sm">All-inclusive deals for your perfect vacation</p>
          </div>

          <div className="mb-5">
            <input
              type="text"
              placeholder="Search packages..."
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