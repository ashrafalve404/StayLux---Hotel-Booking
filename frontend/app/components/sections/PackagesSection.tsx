'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  inclusions: string[];
  image?: string;
}

const packageImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207d620?w=400&q=80',
];

export default function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        setPackages((data || []).slice(0, 4));
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

  return (
    <section className="py-10 bg-slate-50" id="packages">
      <div className="max-w-6xl mx-auto px-3">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-1">Special Packages</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">All-Inclusive Deals</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg animate-pulse h-56 md:h-64"></div>
            ))
          ) : packages.length === 0 ? (
            <div className="col-span-4 text-center py-8">
              <p className="text-slate-500">No packages available</p>
            </div>
          ) : (
            packages.map((pkg, index) => (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.id}`}
                className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="h-28 md:h-36 bg-slate-100">
                  <img src={packageImages[pkg.id % packageImages.length]} alt={pkg.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">{pkg.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{pkg.duration} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-orange-500">{formatCurrency(pkg.price)}</p>
                    <span className="text-xs px-3 py-1 bg-orange-500 text-white rounded">Select</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/packages" className="inline-block px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}