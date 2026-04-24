'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  pricePerNight: number;
  rating: number;
  amenities: string;
  policies: string;
  images: string[];
}

export default function EditHotelPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [form, setForm] = useState<Hotel>({
    id: 0,
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    pricePerNight: 0,
    rating: 0,
    amenities: '',
    policies: '',
    images: [],
  });

  useEffect(() => {
    if (!params.id) return;
    
    fetch(`/api/hotels/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setImagePreview(data.images?.[0] || '');
        setImageUrl(data.images?.[0] || '');
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setForm({ ...form, images: [reader.result as string] });
        setImageUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setForm({ ...form, images: [url] });
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/hotels/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(`/dashboard/hotels/${params.id}`);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update');
      }
    } catch (err) {
      alert('Error updating hotel');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-100 rounded-xl"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push(`/dashboard/hotels/${params.id}`)} className="text-slate-500 hover:text-slate-700">
          ← Back to Hotel
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">Edit Hotel</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Image</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <div className="flex items-center gap-2">
                <span className="text-slate-400">or</span>
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            {(imagePreview || form.images?.[0]) && (
              <img src={imagePreview || form.images?.[0]} alt="Hotel" className="mt-2 h-32 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price per Night ($)</label>
              <input
                type="number"
                value={form.pricePerNight}
                onChange={(e) => setForm({ ...form, pricePerNight: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amenities</label>
            <textarea
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Free WiFi, Pool, Gym..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Policies</label>
            <textarea
              value={form.policies}
              onChange={(e) => setForm({ ...form, policies: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Check-in: 3PM, Check-out: 11AM..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/hotels/${params.id}`)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}