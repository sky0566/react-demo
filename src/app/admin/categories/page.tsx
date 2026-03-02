'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  product_count: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', sort_order: 0 });

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/categories/${editing.id}` : '/api/categories';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', slug: '', description: '', sort_order: 0 });
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, sort_order: cat.sort_order });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{categories.length} categories</p>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', slug: '', description: '', sort_order: 0 }); setShowForm(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-blue-200">
          <h3 className="font-semibold mb-4">{editing ? 'Edit Category' : 'New Category'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="auto-generated if empty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number" value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                {editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Products</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-600">{cat.product_count}</td>
                <td className="px-4 py-3 text-gray-600">{cat.sort_order}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(cat)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
