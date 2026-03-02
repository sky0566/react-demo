'use client';

import { useState } from 'react';

interface QuoteFormProps {
  productId?: string;
  productName?: string;
}

export default function QuoteForm({ productId, productName }: QuoteFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: productName ? `I'm interested in ${productName}. Please send me a quote.` : '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product_id: productId }),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-green-800 font-semibold text-lg">Thank you!</h3>
        <p className="text-green-600 text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-green-700 underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-[14px] font-medium text-[#555] mb-1">
            Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-[#e2e5e7] focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent text-[15px]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[14px] font-medium text-[#555] mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-[#e2e5e7] focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent text-[15px]"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-[14px] font-medium text-[#555] mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 border border-[#e2e5e7] focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent text-[15px]"
            placeholder="+86 ..."
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-[14px] font-medium text-[#555] mb-1">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-3 py-2 border border-[#e2e5e7] focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent text-[15px]"
            placeholder="Company name"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-[14px] font-medium text-[#555] mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-3 py-2 border border-[#e2e5e7] focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent text-[15px]"
          placeholder="Tell us what you need..."
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#00a6d8] text-white py-3 font-medium hover:bg-[#0090be] transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">Failed to send. Please try again.</p>
      )}
    </form>
  );
}
