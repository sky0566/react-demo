'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        all: '1',
        page: String(page),
        limit: '20',
        ...(search ? { search } : {}),
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
  }, [search]);

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
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts(pagination.page);
  };

  const handleToggleActive = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: product.is_active ? 0 : 1 }),
    });
    fetchProducts(pagination.page);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            className="px-4 py-2 border rounded-lg text-sm w-64"
          />
          <button
            onClick={() => fetchProducts()}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
          >
            Search
          </button>
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
                  <td colSpan={6} className="text-center py-12 text-gray-500">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No products found. Add your first product or use batch import.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const images = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
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
    images: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_active: 1,
    is_featured: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
              images: imgs.join('\n'),
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

    const images = form.images.split('\n').map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, images, price: Number(form.price), original_price: Number(form.original_price) };

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input
                type="text" required value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="e.g., ELV-DOOR-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="Product name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">-- Select --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number" step="0.01" value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original</label>
                <input
                  type="number" step="0.01" value={form.original_price}
                  onChange={(e) => setForm({ ...form, original_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input
              type="text" value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Brief product description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Detailed product description (HTML supported)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (one per line)</label>
            <textarea
              rows={3} value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>

          {/* SEO Fields */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text" value={form.meta_title}
                  onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="SEO title (auto-generated from name if empty)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  rows={2} value={form.meta_description}
                  onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="SEO description (max 160 chars)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                <input
                  type="text" value={form.meta_keywords}
                  onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox" checked={form.is_active === 1}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox" checked={form.is_featured === 1}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked ? 1 : 0 })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
