'use client';

import { useEffect, useState } from 'react';

interface Stats {
  products: number;
  categories: number;
  inquiries: number;
  activeProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, inquiries: 0, activeProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, categoriesRes, inquiriesRes] = await Promise.all([
          fetch('/api/products?all=1&limit=1'),
          fetch('/api/categories'),
          fetch('/api/inquiries?limit=1'),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const inquiriesData = await inquiriesRes.json();

        const activeRes = await fetch('/api/products?limit=1');
        const activeData = await activeRes.json();

        setStats({
          products: productsData.pagination?.total || 0,
          categories: categoriesData.length || 0,
          inquiries: inquiriesData.pagination?.total || 0,
          activeProducts: activeData.pagination?.total || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, color: 'bg-blue-500', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Active Products', value: stats.activeProducts, color: 'bg-green-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Categories', value: stats.categories, color: 'bg-purple-500', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Inquiries', value: stats.inquiries, color: 'bg-orange-500', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Add Product</p>
              <p className="text-sm text-gray-500">Create a new product SKU</p>
            </div>
          </a>
          <a
            href="/admin/batch"
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Batch Import</p>
              <p className="text-sm text-gray-500">Import products via CSV</p>
            </div>
          </a>
          <a
            href="/admin/inquiries"
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors"
          >
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">View Inquiries</p>
              <p className="text-sm text-gray-500">Check customer messages</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
