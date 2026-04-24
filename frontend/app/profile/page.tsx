'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  status: string;
  hotel: { name: string; city: string; country: string };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    fetch(`/api/bookings?userId=${parsedUser.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-20 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">You don't have any bookings yet.</p>
                <Link href="/hotels" className="text-orange-500 hover:text-orange-600">
                  Browse Hotels
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-slate-900">{booking.hotel?.name || 'Hotel'}</h3>
                        <p className="text-sm text-slate-500">{booking.hotel?.city}, {booking.hotel?.country}</p>
                        <div className="text-sm text-slate-500 mt-2">
                          {booking.checkInDate} to {booking.checkOutDate} • {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </div>
                        <p className="font-bold text-orange-500 mt-2">{formatCurrency(booking.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-500">Name</label>
                  <p className="text-slate-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Email</label>
                  <p className="text-slate-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Phone</label>
                  <p className="text-slate-900">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Account Type</label>
                  <p className="text-slate-900 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/hotels" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                  Browse Hotels
                </Link>
                <Link href="/packages" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                  View Packages
                </Link>
                <Link href="/contact" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                  Contact Support
                </Link>
                {user.role === 'owner' && (
                  <Link href="/dashboard" className="block px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-lg font-medium">
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}