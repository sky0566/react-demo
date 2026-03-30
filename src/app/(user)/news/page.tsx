import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getDb, type News } from '@/lib/db';

export const metadata: Metadata = {
  title: 'News & Shipping Updates',
  description: 'Latest shipping updates, delivery news and industry insights from Gallop Lift Parts.',
  alternates: { canonical: 'https://www.gallopliftparts.com/news' },
};

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const categoryColors: Record<string, string> = {
  'Shipping': 'bg-emerald-100 text-emerald-700',
  'News': 'bg-blue-100 text-blue-700',
  'Technical Guide': 'bg-purple-100 text-purple-700',
  'Industry Trends': 'bg-amber-100 text-amber-700',
};

export default function NewsPage() {
  const db = getDb();
  const articles = db.prepare(
    'SELECT * FROM news WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC'
  ).all() as News[];

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-[#e2e5e7]" aria-label="Breadcrumb">
        <div className="max-w-[1290px] mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-[14px] text-[#666]">
            <li><Link href="/" className="hover:text-[#046db1]">Home</Link></li>
            <li><span className="mx-1">/</span></li>
            <li className="text-[#222] font-medium">News</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-[1290px] mx-auto px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[36px] font-[900] text-[#222]">News & Updates</h1>
          <p className="mt-3 text-[#555] text-[16px] max-w-2xl">
            Stay updated with our latest shipping activities, delivery news, and industry insights.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#e2e5e7] rounded-xl">
            <p className="text-[#666] text-[18px]">No articles yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <div className="mb-12">
                <Link href={`/news/${featured.slug}`} className="block">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-[16/10] lg:aspect-auto overflow-hidden relative min-h-[300px]">
                      {featured.image ? (
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[300px] bg-gray-100 flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[featured.category] || 'bg-gray-100 text-gray-700'}`}>
                          {featured.category}
                        </span>
                      </div>
                      <h2 className="text-[26px] font-bold text-[#222] leading-tight">{featured.title}</h2>
                      {featured.excerpt && (
                        <p className="mt-4 text-[#555] text-[15px] leading-relaxed">{featured.excerpt}</p>
                      )}
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-[13px] text-[#888]">{formatDate(featured.created_at)}</span>
                        <span className="text-[#2B6CB0] font-semibold text-[14px] flex items-center gap-1">
                          Read More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Article Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="block">
                    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group h-full">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-700'}`}>
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-[17px] font-bold text-[#222] leading-snug line-clamp-2 group-hover:text-[#2B6CB0] transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="mt-2.5 text-[#666] text-[14px] leading-relaxed line-clamp-3">{article.excerpt}</p>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-[12px] text-[#aaa]">{formatDate(article.created_at)}</span>
                          <span className="text-[#2B6CB0] font-medium text-[13px] flex items-center gap-1">
                            Read More
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
