import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Company - Suzhou Gallop Technology Co., Ltd.',
  description:
    'Suzhou Gallop Technology Co., Ltd. - Professional One-Stop elevator and escalator solution plan supplier. ISO9001, ISO14000, CE certified. Global service across Europe, Middle East, South America, Southeast Asia.',
  alternates: { canonical: 'https://www.gallopliftparts.com/company' },
};

export default function CompanyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Suzhou Gallop Technology Co., Ltd.',
      description:
        'Professional One-Stop elevator and escalator solution plan supplier.',
      foundingDate: '2015',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'No.128 Jinji Lake Rod',
        addressLocality: 'Suzhou',
        addressRegion: 'Jiangsu',
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

      {/* Hero Banner */}
      <section className="relative h-[350px] lg:h-[420px] overflow-hidden">
        <Image
          src="/images/company-hero.jpg"
          alt="Elevator button close-up"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1290px] mx-auto px-6 w-full">
            <h1 className="text-[42px] font-[900] text-white uppercase">About Us</h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-[#e2e5e7]" aria-label="Breadcrumb">
        <div className="max-w-[1290px] mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-[14px] text-[#666]">
            <li>
              <Link href="/" className="hover:text-[#046db1]">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-1">/</span>
            </li>
            <li className="text-[#222] font-medium">Company</li>
          </ol>
        </div>
      </nav>

      {/* Profile Section */}
      <section className="py-12">
        <div className="max-w-[1290px] mx-auto px-6">
          <div className="bg-white border border-[#e2e5e7] p-8 lg:p-12">
            <h2 className="text-[26px] font-medium text-[#222] mb-6">Profile</h2>
            <ul className="space-y-4 text-[16px] text-[#555] leading-relaxed list-disc pl-5">
              <li>
                Located in the world elevator manufacturing center Suzhou, Jiangsu province, we are
                well equipped with advanced machinery capable of producing high quality products.
              </li>
              <li>
                We regard quality management as the foundation of enterprise, and all lift core
                products have passed ISO9001-2000, ISO14000 CE and other domestic and international
                standards.
              </li>
              <li>
                We also provide customers with a perfect technical support and after-sale services.
                For the moment, we have captured part of the market, and our products were widely
                used in various elevators by our clients from both domestic companies and overseas
                companies, and our business scope extends to Europe, Middle East, South America,
                Southeast Asia and other regions.
              </li>
              <li>
                As a professional &quot;One-Stop&quot; elevator and escalator solution plan supplier,
                Suzhou Gallop Technology Co., Ltd. integrates the elevator research, development,
                design, manufacture, sales, installation, repair, maintenance, transformation into
                one. We have accelerated reform pace and will insist on providing first class service
                as before.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Global Sales Network - earth.webp */}
      <section className="py-12 bg-white">
        <div className="max-w-[1290px] mx-auto px-6">
          <h2 className="text-[26px] font-medium text-[#222] text-center mb-8 uppercase">
            Our Sales Network
          </h2>
          <div className="overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
            <Image
              src="/images/earth.webp"
              alt="Gallop Lift Parts Global Sales Network - serving clients across Europe, Middle East, South America, Southeast Asia, Oceania and more"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="max-w-[1290px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Global Customers' },
              { value: '1000+', label: 'Product SKUs' },
              { value: '20+', label: 'Brand Partners' },
              { value: '24/7', label: 'Online Service' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center py-8 bg-white border border-[#e2e5e7]"
              >
                <div className="text-[36px] font-bold text-[#2B6CB0]">{stat.value}</div>
                <div className="text-[15px] text-[#555] mt-2">{stat.label}</div>
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
            Contact us today for a free quote on elevator and escalator parts. We offer competitive
            factory-direct pricing with worldwide shipping.
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
