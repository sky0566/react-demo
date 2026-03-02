import { Metadata } from 'next';
import Link from 'next/link';
import { getDb, type Product } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Escalator Parts - Complete Escalator Components & Spare Parts',
  description:
    'Premium escalator parts supplier: steps, handrails, rollers, comb plates, chains, motors & more. Factory-direct pricing with worldwide shipping. Request a free quote today.',
  keywords: [
    'escalator parts',
    'escalator step',
    'escalator handrail',
    'escalator roller',
    'comb plate',
    'escalator chain',
    'escalator motor',
    'escalator maintenance',
  ],
  alternates: { canonical: 'https://www.gallopliftparts.com/products/escalator' },
  openGraph: {
    title: 'Escalator Parts | Gallop Lift Parts',
    description: 'Complete escalator components and spare parts. Factory-direct pricing, worldwide shipping.',
    url: 'https://www.gallopliftparts.com/products/escalator',
    images: [
      {
        url: 'https://www.gallopliftparts.com/wp-content/uploads/2024/05/escalator-step-7.png',
        width: 800,
        height: 600,
        alt: 'Escalator Parts',
      },
    ],
  },
};

export const dynamic = 'force-dynamic';

/* ── Product type groups for quick nav ── */
const productTypes = [
  {
    name: 'Steps & Pallets',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="28" width="16" height="6" rx="1" fill="currentColor" opacity=".8" />
        <rect x="16" y="18" width="16" height="6" rx="1" fill="currentColor" opacity=".6" />
        <rect x="28" y="8" width="16" height="6" rx="1" fill="currentColor" opacity=".4" />
        <path d="M12 34v6M28 24v6M20 24v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    keywords: ['step', 'pallet', 'demarcation'],
    description: 'Aluminum & stainless steel escalator steps and pallets for all major brands.',
  },
  {
    name: 'Rollers',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="3" />
        <circle cx="24" cy="24" r="6" fill="currentColor" opacity=".5" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </svg>
    ),
    keywords: ['roller', 'friction wheel'],
    description: 'Step rollers, handrail rollers, and friction wheels with precision bearings.',
  },
  {
    name: 'Chains',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="16" width="14" height="8" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <rect x="18" y="24" width="14" height="8" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <rect x="28" y="16" width="14" height="8" rx="4" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
    keywords: ['chain', 'rotary'],
    description: 'Rotary chains & step chains engineered for durability and precise pitch.',
  },
  {
    name: 'Comb Plates',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="10" width="36" height="8" rx="2" fill="currentColor" opacity=".3" />
        <path d="M10 18v16M16 18v16M22 18v16M28 18v16M34 18v16M40 18v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    keywords: ['comb'],
    description: 'Aluminum & plastic comb plates compatible with major escalator models.',
  },
  {
    name: 'Handrails',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M6 36C6 36 14 12 24 12s18 24 18 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M6 38C6 38 14 14 24 14s18 24 18 24" stroke="currentColor" strokeWidth="3" opacity=".3" strokeLinecap="round" />
      </svg>
    ),
    keywords: ['handrail', 'entry cover', 'entrance cover', 'frontplate'],
    description: 'Rubber handrails, entry covers, and frontplates for smooth passenger flow.',
  },
  {
    name: 'Motors & Drive',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 12v4M24 32v4M12 24h4M32 24h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="5" fill="currentColor" opacity=".5" />
        <path d="M20 24l3-5h2l3 5-3 5h-2l-3-5z" fill="currentColor" />
      </svg>
    ),
    keywords: ['motor'],
    description: 'High-performance escalator motors and drive units for reliable operation.',
  },
];

/* ── Advantages ── */
const advantages = [
  {
    title: 'Factory Direct',
    description: 'Source parts directly from our manufacturing partners, eliminating middlemen and reducing costs by up to 40%.',
    icon: '🏭',
  },
  {
    title: 'OEM Compatible',
    description: 'All parts are designed to be 100% compatible with major escalator brands: OTIS, Schindler, KONE, Mitsubishi, and more.',
    icon: '✅',
  },
  {
    title: 'Quality Certified',
    description: 'ISO 9001 certified manufacturing with comprehensive quality inspection for every shipment.',
    icon: '🏅',
  },
  {
    title: 'Global Shipping',
    description: 'Fast worldwide shipping via DHL, FedEx, or sea freight. Door-to-door delivery to 120+ countries.',
    icon: '🌍',
  },
];

export default function EscalatorPage() {
  const db = getDb();

  // Get escalator category
  const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get('escalator') as
    | { id: string; name: string; slug: string; description: string }
    | undefined;

  const products = category
    ? (db
        .prepare(
          `SELECT p.*, c.name as category_name, c.slug as category_slug
           FROM products p LEFT JOIN categories c ON p.category_id = c.id
           WHERE p.category_id = ? AND p.is_active = 1
           ORDER BY p.sort_order ASC, p.name ASC`
        )
        .all(category.id) as (Product & { category_name: string; category_slug: string })[])
    : [];

  // Group products by type
  const groupedProducts = productTypes.map((type) => ({
    ...type,
    products: products.filter((p) =>
      type.keywords.some((kw) => p.name.toLowerCase().includes(kw.toLowerCase()))
    ),
  }));

  // Products that don't match any group
  const groupedIds = new Set(groupedProducts.flatMap((g) => g.products.map((p) => p.id)));
  const otherProducts = products.filter((p) => !groupedIds.has(p.id));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Escalator Parts',
    description: metadata.description,
    url: 'https://www.gallopliftparts.com/products/escalator',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          sku: p.sku,
          url: `https://www.gallopliftparts.com/product/${p.slug}`,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════ Hero Banner ═══════ */}
      <section className="relative bg-gradient-to-br from-[#1a365d] via-[#2B6CB0] to-[#2c5282] overflow-hidden">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-[1290px] mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol
                  className="flex items-center gap-2 text-[14px] text-white/70"
                  itemScope
                  itemType="https://schema.org/BreadcrumbList"
                >
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href="/" itemProp="item" className="hover:text-white transition-colors">
                      <span itemProp="name">Home</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                  </li>
                  <li>
                    <span className="mx-1">/</span>
                  </li>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href="/products" itemProp="item" className="hover:text-white transition-colors">
                      <span itemProp="name">Products</span>
                    </Link>
                    <meta itemProp="position" content="2" />
                  </li>
                  <li>
                    <span className="mx-1">/</span>
                  </li>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name" className="text-white font-medium">
                      Escalator
                    </span>
                    <meta itemProp="position" content="3" />
                  </li>
                </ol>
              </nav>

              <h1 className="text-[36px] md:text-[48px] font-[900] text-white leading-tight">
                Escalator Parts
                <span className="block text-[20px] md:text-[24px] font-[400] text-white/80 mt-2">
                  & Components
                </span>
              </h1>
              <p className="mt-5 text-[16px] md:text-[18px] text-white/80 leading-relaxed max-w-xl">
                Complete range of escalator spare parts including steps, handrails, rollers, comb plates,
                chains, and motors. Compatible with all major brands — factory-direct pricing with
                worldwide shipping.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#00a6d8] text-white font-semibold rounded-sm hover:bg-[#0090be] transition-colors text-[15px]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Request a Quote
                </Link>
                <a
                  href="#all-products"
                  className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-medium rounded-sm hover:bg-white/10 transition-colors text-[15px]"
                >
                  Browse All {products.length} Products
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-[13px] text-white/60">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  OEM Compatible
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Quality Certified
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  120+ Countries
                </span>
              </div>
            </div>

            {/* Right: Featured image */}
            <div className="hidden lg:flex justify-center relative">
              <div className="relative w-[420px] h-[380px]">
                <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://www.gallopliftparts.com/wp-content/uploads/2024/05/escalator-step-7.png"
                  alt="Escalator Step Parts"
                  className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] object-contain drop-shadow-2xl"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-2 -left-2 bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00a6d8] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {products.length}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#222]">Products Available</p>
                  <p className="text-[11px] text-[#888]">Ready to ship worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Product Type Quick Nav ═══════ */}
      <section className="bg-white border-b border-[#e2e5e7]">
        <div className="max-w-[1290px] mx-auto px-6 py-10">
          <h2 className="text-[22px] font-[700] text-[#222] text-center mb-2">Browse by Component Type</h2>
          <p className="text-[15px] text-[#666] text-center mb-8">
            Find the exact parts you need — organized by escalator component category
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {groupedProducts.map((type) => (
              <a
                key={type.name}
                href={`#type-${type.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="group flex flex-col items-center text-center p-5 rounded-xl border border-[#e2e5e7] hover:border-[#2B6CB0] hover:shadow-md transition-all duration-200"
              >
                <div className="text-[#2B6CB0] group-hover:text-[#046db1] transition-colors mb-3">
                  {type.icon}
                </div>
                <h3 className="text-[14px] font-[600] text-[#222] group-hover:text-[#046db1] transition-colors">
                  {type.name}
                </h3>
                <span className="text-[12px] text-[#888] mt-1">{type.products.length} products</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Product Sections by Type ═══════ */}
      <div className="max-w-[1290px] mx-auto px-6 py-10 space-y-12">
        {groupedProducts
          .filter((g) => g.products.length > 0)
          .map((group) => (
            <section
              key={group.name}
              id={`type-${group.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="scroll-mt-24"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2B6CB0]/10 flex items-center justify-center text-[#2B6CB0]">
                    {group.icon}
                  </div>
                  <div>
                    <h2 className="text-[22px] font-[700] text-[#222]">{group.name}</h2>
                    <p className="text-[14px] text-[#666] mt-0.5">{group.description}</p>
                  </div>
                </div>
                <span className="text-[13px] text-[#888] bg-[#f5f5f5] px-3 py-1 rounded-full whitespace-nowrap">
                  {group.products.length} products
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {group.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}

        {/* Other products that don't match any group */}
        {otherProducts.length > 0 && (
          <section id="type-other" className="scroll-mt-24">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[22px] font-[700] text-[#222]">Other Escalator Parts</h2>
                <p className="text-[14px] text-[#666] mt-0.5">
                  Additional escalator components and accessories
                </p>
              </div>
              <span className="text-[13px] text-[#888] bg-[#f5f5f5] px-3 py-1 rounded-full">
                {otherProducts.length} products
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {otherProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ═══════ All Products Grid (anchor) ═══════ */}
      <section id="all-products" className="scroll-mt-24 bg-white border-t border-[#e2e5e7]">
        <div className="max-w-[1290px] mx-auto px-6 py-12">
          <h2 className="text-[26px] font-[700] text-[#222] text-center mb-2">
            All Escalator Parts
          </h2>
          <p className="text-[15px] text-[#666] text-center mb-8">
            Complete catalog — {products.length} products available
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Advantages Section ═══════ */}
      <section className="bg-[#f9fafb] border-t border-[#e2e5e7]">
        <div className="max-w-[1290px] mx-auto px-6 py-14">
          <h2 className="text-[26px] font-[700] text-[#222] text-center mb-2">
            Why Choose Gallop for Escalator Parts?
          </h2>
          <p className="text-[15px] text-[#666] text-center mb-10 max-w-2xl mx-auto">
            With over a decade of experience in the elevator &amp; escalator industry, we deliver
            quality parts with unmatched service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv) => (
              <div
                key={adv.title}
                className="bg-white rounded-xl p-6 border border-[#e2e5e7] hover:shadow-md transition-shadow"
              >
                <div className="text-[32px] mb-3">{adv.icon}</div>
                <h3 className="text-[16px] font-[600] text-[#222] mb-2">{adv.title}</h3>
                <p className="text-[14px] text-[#666] leading-relaxed">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA Banner ═══════ */}
      <section className="bg-gradient-to-r from-[#1a365d] to-[#2B6CB0]">
        <div className="max-w-[1290px] mx-auto px-6 py-14 text-center">
          <h2 className="text-[28px] font-[700] text-white mb-3">
            Need Escalator Parts? Get a Free Quote Today
          </h2>
          <p className="text-[16px] text-white/80 max-w-2xl mx-auto mb-8">
            Tell us the parts you need and we&apos;ll provide competitive pricing within 24 hours.
            Bulk orders welcome — special discounts for maintenance companies.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00a6d8] text-white font-semibold rounded-sm hover:bg-[#0090be] transition-colors text-[15px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Us Now
            </Link>
            <a
              href="https://wa.me/8617365368201"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25D366] text-white font-semibold rounded-sm hover:bg-[#20bd5a] transition-colors text-[15px]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
