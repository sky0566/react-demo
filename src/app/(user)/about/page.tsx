import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us - Suzhou Gallop Technology Co., Ltd.',
  description:
    'Learn about Suzhou Gallop Technology Co., Ltd. - A professional One-Stop elevator and escalator solution plan supplier with global service.',
  alternates: { canonical: 'https://www.gallopliftparts.com/about' },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Suzhou Gallop Technology Co., Ltd.',
      description: 'Professional One-Stop elevator and escalator solution plan supplier.',
      foundingDate: '2015',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No.128 Jinji Lake Rod',
        addressLocality: 'Suzhou',
        addressCountry: 'CN',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-[#e2e5e7]" aria-label="Breadcrumb">
        <div className="max-w-[1290px] mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-[14px] text-[#666]">
            <li><Link href="/" className="hover:text-[#046db1]">Home</Link></li>
            <li><span className="mx-1">/</span></li>
            <li className="text-[#222] font-medium">About Us</li>
          </ol>
        </div>
      </nav>

      {/* Page Title */}
      <section className="bg-white border-b border-[#e2e5e7]">
        <div className="max-w-[1290px] mx-auto px-6 py-10">
          <h1 className="text-[32px] font-[900] text-[#222]">About Us</h1>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-12">
        <div className="max-w-[1290px] mx-auto px-6">
          <div className="bg-white border border-[#e2e5e7] p-8 lg:p-12">
            <h2 className="text-[26px] font-medium text-[#222] mb-4">Who We Are</h2>
            <p className="text-[16px] text-[#555] leading-relaxed mb-4">
              Suzhou Gallop Technology Co., Ltd. is a professional &quot;One-Stop&quot; elevator and 
              escalator solution plan supplier based in Suzhou Industrial Park, China.
            </p>
            <p className="text-[16px] text-[#555] leading-relaxed mb-4">
              We are the supplier of mainstream elevator brands and the channel distributor for many 
              major foreign customers. Our company has grown to become a trusted name in the elevator 
              and escalator parts industry.
            </p>
            <p className="text-[16px] text-[#555] leading-relaxed">
              We specialize in providing high-quality replacement parts for all major elevator and
              escalator brands including Selcom, Fermator, Kone, Sword, Canny, Mitsubishi, and more.
              Our products are directly produced and shipped from our factory, ensuring the best
              quality at the most competitive prices.
            </p>
          </div>
        </div>
      </section>

      {/* Sales Network Map */}
      <section className="py-12 bg-white">
        <div className="max-w-[1290px] mx-auto px-6">
          <h2 className="text-[26px] font-medium text-[#222] text-center mb-8 uppercase">Our Sales Network</h2>
          <div className="overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
            <Image 
              src="https://www.gallopliftparts.com/wp-content/uploads/2024/04/sales-network-map.webp" 
              alt="Gallop Lift Parts Global Sales Network" 
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-[1290px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Global Customers' },
              { value: '1000+', label: 'Product SKUs' },
              { value: '20+', label: 'Brand Partners' },
              { value: '24/7', label: 'Online Service' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-8 border border-[#e2e5e7]">
                <div className="text-[36px] font-bold text-[#2B6CB0]">{stat.value}</div>
                <div className="text-[15px] text-[#555] mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Values */}
      <section className="py-12">
        <div className="max-w-[1290px] mx-auto px-6">
          <h2 className="text-[26px] font-medium text-[#222] text-center mb-10 uppercase">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Quality First',
                desc: 'Every product undergoes strict quality control to ensure reliability and performance.',
                icon: (
                  <svg className="w-12 h-12 text-[#2B6CB0]" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8z"/>
                  </svg>
                ),
              },
              {
                title: 'Global Shipping',
                desc: 'We ship products worldwide with reliable logistics partners and tracking support.',
                icon: (
                  <svg className="w-12 h-12 text-[#2B6CB0]" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64h185.4c2.2 20.4 3.3 41.8 3.3 64zm28.8-64h123.1c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6C399.4 29.2 463.1 98.8 493.4 160zM256 0c36.8 0 79.9 66.7 91.6 160H164.4C176.1 66.7 219.2 0 256 0zM110.6 160C135.1 125.6 154.9 72.1 164.9 8.4 87.1 29.2 48.9 98.8 18.6 160h92zM7.1 192h123.1c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H7.1C1.8 299.5-1 278.1-1 256s2.8-43.5 8.1-64zm11.5 160h116.7c10 63.9 29.8 117.4 55.3 151.6C112.6 482.8 48.9 413.2 18.6 352zm237.4 160c-36.8 0-79.9-66.7-91.6-160h183.2c-11.7 93.3-54.8 160-91.6 160zm135.4-8.4c25.5-34.2 45.3-87.7 55.3-151.6h116.7c-30.3 61.2-94 130.8-172 152.4z"/>
                  </svg>
                ),
              },
              {
                title: 'Technical Support',
                desc: 'Remote installation service consultation and technical support for after-sales problems.',
                icon: (
                  <svg className="w-12 h-12 text-[#2B6CB0]" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V117.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 456c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24z"/>
                  </svg>
                ),
              },
            ].map((svc) => (
              <div key={svc.title} className="bg-white border border-[#e2e5e7] p-8 text-center">
                <div className="flex justify-center mb-4">{svc.icon}</div>
                <h3 className="text-[18px] font-medium text-[#222] mb-3">{svc.title}</h3>
                <p className="text-[15px] text-[#555] leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-[1290px] mx-auto px-6 text-center">
          <h2 className="text-[26px] font-medium text-[#222] mb-4">Ready to Work With Us?</h2>
          <p className="text-[16px] text-[#555] mb-6 max-w-2xl mx-auto">
            Contact us today for a free quote on elevator and escalator parts.
            We offer competitive factory-direct pricing with worldwide shipping.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#00a6d8] hover:bg-[#046db1] text-white font-medium py-3 px-8 text-[16px] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
