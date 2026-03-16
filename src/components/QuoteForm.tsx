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
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-emerald-800 font-bold text-lg">Message Sent!</h3>
        <p className="text-emerald-600 text-sm mt-2">Thank you for your inquiry. We&apos;ll get back to you within 24 hours.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm text-emerald-700 font-medium hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-[13px] font-semibold text-[#444] mb-1.5">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] text-[15px] transition-colors bg-gray-50/50"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[13px] font-semibold text-[#444] mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] text-[15px] transition-colors bg-gray-50/50"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-[13px] font-semibold text-[#444] mb-1.5">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] text-[15px] transition-colors bg-gray-50/50"
            placeholder="+86 ..."
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-[13px] font-semibold text-[#444] mb-1.5">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] text-[15px] transition-colors bg-gray-50/50"
            placeholder="Company name"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-[13px] font-semibold text-[#444] mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] text-[15px] transition-colors bg-gray-50/50 resize-none"
          placeholder="Tell us what you need..."
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-gradient-to-r from-[#2B6CB0] to-[#0891b2] text-white py-3 font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Inquiry
          </>
        )}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">Failed to send. Please try again.</p>
      )}
    </form>
  );
}
