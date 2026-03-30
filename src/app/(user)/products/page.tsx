import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getDb, type Category } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Products - Elevator & Escalator Parts',
  description: 'Browse our complete catalog of elevator and escalator parts. Selcom, Fermator, Kone, Sword, Canny, Mitsubishi and more.',
  alternates: { canonical: 'https://www.gallopliftparts.com/products' },
};

export const dynamic = 'force-dynamic';

// Category images from the original site
const categoryImages: Record<string, string> = {
  elevator: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-door.jpg',
  escalator: 'https://www.gallopliftparts.com/wp-content/uploads/2024/05/escalator-step-7.png',
  selcom: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-landing-door-right.jpg',
  fermator: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/door-controller-vf4.png',
  kone: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/KM601370-1.webp',
  sword: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/door-inverter-easy-con-1.webp',
  canny: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/elevator-integrated-door-knife-xd-cs01-3.webp',
  mitsubishi: 'https://www.gallopliftparts.com/wp-content/uploads/2024/11/ZR236-11-1.webp',
};

export default function ProductsPage() {
  const db = getDb();
  const categories = db.prepare(
    `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) as product_count 
     FROM categories c ORDER BY c.sort_order ASC`
  ).all() as (Category & { product_count: number })[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Elevator & Escalator Parts',
    description: 'Complete catalog of elevator and escalator replacement parts.',
    url: 'https://www.gallopliftparts.com/products',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categories.map((cat, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: cat.name,
        url: `https://www.gallopliftparts.com/products/${cat.slug}`,
      })),
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
          <ol className="flex items-center gap-2 text-[14px] text-[#666]" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" itemProp="item" className="hover:text-[#046db1]"><span itemProp="name">Home</span></Link>
              <meta itemProp="position" content="1" />
            </li>
            <li><span className="mx-1">/</span></li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="text-[#222] font-medium">Products</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </div>
      </nav>

      <div className="max-w-[1290px] mx-auto px-6 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-[32px] font-[900] text-[#222]">Product Categories</h1>
          <p className="mt-3 text-[#555] text-[16px]">
            Browse our extensive catalog of quality elevator and escalator parts, sourced directly from factory.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="group product-card flex flex-col"
            >
              <div className="aspect-square bg-white overflow-hidden relative">
                <Image
                  src={categoryImages[cat.slug] || '/placeholder-product.svg'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Brand logo thumbnail */}
                {cat.logo && (
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded p-1.5 shadow-sm z-10">
                    <Image
                      src={cat.logo}
                      alt={`${cat.name} logo`}
                      width={48}
                      height={24}
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="p-4 text-center border-t border-[#e2e5e7]">
                <h2 className="text-[16px] font-medium text-[#222] group-hover:text-[#046db1] transition-colors">
                  {cat.name}
                </h2>
                <p className="text-[13px] text-[#666] mt-1">{cat.product_count} products</p>
                {cat.description && (
                  <p className="text-[13px] text-[#888] mt-2 line-clamp-2">{cat.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
