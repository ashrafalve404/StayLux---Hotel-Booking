'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  inclusions: string;
  hotel: { id: number; name: string };
}

const packageImages: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  2: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80',
  3: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  4: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  5: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  6: 'https://images.unsplash.com/photo-1540541338287-41700207d620?w=800&q=80',
};

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    
    fetch(`http://localhost:3001/packages/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          setError('Package not found');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        setPkg(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading package');
        setLoading(false);
      });
  }, [params.id]);

  const handleBookPackage = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.id) {
      alert('Please login to book a package');
      window.location.href = '/auth/login';
      return;
    }

    if (!pkg) return;
    
    setBookingLoading(true);

    try {
      const res = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId: pkg.hotel?.id,
          packageId: pkg.id,
          checkInDate: new Date().toISOString().split('T')[0],
          checkOutDate: new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          guests: 1,
          totalAmount: pkg.price,
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to book package');
      }
    } catch {
      alert('Error booking package');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-slate-50 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl animate-pulse h-96"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-slate-50 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Package Not Found</h1>
              <p className="text-slate-500 mb-4">{error || "The package you're looking for doesn't exist."}</p>
              <Link href="/packages" className="text-orange-500 hover:text-orange-600">
                Browse all packages
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-slate-50 pt-20">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
              <p className="text-slate-500 mb-6">Your package has been booked successfully.</p>
              <div className="flex gap-3 justify-center">
                <Link href="/profile" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  View My Bookings
                </Link>
                <Link href="/packages" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                  Browse More Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/packages" className="text-sm text-slate-500 hover:text-orange-500 mb-4 block">
            ← Back to Packages
          </Link>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-64 bg-slate-100">
              <img
                src={packageImages[pkg.id] || packageImages[1]}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{pkg.name}</h1>
                  <p className="text-slate-500">{pkg.hotel?.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-500">Starting from</span>
                  <p className="text-3xl font-bold text-orange-500">{formatCurrency(pkg.price)}</p>
                  <span className="text-sm text-slate-500">for {pkg.duration} days</span>
                </div>
              </div>

              <p className="text-slate-600 mb-6">{pkg.description}</p>

              {pkg.inclusions && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What's Included</h3>
                  <p className="text-slate-600">{pkg.inclusions}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div></div>
                <button
                  onClick={handleBookPackage}
                  disabled={bookingLoading}
                  className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {bookingLoading ? 'Processing...' : 'Book This Package'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}