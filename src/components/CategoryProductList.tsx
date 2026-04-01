'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

interface Category {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  product_count: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  images: string;
  price: number;
  category_name?: string;
  category_slug?: string;
}

export default function CategoryProductList({ slug, categoryName }: { slug: string; categoryName: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState(slug === 'selcom' ? 'hot' : 'hot');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const pageRef = useRef(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch categories for sidebar
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async (reset = false) => {
    if (reset) {
      pageRef.current = 1;
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const params = new URLSearchParams({
      category: slug,
      page: String(pageRef.current),
      limit: '20',
      sort,
      ...(search ? { search } : {}),
    });

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      const newProducts = data.products || [];

      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setTotal(data.pagination?.total || 0);
      setHasMore(pageRef.current < (data.pagination?.totalPages || 1));
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug, sort, search]);

  // Reset and fetch on sort/search change
  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Infinite scroll - Intersection Observer
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          pageRef.current += 1;
          fetchProducts(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, fetchProducts]);

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-[220px] flex-shrink-0">
        <div className="sticky top-[80px] space-y-4">
          {/* Search */}
          <div className="bg-white border border-[#e2e5e7] rounded-lg overflow-hidden">
            <div className="flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products.."
                className="flex-1 px-4 py-3 text-[14px] outline-none"
              />
              <button className="px-4 py-3 text-[#888] hover:text-[#2B6CB0]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category List */}
          <div className="bg-white border border-[#e2e5e7] rounded-lg p-4">
            <h3 className="font-bold text-[16px] text-[#222] mb-3 uppercase">Product Categories</h3>
            <ul className="">
              {categories.map((cat, index) => (
                <li key={cat.id} className={index > 0 ? 'border-t border-[#e2e5e7]' : ''}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                      cat.slug === slug
                        ? 'bg-[#2B6CB0]/10 text-[#2B6CB0] font-semibold'
                        : 'text-[#444] hover:bg-gray-50 hover:text-[#2B6CB0]'
                    }`}
                  >
                    {cat.logo ? (
                      <Image src={cat.logo} alt={cat.name} width={28} height={20} unoptimized={cat.logo.endsWith('.svg')} className="w-7 h-5 object-contain flex-shrink-0" />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    )}
                    <span className="flex-1">{cat.name}</span>
                    <span className="text-[12px] text-[#999]">({cat.product_count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-[28px] font-[900] text-[#222]">{categoryName}</h1>
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <p className="text-[14px] text-[#888]">Showing {total} products</p>
            <div className="flex items-center gap-2 text-[14px]">
              <span className="text-[#888]">Sort by:</span>
              {[
                { label: 'Hot Selling', value: 'hot' },
                { label: 'Name', value: 'name' },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    sort === s.value
                      ? 'bg-[#2B6CB0] text-white'
                      : 'bg-white text-[#555] border border-[#e2e5e7] hover:border-[#2B6CB0] hover:text-[#2B6CB0]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#2B6CB0]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#e2e5e7]">
            <p className="text-[#666] text-[18px]">No products found.</p>
            <Link href="/products" className="text-[#046db1] hover:underline mt-3 inline-block text-[15px]">
              Browse all categories
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite scroll loader */}
            <div ref={loaderRef} className="py-8 flex justify-center">
              {loadingMore && (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-[#2B6CB0]" />
              )}
              {!hasMore && products.length > 0 && (
                <p className="text-[14px] text-[#999]">All products loaded</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
