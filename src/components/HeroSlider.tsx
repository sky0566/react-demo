'use client';

import { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    src: 'https://www.gallopliftparts.com/wp-content/uploads/2024/03/gallop.webp',
    alt: 'Gallop Lift Parts - Professional Elevator & Escalator Parts Supplier',
  },
  {
    src: 'https://www.gallopliftparts.com/wp-content/uploads/2024/03/one.webp',
    alt: 'One-Stop Elevator Solution',
  },
  {
    src: 'https://www.gallopliftparts.com/wp-content/uploads/2024/03/three.webp',
    alt: 'Quality Elevator Parts',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="hero-slider w-full" style={{ aspectRatio: '2500 / 900' }}>
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`hero-slide ${idx === current ? 'active' : ''}`}
          style={{ position: idx === 0 ? 'relative' : 'absolute' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      
      {/* Slider dots */}
      <div className="slider-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
