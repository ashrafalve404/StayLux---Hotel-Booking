'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewHotelPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    pricePerNight: '',
    rating: '4.5',
    reviewCount: '0',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          pricePerNight: parseFloat(form.pricePerNight),
          rating: parseFloat(form.rating),
          reviewCount: parseInt(form.reviewCount),
        }),
      });

      if (res.ok) {
        router.push('/dashboard/hotels');
      } else {
        alert('Failed to create hotel');
      }
    } catch (err) {
      alert('Error creating hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Hotel</h1>
        <p className="text-slate-500 mt-1">Create a new hotel listing</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Grand Plaza Hotel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Luxury hotel in the heart of downtown..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="123 Main Street"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="New York"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
            <input
              type="text"
              required
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="USA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price per Night ($) *</label>
            <input
              type="number"
              required
              value={form.pricePerNight}
              onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="299"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Hotel'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/hotels')}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}