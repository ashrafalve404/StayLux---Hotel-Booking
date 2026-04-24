'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  inclusions: string;
  hotel: { id: number; name: string };
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    inclusions: '',
  });

  useEffect(() => {
    const id = params.id;
    if (!id) return;
    
    fetch(`http://localhost:3001/packages/${id}`)
      .then((res) => {
        if (!res.ok) {
          setError('Package not found');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setPkg(data);
          setForm({
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            duration: data.duration || 0,
            inclusions: data.inclusions || '',
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error loading package');
        setLoading(false);
      });
  }, [params.id]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token || !params.id) return;

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/packages/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const updated = await res.json();
        setPkg(updated);
        setEditing(false);
      } else {
        alert('Failed to update package');
      }
    } catch {
      alert('Error updating package');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-100 rounded-xl"></div>;
  }

  if (error || !pkg) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{error || 'Package not found'}</p>
        <button onClick={() => router.push('/dashboard/packages')} className="mt-4 text-orange-500 hover:text-orange-600">
          Back to Packages
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/dashboard/packages')} className="text-slate-500 hover:text-slate-700">
          ← Back to Packages
        </button>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          {editing ? 'Cancel' : 'Edit Package'}
        </button>
      </div>

      {editing ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h1 className="text-xl font-bold text-slate-900 mb-6">Edit Package</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Package Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: +e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (days)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: +e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Inclusions</label>
              <textarea
                value={form.inclusions}
                onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
                rows={3}
                placeholder="Breakfast, Dinner, Spa..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{pkg.name}</h1>
              <p className="text-slate-500">{pkg.hotel?.name}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="font-bold text-orange-500">{formatCurrency(pkg.price)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Duration</p>
                <p className="font-medium text-slate-900">{pkg.duration} days</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Description</p>
              <p className="text-slate-700">{pkg.description}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Inclusions</p>
              <p className="text-slate-700">{pkg.inclusions || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}