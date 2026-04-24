'use client';

import { Building2, Plane, DollarSign, Globe, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WhyChooseSection() {
  const features = [
    {
      icon: Building2,
      title: 'Luxury Hotels',
      description: 'Handpicked 5-star properties with premium amenities'
    },
    {
      icon: Plane,
      title: 'Easy Booking',
      description: 'Instant confirmation with flexible cancellation'
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Price match guarantee on all bookings'
    },
    {
      icon: Globe,
      title: 'Global Destinations',
      description: '200+ destinations worldwide'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-medium mb-2">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Travel With Confidence
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Icon className="w-7 h-7 text-orange-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}