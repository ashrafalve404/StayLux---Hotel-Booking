'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  hotel: { name: string; id: number };
}

export default function DashboardPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    if (!userData.id) return;

    loadData(userData.id);
  }, []);

  const loadData = (ownerId: number) => {
    fetch(`http://localhost:3001/hotels?ownerId=${ownerId}`)
      .then((res) => res.json())
      .then(async (hotels) => {
        if (!hotels || hotels.length === 0) {
          setLoading(false);
          return;
        }
        
        const hotelId = hotels[0].id;
        const pkgData = await fetch(`http://localhost:3001/packages?hotelId=${hotelId}`).then((r) => r.json());
        setPackages(pkgData || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    setDeleting(id);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`http://localhost:3001/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete package');
      }
    } catch {
      alert('Error deleting package');
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
          <h1 className="text-2xl font-bold text-slate-900">Packages</h1>
          <p className="text-slate-500 mt-1">Manage your travel packages</p>
        </div>
        <Link href="/dashboard/packages/new" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          + Add Package
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 h-48 animate-pulse"></div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">No packages created yet</p>
          <Link href="/dashboard/packages/new" className="text-orange-500 hover:text-orange-600">
            Create your first package
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg">
              <h3 className="font-semibold text-slate-900">{pkg.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{pkg.hotel?.name}</p>
              <p className="text-sm text-slate-400 mt-2 line-clamp-2">{pkg.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-slate-500">{pkg.duration} days</span>
                <span className="font-bold text-orange-500">{formatCurrency(pkg.price)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/dashboard/packages/${pkg.id}`}
                  className="flex-1 text-center px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  disabled={deleting === pkg.id}
                  className="flex-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting === pkg.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}