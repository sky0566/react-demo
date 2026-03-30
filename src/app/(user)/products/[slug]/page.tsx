import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb, type Category } from '@/lib/db';
import CategoryProductList from '@/components/CategoryProductList';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
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
      description: `Quality ${category.name} elevator and escalator parts`,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const db = getDb();
  const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as Category | undefined;

  if (!category) notFound();

  return (
    <>
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
        <CategoryProductList slug={slug} categoryName={category.name} />
      </div>
    </>
  );
}
