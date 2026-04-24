'use client';

import { useState, useEffect } from 'react';

interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  status: string;
  hotel: { name: string; id: number };
  user: { name: string; email: string };
}

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    if (!userData.id) return;

    loadBookings(userData.id);
  }, []);

  const loadBookings = async (ownerId: number) => {
    try {
      const hotelsRes = await fetch(`http://localhost:3001/hotels?ownerId=${ownerId}`);
      const hotels = await hotelsRes.json();
      
      if (!hotels || hotels.length === 0) {
        setLoading(false);
        return;
      }
      
      const allBookings: Booking[] = [];
      
      for (const hotel of hotels) {
        const bookingsRes = await fetch(`http://localhost:3001/bookings?hotelId=${hotel.id}`);
        const hotelBookings = await bookingsRes.json();
        if (hotelBookings) allBookings.push(...hotelBookings);
      }
      
      setBookings(allBookings);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setUpdating(bookingId);
    
    try {
      const res = await fetch(`http://localhost:3001/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch {
      alert('Error updating booking');
    } finally {
      setUpdating(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-500 mt-1">View and manage reservation requests</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1.5 text-sm rounded-lg ${filter === status ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse h-20"></div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No bookings found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Hotel</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Guest</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Dates</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Guests</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{booking.hotel?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div>{booking.user?.name || 'N/A'}</div>
                      <div className="text-xs text-slate-400">{booking.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{booking.guests}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatCurrency(booking.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                        disabled={updating === booking.id}
                        className="text-sm border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}