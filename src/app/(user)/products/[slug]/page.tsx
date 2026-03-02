import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb, type Product, type Category } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as Category | undefined;

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Parts - Elevator & Escalator Components`,
    description: `Browse our ${category.name} elevator and escalator parts catalog. Quality replacement parts with factory-direct pricing and worldwide shipping.`,
    alternates: { canonical: `https://www.gallopliftparts.com/products/${slug}` },
    openGraph: {
      title: `${category.name} Parts | Gallop Lift Parts`,
      description: `Quality ${category.name} elevator and escalator parts `,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const db = getDb();
  const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as Category | undefined;

  if (!category) notFound();

  const page = parseInt(pageStr || '1');
  const limit = 15;
  const offset = (page - 1) * limit;

  const total = (db.prepare(
    'SELECT COUNT(*) as c FROM products WHERE category_id = ? AND is_active = 1'
  ).get(category.id) as { c: number }).c;

  const products = db.prepare(
    `SELECT p.*, c.name as category_name, c.slug as category_slug 
     FROM products p LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.category_id = ? AND p.is_active = 1 
     ORDER BY p.sort_order ASC, p.created_at DESC 
     LIMIT ? OFFSET ?`
  ).all(category.id, limit, offset) as (Product & { category_name: string; category_slug: string })[];

  const totalPages = Math.ceil(total / limit);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Parts`,
    description: category.description,
    url: `https://www.gallopliftparts.com/products/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total,
      itemListElement: products.map((p, idx) => ({
        '@type': 'ListItem',
        position: offset + idx + 1,
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
              <Link href="/products" itemProp="item" className="hover:text-[#046db1]"><span itemProp="name">Products</span></Link>
              <meta itemProp="position" content="2" />
            </li>
            <li><span className="mx-1">/</span></li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="text-[#222] font-medium">{category.name}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </div>
      </nav>

      <div className="max-w-[1290px] mx-auto px-6 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-[32px] font-[900] text-[#222]">{category.name}</h1>
          {category.description && (
            <p className="mt-3 text-[#555] text-[16px]">{category.description}</p>
          )}
          <p className="mt-2 text-[14px] text-[#888]">Showing {total} products</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#e2e5e7]">
            <p className="text-[#666] text-[18px]">No products found in this category yet.</p>
            <Link href="/products" className="text-[#046db1] hover:underline mt-3 inline-block text-[15px]">
              Browse all categories
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/products/${slug}?page=${page - 1}`}
                    className="px-4 py-2 border border-[#e2e5e7] bg-white text-[14px] hover:bg-[#f9f9f9] text-[#222]"
                  >
                    &larr; Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/products/${slug}?page=${p}`}
                    className={`px-4 py-2 border text-[14px] ${
                      p === page
                        ? 'bg-[#2B6CB0] text-white border-[#2B6CB0]'
                        : 'bg-white border-[#e2e5e7] hover:bg-[#f9f9f9] text-[#222]'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={`/products/${slug}?page=${page + 1}`}
                    className="px-4 py-2 border border-[#e2e5e7] bg-white text-[14px] hover:bg-[#f9f9f9] text-[#222]"
                  >
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
