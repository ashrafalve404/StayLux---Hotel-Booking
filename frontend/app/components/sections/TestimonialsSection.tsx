'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Frequent Traveler',
    content: 'The attention to detail and luxury accommodations exceeded every expectation. This is now our go-to platform for all our travel needs.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Adventure Enthusiast',
    content: 'I\'ve booked 12 stays through this platform and each one has been better than the last. The packages offer incredible value.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Luxury Seeker',
    content: 'Five-star service from booking to checkout. The curated hotel selection is unmatched, and the support is genuinely helpful.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Martinez',
    role: 'Business Traveler',
    content: 'Perfect for business trips. Easy booking, great locations, and reliable service every single time.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'Family Vacationer',
    content: 'Found the perfect family resort through StayLux. The kids loved it and the booking process was seamless.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-white" id="testimonials">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-2">Testimonials</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Stories From Our Guests</h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Join thousands of satisfied travelers who found their perfect stay
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 text-center">
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <blockquote className="text-lg text-slate-700 italic mb-6">
                        &quot;{testimonial.content}&quot;
                      </blockquote>
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-orange-600">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-slate-900">{testimonial.name}</div>
                          <div className="text-sm text-slate-500">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-orange-500 w-8' : 'bg-slate-300 w-2 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}