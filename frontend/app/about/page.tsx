'use client';

import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <section className="relative py-20 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-900/70"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Redefining Travel Experiences
            </h1>
            <p className="text-xl text-slate-300">
              Founded in 2024, StayLux has been at the forefront of luxury travel, 
              connecting discerning travelers with exceptional accommodations worldwide.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Excellence</h3>
                <p className="text-slate-600">We maintain the highest standards in every property we feature.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Integrity</h3>
                <p className="text-slate-600">Transparent communication and honest partnerships.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Innovation</h3>
                <p className="text-slate-600">Continuously evolving to provide cutting-edge experiences.</p>
              </div>
            </div>

            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Start Your Journey?</h3>
              <p className="text-slate-600 mb-6">
                Join thousands of satisfied travelers who have discovered their perfect stay.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
                >
                  Create Account
                </Link>
                <Link
                  href="/hotels"
                  className="px-6 py-3 bg-white text-orange-500 rounded-lg font-medium border border-orange-500 hover:bg-orange-50"
                >
                  Explore Hotels
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-slate-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">50K+</div>
                <div className="text-slate-400">Satisfied Travelers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">500+</div>
                <div className="text-slate-400">Partner Properties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">100+</div>
                <div className="text-slate-400">Cities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">4.9</div>
                <div className="text-slate-400">Average Rating</div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}