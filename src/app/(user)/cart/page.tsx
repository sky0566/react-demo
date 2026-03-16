'use client';

import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', company: '', message: '' });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleDownloadPDF = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/quote-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gallop-Quote-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch { /* ignore */ }
    setGenerating(false);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/quote-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, ...emailForm }),
      });
      if (res.ok) {
        setEmailSent(true);
        setShowEmailForm(false);
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  if (items.length === 0 && !emailSent) {
    return (
      <div className="max-w-[1290px] mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#222]">Your Quote List is Empty</h1>
        <p className="text-[#888] mt-3">Add products to your quote list to request pricing.</p>
        <Link href="/products" className="inline-block mt-6 bg-[#2B6CB0] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#225a9a] transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="max-w-[1290px] mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#222]">Quote Request Sent!</h1>
        <p className="text-[#888] mt-3">We&apos;ll send you a detailed quote within 24 hours.</p>
        <Link href="/products" className="inline-block mt-6 bg-[#2B6CB0] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#225a9a] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-[#e2e5e7]">
        <div className="max-w-[1290px] mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-[14px] text-[#666]">
            <li><Link href="/" className="hover:text-[#046db1]">Home</Link></li>
            <li><span className="mx-1">/</span></li>
            <li className="text-[#222] font-medium">Quote List</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-[1290px] mx-auto px-6 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-[900] text-[#222]">Quote List</h1>
            <p className="text-[#888] text-[14px] mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your quote list</p>
          </div>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image || '/placeholder-product.svg'} alt={item.name} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#222] text-[15px] truncate">{item.name}</h3>
                  <p className="text-[12px] text-[#aaa] mt-0.5">SKU: {item.sku}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-medium text-[#222] border-x border-gray-200 min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-[#222] text-[17px] mb-4">Request Quote</h2>
              <div className="space-y-3">
                {/* Download PDF */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#2B6CB0] text-[#2B6CB0] py-3 rounded-lg font-medium hover:bg-[#f0f7ff] transition-colors disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#2B6CB0]/30 border-t-[#2B6CB0] rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </>
                  )}
                </button>

                {/* Send Email */}
                <button
                  onClick={() => setShowEmailForm(!showEmailForm)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2B6CB0] to-[#0891b2] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send via Email
                </button>
              </div>
            </div>

            {/* Email Form */}
            {showEmailForm && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-[#222] text-[15px] mb-4">Your Information</h3>
                <form onSubmit={handleSendEmail} className="space-y-3">
                  <input
                    type="text" required placeholder="Your Name *"
                    value={emailForm.name} onChange={e => setEmailForm({ ...emailForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] bg-gray-50/50"
                  />
                  <input
                    type="email" required placeholder="Email Address *"
                    value={emailForm.email} onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] bg-gray-50/50"
                  />
                  <input
                    type="text" placeholder="Company"
                    value={emailForm.company} onChange={e => setEmailForm({ ...emailForm, company: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] bg-gray-50/50"
                  />
                  <textarea
                    placeholder="Additional notes..."
                    rows={3}
                    value={emailForm.message} onChange={e => setEmailForm({ ...emailForm, message: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2B6CB0]/20 focus:border-[#2B6CB0] bg-gray-50/50 resize-none"
                  />
                  <button
                    type="submit" disabled={sending}
                    className="w-full bg-[#2B6CB0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#225a9a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : 'Send Quote Request'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
