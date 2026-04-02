import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Support - Gallop Lift Parts | 24/7 Global Service',
  description:
    'We support you 24/7 wherever you are. DHL, FEDEX, and sea shipping options for elevator and escalator parts worldwide.',
  alternates: { canonical: 'https://www.gallopliftparts.com/support' },
};

const shippingOptions = [
  {
    title: 'DHL Express',
    description:
      'If the order is less than 100kg and has strict requirements on transportation time, we can choose DHL to deliver it directly to your company. But only for some countries, sanctioned countries do not support DHL.',
    icon: (
      <svg className="w-10 h-10 text-[#2B6CB0]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  {
    title: 'FEDEX',
    description:
      'If the order is less than 100kg, we can also choose FEDEX to deliver it directly to your company. The difference from DHL is that there are very few restricted countries and the price is cheaper than DHL, but the time will be one to two days longer than DHL.',
    icon: (
      <svg className="w-10 h-10 text-[#2B6CB0]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: 'Sea Shipping',
    description:
      'If the product you purchase is larger than 100KG and the transportation time is not high, you can choose container consolidation. Or if you need one or several 20GP or 40HQ full containers for transportation, you can choose sea shipping. We have a stable freight forwarder who can ensure the safe arrival of the entire transportation.',
    icon: (
      <svg className="w-10 h-10 text-[#2B6CB0]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

export default function SupportPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2B6CB0] to-[#1a4f8a] text-white py-16">
        <div className="max-w-[1290px] mx-auto px-6 text-center">
          <h1 className="text-[36px] font-bold mb-4">We support you 24/7 wherever you are</h1>
          <p className="text-white/80 text-[16px] max-w-2xl mx-auto">
            Suzhou Gallop Technology Co., Ltd. is a professional &quot;One-Stop&quot; elevator and escalator solution plan supplier.
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="max-w-[1290px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {shippingOptions.map((option) => (
            <div key={option.title} className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{option.icon}</div>
              <h2 className="text-[20px] font-bold text-[#222] mb-3">{option.title}</h2>
              <p className="text-[#555] text-[15px] leading-relaxed">{option.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#f7f8fa] py-12">
        <div className="max-w-[1290px] mx-auto px-6">
          <h2 className="text-[28px] font-bold text-[#222] text-center mb-8">Why Choose Gallop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Global Service 24/7', desc: 'Round-the-clock support for customers worldwide' },
              { title: 'Best Quality', desc: 'All products pass ISO9001 and CE standards' },
              { title: 'Competitive Price', desc: 'Lowest price for all elevator & escalator parts' },
              { title: 'After-Sale Warranty', desc: 'Complete technical support and warranty service' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-12 h-12 bg-[#2B6CB0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#222] text-[16px] mb-2">{item.title}</h3>
                <p className="text-[#666] text-[14px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
