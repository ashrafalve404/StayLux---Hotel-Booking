'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-slate-900/80"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-orange-400 font-medium mb-3">Special Offer</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Get 20% Off Your First Booking
        </h2>
        <p className="text-lg text-slate-300 mb-8">
          Sign up today and receive exclusive discounts on luxury hotels worldwide. 
          Limited time offer - book now!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="px-8 py-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600">
            Create Account
          </Link>
          <Link href="/hotels" className="px-8 py-4 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100">
            Browse Hotels
          </Link>
        </div>
      </div>
    </section>
  );
}