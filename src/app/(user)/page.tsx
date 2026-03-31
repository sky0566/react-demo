import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import HeroSlider from '@/components/HeroSlider';
import { getDb } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Gallop Lift Parts - Professional Elevator & Escalator Parts Supplier',
  description:
    'Suzhou Gallop Technology Co., Ltd. - Professional One-Stop elevator and escalator solution plan supplier. Quality parts for Selcom, Fermator, Kone, Sword, Canny, Mitsubishi.',
  alternates: { canonical: 'https://www.gallopliftparts.com' },
};

const features = [
  {
    // Globe icon - Global Service
    icon: (
      <svg className="w-[50px] h-[50px] text-[#2B6CB0]" fill="currentColor" viewBox="0 0 512 512">
        <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64h185.4c2.2 20.4 3.3 41.8 3.3 64zm28.8-64h123.1c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6C399.4 29.2 463.1 98.8 493.4 160zM256 0c36.8 0 79.9 66.7 91.6 160H164.4C176.1 66.7 219.2 0 256 0zM110.6 160C135.1 125.6 154.9 72.1 164.9 8.4 87.1 29.2 48.9 98.8 18.6 160h92zM7.1 192h123.1c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H7.1C1.8 299.5-1 278.1-1 256s2.8-43.5 8.1-64zm11.5 160h116.7c10 63.9 29.8 117.4 55.3 151.6C112.6 482.8 48.9 413.2 18.6 352zm237.4 160c-36.8 0-79.9-66.7-91.6-160h183.2c-11.7 93.3-54.8 160-91.6 160zm135.4-8.4c25.5-34.2 45.3-87.7 55.3-151.6h116.7c-30.3 61.2-94 130.8-172 152.4z"/>
      </svg>
    ),
    title: 'Global Service',
    description: 'Our company has a number of small language teams to facilitate communication and service.',
  },
  {
    // Gem icon - Best Quality
    icon: (
      <svg className="w-[50px] h-[50px] text-[#2B6CB0]" fill="currentColor" viewBox="0 0 512 512">
        <path d="M116.7 33.8c1.6-3.4 5.1-5.8 9-5.8h260.6c3.9 0 7.4 2.4 9 5.8l67.3 142.4c2.4 5.1 1.6 11.1-2.3 15.3L269.7 401.1c-5.9 6.3-15.6 6.3-21.4 0L57.7 191.5c-3.9-4.2-4.7-10.2-2.3-15.3L116.7 33.8zM261 72l-85 96h170L261 72zm-85 128l85 152 85-152H176z"/>
      </svg>
    ),
    title: 'Best Quality',
    description: 'We are the supplier of mainstream brands and the channel distributor for many major foreign customers.',
  },
  {
    // Headphones icon - 24/7 Online Service
    icon: (
      <svg className="w-[50px] h-[50px] text-[#2B6CB0]" fill="currentColor" viewBox="0 0 512 512">
        <path d="M256 48C141.1 48 48 141.1 48 256v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V256C0 114.6 114.6 0 256 0S512 114.6 512 256v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V256C464 141.1 370.9 48 256 48zM80 256v32c0 35.3 28.7 64 64 64h16c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32h-16c-7.4 0-14.4 1.3-20.9 3.5C130 168.4 187 112 256 112s126 56.4 132.9 143.5C382.4 253.3 375.4 252 368 252h-16c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h16c35.3 0 64-28.7 64-64V256c0-97.2-78.8-176-176-176S80 158.8 80 256z"/>
      </svg>
    ),
    title: '24/7 Online Service',
    description: 'Our company provides 24/7 online service, feel free to contact us anytime.',
  },
  {
    // Shield icon - After-Sale Warranty
    icon: (
      <svg className="w-[50px] h-[50px] text-[#2B6CB0]" fill="currentColor" viewBox="0 0 512 512">
        <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8z"/>
      </svg>
    ),
    title: 'After-Sale Warranty',
    description: 'Quality assurance for products within warranty period. Return or exchange at any time for quality problems.',
  },
  {
    // Wrench icon - Technical Support
    icon: (
      <svg className="w-[50px] h-[50px] text-[#2B6CB0]" fill="currentColor" viewBox="0 0 512 512">
        <path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V117.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 456c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24z"/>
      </svg>
    ),
    title: 'Technical Support',
    description: 'Remote installation service consultation and technical support for after-sales problems.',
  },
  {
    // Yen-sign / Dollar icon - Best Price
    icon: (
      <svg className="w-[50px] h-[50px] text-[#2B6CB0]" fill="currentColor" viewBox="0 0 320 512">
        <path d="M160 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 22 35.9 41c8.3 19.2 10.1 41.3 5.2 67.4c-7.3 39.2-31.7 62.1-62 74.4c-12.6 5.1-26.2 8.2-40.2 9.6V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3c-16.1-7.2-23.4-26.1-16.2-42.2s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C119.4 279.3 84.4 270 58.4 253c-14.2-9.3-27.5-22-35.8-41.1c-8.4-19.2-10.1-41.3-5.2-67.4C25.7 104.9 51.1 82.1 82 70c14.8-5.8 31-9.3 46-11V32c0-17.7 14.3-32 32-32z"/>
      </svg>
    ),
    title: 'Best Price',
    description: 'Products are directly produced and shipped by factory with the lowest price.',
  },
];



export default function HomePage() {
  // Fetch data from database (server component)
  const db = getDb();
  const partners = db.prepare(
    'SELECT * FROM partners WHERE is_active = 1 ORDER BY sort_order ASC'
  ).all() as { id: string; name: string; logo: string; website: string; sort_order: number }[];

  const dbCategories = db.prepare(
    `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) as product_count
     FROM categories c ORDER BY c.sort_order ASC`
  ).all() as { id: string; name: string; slug: string; image: string; logo: string; sort_order: number; product_count: number }[];

  // Fallback images for categories without custom images
  const defaultImages: Record<string, string> = {
    elevator: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-door.jpg',
    escalator: 'https://www.gallopliftparts.com/wp-content/uploads/2024/05/escalator-step-7.png',
    selcom: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-landing-door-right.jpg',
    fermator: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/door-controller-vf4.png',
    kone: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/KM601370-1.webp',
    sword: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/door-inverter-easy-con-1.webp',
    canny: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/elevator-integrated-door-knife-xd-cs01-3.webp',
    mitsubishi: 'https://www.gallopliftparts.com/wp-content/uploads/2024/11/ZR236-11-1.webp',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Suzhou Gallop Technology Co., Ltd.',
    url: 'https://www.gallopliftparts.com',
    logo: 'https://www.gallopliftparts.com/wp-content/uploads/2024/03/logo-text.png',
    description: 'Professional One-Stop elevator and escalator solution plan supplier.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No.128 Jinji Lake Rod',
      addressLocality: 'Suzhou',
      addressRegion: 'Jiangsu',
      addressCountry: 'CN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-17365368201',
      contactType: 'sales',
      email: 'info@gallopliftparts.com',
      availableLanguage: ['English', 'Chinese'],
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=100091553349498',
      'https://www.linkedin.com/company/gallop-lift/',
      'https://www.instagram.com/gallopliftparts/',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Why Choose Us */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-[1290px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[42px] font-[900] text-[#2B6CB0] uppercase tracking-wide">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center px-4"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-[18px] font-semibold text-[#2B6CB0] mb-2">{feature.title}</h3>
                <p className="text-[15px] text-[#555] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 lg:py-20 bg-[#F7F7F7]">
        <div className="max-w-[1290px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[42px] font-[900] text-[#2B6CB0] uppercase tracking-wide">Product Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
            {dbCategories.map((cat) => {
              const isEscalator = cat.slug === 'escalator';
              const catImage = cat.image || defaultImages[cat.slug] || '';
              return (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  className={`group overflow-hidden hover:shadow-lg transition-all relative ${
                    isEscalator
                      ? 'bg-gradient-to-br from-[#2B6CB0]/5 to-[#0891b2]/5 border-2 border-[#2B6CB0] ring-2 ring-[#2B6CB0]/20 shadow-md'
                      : 'bg-white border border-[#e2e5e7]'
                  }`}
                >
                  {isEscalator && (
                    <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-[#2B6CB0] to-[#0891b2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                      Hot
                    </div>
                  )}
                  <div className="aspect-[4/3] bg-white relative overflow-hidden">
                    <Image
                      src={catImage}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  </div>
                  <div className={`p-3 text-center border-t ${
                    isEscalator ? 'border-[#2B6CB0]/20 bg-gradient-to-r from-[#2B6CB0] to-[#0891b2]' : 'border-[#e2e5e7]'
                  }`}>
                    <h3 className={`font-medium text-[16px] transition-colors ${
                      isEscalator ? 'text-white font-semibold' : 'text-[#222] group-hover:text-[#046db1]'
                    }`}>{cat.name}</h3>
                    <p className={`text-[13px] mt-1 ${
                      isEscalator ? 'text-white/80' : 'text-[#666]'
                    }`}>{cat.product_count} products</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cooperation Partner */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-[1290px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[42px] font-[900] text-[#2B6CB0] uppercase tracking-wide">Cooperation Partner</h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white border border-[#e2e5e7] p-3 flex items-center justify-center aspect-[314/168] relative"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 25vw, 20vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
