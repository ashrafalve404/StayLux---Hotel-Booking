'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Hotel {
  id: number;
  name: string;
}

export default function NewPackagePage() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    hotelId: '',
    inclusions: '',
  });
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      fetch(`/api/hotels?ownerId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setHotels(data);
          if (data.length > 0) {
            setForm({ ...form, hotelId: data[0].id.toString() });
          }
        });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          duration: parseInt(form.duration),
          hotelId: parseInt(form.hotelId),
          inclusions: form.inclusions.split(',').map((s) => s.trim()),
          isActive: true,
        }),
      });

      if (res.ok) {
        router.push('/dashboard/packages');
      } else {
        alert('Failed to create package');
      }
    } catch (err) {
      alert('Error creating package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Package</h1>
        <p className="text-slate-500 mt-1">Create a new travel package</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Hotel *</label>
          <select
            required
            value={form.hotelId}
            onChange={(e) => setForm({ ...form, hotelId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select a hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Package Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Romantic Getaway"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Perfect weekend for couples..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price ($) *</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="899"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (days) *</label>
            <input
              type="number"
              required
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Inclusions (comma separated)</label>
          <input
            type="text"
            value={form.inclusions}
            onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Breakfast, Dinner, Spa"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Package'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/packages')}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}