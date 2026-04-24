'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  description: string;
  price: number;
  capacity: number;
  status: string;
}

interface Hotel {
  id: number;
  name: string;
  description: string;
  city: string;
  country: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  amenities: string;
  policies: string;
}

const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
];

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'rooms'>('details');

  useEffect(() => {
    if (!params.id) return;

    Promise.all([
      fetch(`http://localhost:3001/hotels/${params.id}`).then((res) => res.json()),
      fetch(`http://localhost:3001/hotels/${params.id}/rooms`).then((res) => res.ok ? res.json() : []),
    ])
      .then(([hotelData, roomsData]) => {
        setHotel(hotelData);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-100 rounded-xl"></div>;
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Hotel not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/dashboard/hotels')} className="text-slate-500 hover:text-slate-700">
          ← Back to Hotels
        </button>
        <button onClick={() => router.push(`/dashboard/hotels/${hotel.id}/edit`)} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Edit Hotel
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'details' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500'}`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'rooms' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500'}`}
        >
          Rooms ({rooms.length})
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="h-64 bg-slate-100">
            <img src={hotelImages[hotel.id % hotelImages.length]} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{hotel.name}</h1>
              <p className="text-slate-500">{hotel.city}, {hotel.country}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="font-bold text-orange-500">{formatCurrency(hotel.pricePerNight)}/night</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Rating</p>
                <p className="font-medium text-slate-900">★ {hotel.rating}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Reviews</p>
                <p className="font-medium text-slate-900">{hotel.reviewCount}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Description</p>
              <p className="text-slate-700">{hotel.description}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Amenities</p>
              <p className="text-slate-700">{hotel.amenities || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Policies</p>
              <p className="text-slate-700">{hotel.policies || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Rooms</h2>
            <button onClick={() => router.push(`/dashboard/hotels/${hotel.id}/rooms/new`)} className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600">
              + Add Room
            </button>
          </div>
          {rooms.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500">No rooms yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Room #</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Capacity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900">{room.roomNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{room.roomType}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{room.description}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatCurrency(room.price)}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{room.capacity}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          room.status === 'available' ? 'bg-green-100 text-green-700' :
                          room.status === 'occupied' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}