import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDb, type News } from '@/lib/db';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const article = db.prepare('SELECT * FROM news WHERE slug = ? AND is_active = 1').get(slug) as News | undefined;

  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} - Gallop Lift Parts`,
    description: article.excerpt || `${article.title} - News from Gallop Lift Parts`,
    alternates: { canonical: `https://www.gallopliftparts.com/news/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const db = getDb();
  const article = db.prepare('SELECT * FROM news WHERE slug = ? AND is_active = 1').get(slug) as News | undefined;

  if (!article) notFound();

  // Related articles
  const related = db.prepare(
    'SELECT * FROM news WHERE id != ? AND is_active = 1 ORDER BY created_at DESC LIMIT 3'
  ).all(article.id) as News[];

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-[#e2e5e7]" aria-label="Breadcrumb">
        <div className="max-w-[1290px] mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-[14px] text-[#666]">
            <li><Link href="/" className="hover:text-[#046db1]">Home</Link></li>
            <li><span className="mx-1">/</span></li>
            <li><Link href="/news" className="hover:text-[#046db1]">News</Link></li>
            <li><span className="mx-1">/</span></li>
            <li className="text-[#222] font-medium line-clamp-1">{article.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-[900px] mx-auto px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <span className="text-[13px] text-[#2B6CB0] font-semibold uppercase tracking-wide">{article.category}</span>
          <h1 className="mt-2 text-[32px] font-bold text-[#222] leading-tight">{article.title}</h1>
          <p className="mt-3 text-[14px] text-[#888]">{formatDate(article.created_at)}</p>
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="mb-8 rounded-xl overflow-hidden relative" style={{ height: '400px' }}>
            <Image src={article.image} alt={article.title} fill className="object-cover" sizes="900px" priority />
          </div>
        )}

        {/* Content */}
        {article.content ? (
          <div
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : article.excerpt ? (
          <p className="text-[#555] text-[16px] leading-relaxed">{article.excerpt}</p>
        ) : null}

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-[#e2e5e7]">
          <Link href="/news" className="text-[#2B6CB0] font-medium text-[15px] hover:underline flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[22px] font-bold text-[#222] mb-6">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="block group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    {item.image ? (
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-[15px] text-[#222] line-clamp-2 group-hover:text-[#2B6CB0] transition-colors">{item.title}</h3>
                      <p className="mt-1 text-[12px] text-[#aaa]">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
