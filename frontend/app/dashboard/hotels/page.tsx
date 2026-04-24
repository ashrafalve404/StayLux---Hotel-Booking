'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
];

export default function DashboardHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    if (!userData.id) return;

    loadHotels(userData.id);
  }, []);

  const loadHotels = (ownerId: number) => {
    fetch(`/api/hotels?ownerId=${ownerId}`)
      .then((res) => res.json())
      .then((data) => {
        setHotels(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this hotel?')) return;
    
    setDeleting(id);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setHotels((prev) => prev.filter((h) => h.id !== id));
      } else {
        alert('Failed to delete hotel');
      }
    } catch {
      alert('Error deleting hotel');
    } finally {
      setDeleting(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Hotels</h1>
          <p className="text-slate-500 mt-1">Manage your hotel listings</p>
        </div>
        <Link href="/dashboard/hotels/new" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          + Add Hotel
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 h-64 animate-pulse"></div>
          ))}
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">No hotels added yet</p>
          <Link href="/dashboard/hotels/new" className="text-orange-500 hover:text-orange-600">
            Add your first hotel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((hotel, index) => (
            <Link key={hotel.id} href={`/dashboard/hotels/${hotel.id}`} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg group">
              <div className="h-40 bg-slate-100">
                <img src={hotelImages[index % hotelImages.length]} alt={hotel.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900">{hotel.name}</h3>
                <p className="text-sm text-slate-500">{hotel.city}, {hotel.country}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-orange-500">{formatCurrency(hotel.pricePerNight)}</span>
                  <span className="text-sm text-slate-500">★ {hotel.rating}</span>
                </div>
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => router.push(`/dashboard/hotels/${hotel.id}/edit`)}
                    className="flex-1 px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(hotel.id, e)}
                    disabled={deleting === hotel.id}
                    className="flex-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                  >
                    {deleting === hotel.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}