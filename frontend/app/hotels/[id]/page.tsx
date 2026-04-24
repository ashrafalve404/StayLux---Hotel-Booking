'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Hotel {
  id: number;
  name: string;
  description: string;
  city: string;
  country: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  amenities?: string[];
  rooms?: any[];
}

interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  price: number;
  capacity: number;
  status: string;
}

const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
];

export default function HotelDetailPage() {
  const params = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    
    Promise.all([
      fetch(`http://localhost:3001/hotels/${params.id}`).then((res) => res.ok ? res.json() : null),
      fetch(`http://localhost:3001/hotels/${params.id}/rooms`).then((res) => res.ok ? res.json() : []),
    ])
      .then(([hotelData, roomsData]) => {
        if (hotelData) {
          setHotel(hotelData);
          setRooms(Array.isArray(roomsData) ? roomsData : []);
        } else {
          setError('Hotel not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Hotel not found');
        setLoading(false);
      });
  }, [params.id]);

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.id) {
      alert('Please login to book a hotel');
      window.location.href = '/auth/login';
      return;
    }

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      alert('Please select dates');
      return;
    }

    setBookingLoading(true);

    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    let roomId = selectedRoom;
    let pricePerNight = hotel?.pricePerNight || 0;
    
    if (!roomId && rooms.length > 0) {
      const availableRoom = rooms.find((r) => r.status === 'available');
      if (availableRoom) {
        roomId = availableRoom.id;
        pricePerNight = availableRoom.price;
      }
    }

    const totalAmount = pricePerNight * nights;

    try {
      const res = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId: Number(params.id),
          roomId: roomId || 1,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          guests: bookingData.guests,
          totalAmount,
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create booking');
      }
    } catch (err) {
      alert('Error creating booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate || !selectedRoom) return 0;
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const room = rooms.find((r) => r.id === selectedRoom);
    return (room?.price || hotel?.pricePerNight || 0) * nights;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-slate-50 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="h-96 bg-slate-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-8 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-slate-50 pt-20">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Hotel Not Found</h1>
              <p className="text-slate-500 mb-4">The hotel you're looking for doesn't exist.</p>
              <Link href="/hotels" className="text-orange-500 hover:text-orange-600">
                Browse all hotels
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
              <p className="text-slate-500 mb-6">Your booking has been successfully created. You can view it in your profile.</p>
              <div className="flex gap-3 justify-center">
                <Link href="/profile" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  View My Bookings
                </Link>
                <Link href="/hotels" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                  Browse More Hotels
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
          <div className="mb-4">
            <Link href="/hotels" className="text-sm text-slate-500 hover:text-orange-500">
              ← Back to Hotels
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-80 bg-slate-100 relative">
              <img
                src={hotelImages[hotel.id % hotelImages.length]}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{hotel.name}</h1>
                  <p className="text-slate-500">{hotel.city}, {hotel.country}</p>
                </div>
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-lg">
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-slate-900">{hotel.rating}</span>
                  <span className="text-sm text-slate-500">({hotel.reviewCount} reviews)</span>
                </div>
              </div>

              <p className="text-slate-600 mb-6">{hotel.description}</p>

              {rooms.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Available Rooms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rooms.filter((r) => r.status === 'available').map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRoom === room.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-900">{room.roomType}</span>
                          <span className="font-bold text-orange-500">{formatCurrency(room.price)}</span>
                        </div>
                        <div className="text-sm text-slate-500">
                          Room {room.roomNumber} • Capacity: {room.capacity} guests
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <span className="text-sm text-slate-500">Starting from</span>
                  <p className="text-3xl font-bold text-orange-500">{formatCurrency(hotel.pricePerNight)}</p>
                  <span className="text-sm text-slate-500">/ night</span>
                </div>
                <button
                  onClick={() => setShowBooking(!showBooking)}
                  className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {showBooking && (
            <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Complete Your Booking</h2>
              <form onSubmit={handleBookNow} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Check-in Date</label>
                    <input
                      type="date"
                      value={bookingData.checkInDate}
                      onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Check-out Date</label>
                    <input
                      type="date"
                      value={bookingData.checkOutDate}
                      onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                      min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Guests</label>
                  <select
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: +e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Total</span>
                    <span className="font-bold text-lg text-orange-500">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading || !selectedRoom}
                  className="w-full px-4 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}