import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb, type Product } from '@/lib/db';
import { parseJsonSafe } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import QuoteForm from '@/components/QuoteForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const product = db.prepare(
    'SELECT * FROM products WHERE slug = ? AND is_active = 1'
  ).get(slug) as Product | undefined;

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description || `${product.name} - Quality elevator and escalator part. SKU: ${product.sku}`,
    keywords: product.meta_keywords || undefined,
    alternates: { canonical: `https://www.gallopliftparts.com/product/${slug}` },
    openGraph: {
      title: product.meta_title || product.name,
      description: product.meta_description || product.short_description,
      images: parseJsonSafe<string[]>(product.images, []).slice(0, 1),
      type: 'website',
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const db = getDb();

  const product = db.prepare(
    `SELECT p.*, c.name as category_name, c.slug as category_slug 
     FROM products p LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.slug = ? AND p.is_active = 1`
  ).get(slug) as (Product & { category_name: string; category_slug: string }) | undefined;

  if (!product) notFound();

  const images = parseJsonSafe<string[]>(product.images, []);
  const specifications = parseJsonSafe<Record<string, string>>(product.specifications, {});

  // Related products
  const related = db.prepare(
    `SELECT p.*, c.name as category_name, c.slug as category_slug 
     FROM products p LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1 
     ORDER BY RANDOM() LIMIT 4`
  ).all(product.category_id, product.id) as (Product & { category_name: string; category_slug: string })[];

  // JSON-LD Product Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short_description,
    sku: product.sku,
    image: images,
    url: `https://www.gallopliftparts.com/product/${slug}`,
    brand: {
      '@type': 'Brand',
      name: product.category_name || 'Gallop',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Suzhou Gallop Technology Co., Ltd.',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      ...(product.price > 0 ? { price: product.price } : {}),
      seller: {
        '@type': 'Organization',
        name: 'Suzhou Gallop Technology Co., Ltd.',
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
            {product.category_name && (
              <>
                <li><span className="mx-1">/</span></li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link href={`/products/${product.category_slug}`} itemProp="item" className="hover:text-[#046db1]">
                    <span itemProp="name">{product.category_name}</span>
                  </Link>
                  <meta itemProp="position" content="3" />
                </li>
              </>
            )}
            <li><span className="mx-1">/</span></li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="text-[#222] font-medium">{product.name}</span>
              <meta itemProp="position" content="4" />
            </li>
          </ol>
        </div>
      </nav>

      <article className="max-w-[1290px] mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery - matching WooCommerce layout */}
          <div>
            <div className="bg-white border border-[#e2e5e7] overflow-hidden">
              {images.length > 0 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={images[0]}
                  alt={product.name}
                  className="w-full object-contain p-6"
                  style={{ maxHeight: '500px' }}
                />
              ) : (
                <div className="w-full flex items-center justify-center text-[#ccc] p-12" style={{ height: '400px' }}>
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="bg-white border border-[#e2e5e7] overflow-hidden aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.name} - ${idx + 1}`} className="w-full h-full object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - WooCommerce style */}
          <div>
            <h1 className="text-[32px] font-[900] text-[#222] leading-tight">{product.name}</h1>

            {product.short_description && (
              <p className="mt-4 text-[#555] text-[16px] leading-relaxed">{product.short_description}</p>
            )}

            {/* Specifications Table */}
            {Object.keys(specifications).length > 0 && (
              <div className="mt-6">
                <div className="border border-[#e2e5e7] overflow-hidden">
                  {Object.entries(specifications).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`flex justify-between px-4 py-3 text-[15px] ${idx % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'}`}
                    >
                      <span className="font-medium text-[#222]">{key}</span>
                      <span className="text-[#555]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Quote / Request Quote button */}
            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/contact"
                className="bg-[#00a6d8] hover:bg-[#046db1] text-white font-medium py-3 px-8 text-[16px] transition-colors inline-block"
              >
                Request Quote
              </Link>
            </div>

            <p className="mt-3 text-[14px] text-[#666]">
              Please add the quotation and send it to us and get in touch with us immediately
            </p>

            {/* Guarantee checklist */}
            <ul className="mt-6 space-y-2 text-[15px] text-[#222]">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2B6CB0] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span>Global service 24/7</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2B6CB0] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span>Lowest price for all products</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2B6CB0] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span>Best quality with Production Process</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2B6CB0] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span>After-Sale Warranty</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2B6CB0] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span>Technical Support</span>
              </li>
            </ul>

            {/* SKU info */}
            <div className="mt-6 pt-4 border-t border-[#e2e5e7] text-[14px] text-[#666]">
              <span>SKU: {product.sku}</span>
              {product.category_name && (
                <span className="ml-4">Category: <Link href={`/products/${product.category_slug}`} className="text-[#046db1] hover:underline">{product.category_name}</Link></span>
              )}
            </div>
          </div>
        </div>

        {/* Description Tab */}
        {product.description && (
          <div className="mt-12">
            <div className="border-b border-[#e2e5e7]">
              <span className="inline-block bg-white border border-[#e2e5e7] border-b-white px-5 py-3 text-[15px] font-medium text-[#222] -mb-px">Description</span>
            </div>
            <div className="bg-white border border-[#e2e5e7] border-t-0 p-6">
              <div className="text-[#555] text-[16px] leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </div>
        )}

        {/* Packing and Shipping section placeholder */}
        <div className="mt-8 bg-white border border-[#e2e5e7] p-6">
          <h2 className="text-[22px] font-medium text-[#222] mb-4">Packing and Shipping</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['WORKSHOP', 'PACKING', 'LOADING', 'SHIPPING'].map((step) => (
              <div key={step} className="text-center">
                <div className="bg-[#f9f9f9] aspect-video flex items-center justify-center text-[#999] text-sm border border-[#e2e5e7]">
                  <span>{step}</span>
                </div>
                <p className="mt-2 text-[14px] text-[#555] font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Form */}
        <div className="mt-8 bg-white border border-[#e2e5e7] p-6">
          <h2 className="text-[22px] font-medium text-[#222] mb-4">Request a Quote</h2>
          <QuoteForm productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[22px] font-medium text-[#222] mb-6">Related products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
