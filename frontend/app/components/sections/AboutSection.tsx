'use client';

import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80"
              alt="Luxury travel"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm">Years Experience</div>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-medium mb-3">About StayLux</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              We Make Your Travel Dreams Come True
            </h2>
            <p className="text-slate-600 mb-6">
              StayLux connects travelers with the world&apos;s most extraordinary accommodations. 
              From beachfront paradises to mountain retreats, we curate exclusive experiences 
              for the modern traveler.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-orange-500" strokeWidth={2} />
                </div>
                <span className="text-slate-700 font-medium">Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-orange-500" strokeWidth={2} />
                </div>
                <span className="text-slate-700 font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-orange-500" strokeWidth={2} />
                </div>
                <span className="text-slate-700 font-medium">Free Cancellation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-orange-500" strokeWidth={2} />
                </div>
                <span className="text-slate-700 font-medium">Instant Booking</span>
              </div>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}