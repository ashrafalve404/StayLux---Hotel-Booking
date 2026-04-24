'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
}

interface Booking {
  id: number;
  user: { name: string };
  hotel: { name: string };
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  status: string;
}

interface Hotel {
  id: number;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  isActive: boolean;
}

export default function AdminPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalHotels: 0, totalRevenue: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'hotels' | 'bookings'>('overview');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    const authHeaders: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    try {
      const [usersRes, bookingsRes, hotelsRes] = await Promise.all([
        fetch('http://localhost:3001/users', { headers: authHeaders }),
        fetch('http://localhost:3001/bookings', { headers: authHeaders }),
        fetch('http://localhost:3001/hotels', { headers: authHeaders }),
      ]);
      
      const usersData = usersRes.ok ? await usersRes.json() : [];
      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
      const hotelsData = hotelsRes.ok ? await hotelsRes.json() : [];
      
      const usersArray = Array.isArray(usersData) ? usersData : [];
      const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];
      const hotelsArray = Array.isArray(hotelsData) ? hotelsData : [];
        
      setUsers(usersArray);
      setBookings(bookingsArray);
      setHotels(hotelsArray);
      setStats({
        totalUsers: usersArray.length,
        totalBookings: bookingsArray.length,
        totalHotels: hotelsArray.length,
        totalRevenue: bookingsArray.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
      });
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  const handleDelete = async (type: 'users' | 'hotels' | 'bookings', id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    
    setDeleteLoading(id);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`http://localhost:3001/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        loadData();
      } else {
        alert('Failed to delete');
      }
    } catch {
      alert('Error deleting');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRoleUpdate = async (userId: number, newRole: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (res.ok) await loadData();
      else alert('Failed to update role');
    } catch {
      alert('Error updating role');
    }
  };

  const handleStatusUpdate = async (bookingId: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) await loadData();
    } catch {
      alert('Error updating status');
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users', count: stats.totalUsers },
    { key: 'hotels', label: 'Hotels', count: stats.totalHotels },
    { key: 'bookings', label: 'Bookings', count: stats.totalBookings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-slate-500">Manage platform</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab.key ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse h-24"></div>)}
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Users', value: stats.totalUsers, color: 'text-blue-600' },
                { label: 'Hotels', value: stats.totalHotels, color: 'text-orange-600' },
                { label: 'Bookings', value: stats.totalBookings, color: 'text-green-600' },
                { label: 'Revenue', value: formatCurrency(stats.totalRevenue), color: 'text-purple-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {['all', 'admin', 'owner', 'user'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                      roleFilter === role ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No users</td></tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-500">{user.id}</td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">{user.name}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                            <td className="px-4 py-3 text-sm text-slate-500">{user.phone || '-'}</td>
                            <td className="px-4 py-3">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${
                                  user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                  user.role === 'owner' ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}
                              >
                                <option value="user">User</option>
                                <option value="owner">Owner</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete('users', user.id)}
                                disabled={deleteLoading === user.id || user.role === 'admin'}
                                className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                              >
                                {deleteLoading === user.id ? '...' : 'Delete'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotels.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center col-span-full">
                  <p className="text-slate-500">No hotels</p>
                </div>
              ) : (
                hotels.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{hotel.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{hotel.city}, {hotel.country}</p>
                        <p className="text-sm font-medium text-orange-600 mt-2">{formatCurrency(hotel.pricePerNight)}/night</p>
                      </div>
                      <button
                        onClick={() => handleDelete('hotels', hotel.id)}
                        disabled={deleteLoading === hotel.id}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      >
                        {deleteLoading === hotel.id ? '...' : 'Delete'}
                      </button>
                    </div>
                    <div className={`text-xs mt-2 ${hotel.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {hotel.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Hotel</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Guest</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Dates</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No bookings</td></tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-500">{booking.id}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{booking.hotel?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{booking.user?.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">
                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{formatCurrency(booking.totalAmount)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>{booking.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}