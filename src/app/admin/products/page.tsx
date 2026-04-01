'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';
import ImagePicker from '@/components/ImagePicker';
import RichEditor from '@/components/RichEditor';
import MarkdownContent from '@/components/MarkdownContent';

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category_name?: string;
  price: number;
  is_active: number;
  is_featured: number;
  images: string;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const dragItemRef = useRef<number | null>(null);
  const dragOverItemRef = useRef<number | null>(null);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        all: '1',
        page: String(page),
        limit: '20',
        ...(search ? { search } : {}),
        ...(filterCategory ? { category_id: filterCategory } : {}),
        ...(filterStatus ? { status: filterStatus } : {}),
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, filterStatus]);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    fetchProducts(pagination.page);
  };

  const handleToggleActive = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_active: product.is_active ? 0 : 1 }),
    });
    fetchProducts(pagination.page);
  };

  const handleDragSort = async () => {
    if (dragItemRef.current === null || dragOverItemRef.current === null) return;
    if (dragItemRef.current === dragOverItemRef.current) return;

    const reordered = [...products];
    const [draggedItem] = reordered.splice(dragItemRef.current, 1);
    reordered.splice(dragOverItemRef.current, 0, draggedItem);
    setProducts(reordered);

    dragItemRef.current = null;
    dragOverItemRef.current = null;

    // Save new order to server
    const orders = reordered.map((p, idx) => ({ id: p.id, sort_order: idx }));
    await fetch('/api/products/reorder', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orders }),
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            className="px-4 py-2 border rounded-lg text-sm w-56"
          />
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); }}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); }}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => fetchProducts()}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
          >
            Search
          </button>
          {(search || filterCategory || filterStatus) && (
            <button
              onClick={() => { setSearch(''); setFilterCategory(''); setFilterStatus(''); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/batch"
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            Batch Import
          </Link>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSaved={() => { setShowForm(false); setEditingProduct(null); fetchProducts(pagination.page); }}
        />
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-8 px-2 py-3"></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No products found. Add your first product or use batch import.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => {
                  const images = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={() => { dragItemRef.current = index; }}
                      onDragEnter={() => { dragOverItemRef.current = index; }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={handleDragSort}
                    >
                      <td className="px-2 py-3 text-gray-400">
                        <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
                        </svg>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={images[0]} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{product.sku}</td>
                      <td className="px-4 py-3 text-gray-600">{product.category_name || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Quote'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => { setEditingProduct(product); setShowForm(true); }}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-600">
              {pagination.total} products total
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchProducts(p)}
                  className={`px-3 py-1 rounded text-sm ${
                    p === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Form Modal Component
function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    description: '',
    short_description: '',
    category_id: '',
    price: product?.price || 0,
    original_price: 0,
    images: [] as string[],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_active: 1,
    is_featured: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>(product ? 'preview' : 'edit');
  const formRef = useRef<HTMLFormElement>(null);
  const categoryName = categories.find(c => String(c.id) === String(form.category_id))?.name || '';
  useEffect(() => {
    if (product) {
      fetch(`/api/products/${product.id}`)
        .then((r) => r.json())
        .then((data) => {
          const p = data.product;
          if (p) {
            const imgs = (() => { try { return JSON.parse(p.images); } catch { return []; } })();
            setForm({
              sku: p.sku,
              name: p.name,
              description: p.description || '',
              short_description: p.short_description || '',
              category_id: p.category_id || '',
              price: p.price || 0,
              original_price: p.original_price || 0,
              images: imgs,
              meta_title: p.meta_title || '',
              meta_description: p.meta_description || '',
              meta_keywords: p.meta_keywords || '',
              is_active: p.is_active,
              is_featured: p.is_featured,
            });
          }
        });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = { ...form, images: form.images, price: Number(form.price), original_price: Number(form.original_price) };

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSaved();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{form.name || 'New Product'}</h1>
            {form.sku && <span className="text-xs text-gray-400 font-mono">SKU: {form.sku}</span>}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${mode === 'preview' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${mode === 'edit' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Edit
            </button>
          </div>
          {mode === 'edit' && (
            <button
              type="button"
              disabled={saving}
              onClick={() => formRef.current?.requestSubmit()}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'preview' ? (
          /* ===== PREVIEW MODE ===== */
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Images */}
            {form.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="aspect-[4/3] bg-gray-50 border rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Header */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{form.name || 'Untitled Product'}</h2>
                  {form.sku && <p className="text-sm text-gray-400 font-mono mt-1">SKU: {form.sku}</p>}
                  {categoryName && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {categoryName}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {form.price > 0 && <div className="text-2xl font-bold text-gray-900">${form.price.toFixed(2)}</div>}
                  {form.original_price > 0 && form.original_price !== form.price && (
                    <div className="text-sm text-gray-400 line-through">${form.original_price.toFixed(2)}</div>
                  )}
                </div>
              </div>
              {form.short_description && <p className="text-gray-600 mt-4">{form.short_description}</p>}
              <div className="flex items-center space-x-3 mt-4">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${form.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </span>
                {form.is_featured === 1 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700">Featured</span>
                )}
              </div>
            </div>

            {/* Description */}
            {form.description && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Description</h3>
                <MarkdownContent content={form.description} />
              </div>
            )}

            {/* SEO Preview */}
            {(form.meta_title || form.name) && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Google Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-[#1a0dab] text-lg leading-tight">{form.meta_title || form.name}</div>
                  <div className="text-[#006621] text-sm mt-1">
                    gallopliftparts.com/product/{form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
                  </div>
                  <div className="text-[#545454] text-sm mt-1 line-clamp-2">
                    {form.meta_description || form.short_description || 'No description set.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ===== EDIT MODE ===== */
          <form ref={formRef} onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input type="text" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g., ELV-DOOR-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Product name" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="">-- Select --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                  <input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input type="text" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Brief product description" />
              </div>
              <div className="flex items-center space-x-6 mt-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={form.is_active === 1} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} className="rounded" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={form.is_featured === 1} onChange={(e) => setForm({ ...form, is_featured: e.target.checked ? 1 : 0 })} className="rounded" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <RichEditor
                label="Description"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                placeholder="Product description - supports Markdown"
                height={400}
              />
            </div>

            {/* Images Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Images</h3>
              <ImagePicker
                selected={form.images}
                onChange={(imgs) => setForm({ ...form, images: imgs })}
              />
            </div>

            {/* SEO Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">SEO Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input type="text" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="SEO title (auto-generated from name if empty)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea rows={2} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="SEO description (max 160 chars)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                  <input type="text" value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="keyword1, keyword2, keyword3" />
                </div>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</div>}

            <div className="flex justify-end pb-6">
              <button
                type="submit" disabled={saving}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
