import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDb, type Product } from '@/lib/db';
import { parseJsonSafe } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import QuoteForm from '@/components/QuoteForm';
import AddToCartButton from '@/components/AddToCartButton';

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
          {/* Image Gallery */}
          <div>
            <div className="overflow-hidden">
              {images.length > 0 ? (
                <div className="relative w-full" style={{ height: '350px' }}>
                  <Image
                    src={images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
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
                  <div key={idx} className="bg-white overflow-hidden aspect-square relative">
                    <Image src={img} alt={`${product.name} - ${idx + 1}`} fill className="object-contain" sizes="12vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - WooCommerce style */}
          <div>
            <h1 className="text-[24px] font-bold text-[#222] leading-tight">{product.name}</h1>

            {product.short_description && (
              <p className="mt-4 text-[#555] text-[16px] leading-relaxed">{product.short_description}</p>
            )}

            {/* Specifications Table */}
            {Object.keys(specifications).length > 0 && (
              <div className="mt-6">
                <h2 className="text-[18px] font-bold text-[#222] mb-3">Specifications</h2>
                <table className="w-full border-collapse border border-[#ddd] text-[14px]">
                  <tbody>
                    {Object.entries(specifications).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'}>
                        <td className="border border-[#ddd] px-4 py-2 font-semibold text-[#333] w-[40%]">{key}</td>
                        <td className="border border-[#ddd] px-4 py-2 text-[#555]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add to Quote / Request Quote button */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <AddToCartButton
                product={{ id: product.id, name: product.name, sku: product.sku, image: images[0] || '' }}
                className="bg-[#2B6CB0] text-white hover:bg-[#225a9a] font-medium py-3 px-6 text-[15px] rounded-lg"
              />
              <Link
                href="/cart"
                className="bg-white border-2 border-[#2B6CB0] text-[#2B6CB0] hover:bg-[#f0f7ff] font-medium py-3 px-6 text-[15px] transition-colors rounded-lg inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                View Quote List
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
              <h2 className="inline-block bg-white border border-[#e2e5e7] border-b-white px-5 py-3 text-[15px] font-bold text-[#222] -mb-px">Description</h2>
            </div>
            <div className="border border-[#e2e5e7] border-t-0 p-6">
              <div className="wp-content" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </div>
        )}

        {/* Packing and Shipping section placeholder */}
        <div className="mt-8 bg-white border border-[#e2e5e7] p-6">
          <h2 className="text-[20px] font-bold text-[#222] mb-4">Packing and Shipping</h2>
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
          <h2 className="text-[20px] font-bold text-[#222] mb-4">Request a Quote</h2>
          <QuoteForm productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[20px] font-bold text-[#222] mb-6">Related Products</h2>
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
