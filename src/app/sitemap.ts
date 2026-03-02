import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gallopliftparts.com';
  const db = getDb();

  const categories = db.prepare('SELECT slug, updated_at FROM categories').all() as { slug: string; updated_at: string }[];
  const products = db.prepare('SELECT slug, updated_at FROM products WHERE is_active = 1').all() as { slug: string; updated_at: string }[];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/products/${cat.slug}`,
    lastModified: new Date(cat.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(prod.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
