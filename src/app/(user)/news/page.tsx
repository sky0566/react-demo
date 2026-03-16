import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'News & Industry Insights',
  description: 'Latest news, industry trends and insights about elevator and escalator parts from Gallop Lift Parts.',
  alternates: { canonical: 'https://www.gallopliftparts.com/news' },
};

const articles = [
  {
    id: 1,
    title: 'How to Choose the Right Elevator Door Operator',
    excerpt: 'A comprehensive guide to selecting elevator door operators based on building type, traffic volume, and compliance requirements. Learn about AC vs DC operators and modern VVVF technology.',
    date: '2026-02-28',
    category: 'Technical Guide',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-door.jpg',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Escalator Maintenance Best Practices for 2026',
    excerpt: 'Regular maintenance is key to escalator safety and longevity. This article covers essential inspection points, common wear parts, and recommended replacement schedules.',
    date: '2026-02-20',
    category: 'Maintenance',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/05/escalator-step-7.png',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Understanding Elevator Safety Standards: EN 81 vs ASME A17.1',
    excerpt: 'Comparing European and North American elevator safety standards. How these regulations affect part selection and installation requirements for global projects.',
    date: '2026-02-12',
    category: 'Standards',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-landing-door-right.jpg',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Top 10 Elevator Parts That Need Regular Replacement',
    excerpt: 'From guide shoes to door rollers, discover the most commonly replaced elevator components and how to identify when they need attention before failures occur.',
    date: '2026-01-30',
    category: 'Technical Guide',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/door-controller-vf4.png',
    readTime: '4 min read',
  },
  {
    id: 5,
    title: 'The Future of Smart Elevators: IoT and Predictive Maintenance',
    excerpt: 'How IoT sensors and data analytics are transforming elevator maintenance. Predictive systems can reduce downtime by up to 50% and extend component lifespans.',
    date: '2026-01-18',
    category: 'Industry Trends',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/KM601370-1.webp',
    readTime: '8 min read',
  },
  {
    id: 6,
    title: 'Selcom vs Fermator: Comparing Door System Solutions',
    excerpt: 'A detailed comparison of two leading elevator door system manufacturers. Advantages, compatibility notes, and cost considerations for different project types.',
    date: '2026-01-05',
    category: 'Product Comparison',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/door-inverter-easy-con-1.webp',
    readTime: '6 min read',
  },
];

const categoryColors: Record<string, string> = {
  'Technical Guide': 'bg-blue-100 text-blue-700',
  'Maintenance': 'bg-emerald-100 text-emerald-700',
  'Standards': 'bg-purple-100 text-purple-700',
  'Industry Trends': 'bg-amber-100 text-amber-700',
  'Product Comparison': 'bg-rose-100 text-rose-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function NewsPage() {
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
          <h1 className="text-[36px] font-[900] text-[#222]">News & Insights</h1>
          <p className="mt-3 text-[#555] text-[16px] max-w-2xl">
            Stay updated with the latest industry trends, technical guides, and product news from the elevator and escalator industry.
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[featured.category] || 'bg-gray-100 text-gray-700'}`}>
                  {featured.category}
                </span>
                <span className="text-[13px] text-[#888]">{featured.readTime}</span>
              </div>
              <h2 className="text-[26px] font-bold text-[#222] leading-tight">{featured.title}</h2>
              <p className="mt-4 text-[#555] text-[15px] leading-relaxed">{featured.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[13px] text-[#888]">{formatDate(featured.date)}</span>
                <span className="text-[#2B6CB0] font-semibold text-[14px] flex items-center gap-1 hover:gap-2 transition-all cursor-default">
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-700'}`}>
                    {article.category}
                  </span>
                  <span className="text-[12px] text-[#aaa]">{article.readTime}</span>
                </div>
                <h3 className="text-[17px] font-bold text-[#222] leading-snug line-clamp-2 group-hover:text-[#2B6CB0] transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2.5 text-[#666] text-[14px] leading-relaxed line-clamp-3">{article.excerpt}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[12px] text-[#aaa]">{formatDate(article.date)}</span>
                  <span className="text-[#2B6CB0] font-medium text-[13px] flex items-center gap-1">
                    Read More
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#2B6CB0] to-[#0891b2] rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="text-[28px] font-bold">Stay Updated</h2>
          <p className="mt-3 text-white/80 max-w-lg mx-auto">
            Get the latest elevator and escalator industry news, technical guides, and product updates delivered to your inbox.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-[15px] focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-6 py-3 bg-white text-[#2B6CB0] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
