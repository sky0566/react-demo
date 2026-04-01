'use client';

import { useEffect, useState } from 'react';
import { SingleImagePicker } from '@/components/ImagePicker';

interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  sort_order: number;
  is_active: number;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState({ name: '', logo: '', website: '', sort_order: 0, is_active: 1 });

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const fetchPartners = async () => {
    setLoading(true);
    const res = await fetch('/api/partners');
    const data = await res.json();
    setPartners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/partners/${editing.id}` : '/api/partners';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', logo: '', website: '', sort_order: 0, is_active: 1 });
    fetchPartners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    await fetch(`/api/partners/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    fetchPartners();
  };

  const toggleActive = async (partner: Partner) => {
    await fetch(`/api/partners/${partner.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_active: partner.is_active ? 0 : 1 }),
    });
    fetchPartners();
  };

  const openEdit = (p: Partner) => {
    setEditing(p);
    setForm({ name: p.name, logo: p.logo, website: p.website, sort_order: p.sort_order, is_active: p.is_active });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{partners.length} partners</p>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', logo: '', website: '', sort_order: 0, is_active: 1 }); setShowForm(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          + Add Partner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-blue-200">
          <h3 className="font-semibold mb-4">{editing ? 'Edit Partner' : 'New Partner'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="e.g. Kone"
              />
            </div>
            <div>
              <SingleImagePicker
                label="Logo URL *"
                value={form.logo}
                onChange={(url) => setForm({ ...form, logo: url })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="url" value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="https://example.com"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number" value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Hidden</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                {editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border rounded-lg text-sm">
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
              <th className="text-left px-4 py-3 font-medium text-gray-600">Logo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Website</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : partners.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No partners yet. Click &quot;+ Add Partner&quot; to add one.</td></tr>
            ) : partners.map((p) => (
              <tr key={p.id} className={`hover:bg-gray-50 ${!p.is_active ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="w-24 h-12 border border-gray-100 rounded flex items-center justify-center bg-gray-50 p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain" />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[200px]">
                  {p.website ? (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{p.website}</a>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.sort_order}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.is_active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
