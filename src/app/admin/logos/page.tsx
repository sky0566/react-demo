'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  logo: string;
  image: string;
}

export default function AdminLogosPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

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

  const handleLogoUpdate = async (id: string, logo: string) => {
    setSaving(id);
    await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logo }),
    });
    setCategories(prev => prev.map(c => c.id === id ? { ...c, logo } : c));
    setSaving(null);
  };

  const handleImageUpdate = async (id: string, image: string) => {
    setSaving(id);
    await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    });
    setCategories(prev => prev.map(c => c.id === id ? { ...c, image } : c));
    setSaving(null);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Category Logos & Images</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage logo icons (shown in sidebar/nav) and category images (shown on homepage) for each category.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Logo (Sidebar)</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Logo URL</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category Image (Homepage)</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Image URL</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <LogoRow
                key={cat.id}
                category={cat}
                saving={saving === cat.id}
                onLogoUpdate={(logo) => handleLogoUpdate(cat.id, logo)}
                onImageUpdate={(image) => handleImageUpdate(cat.id, image)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogoRow({
  category,
  saving,
  onLogoUpdate,
  onImageUpdate,
}: {
  category: Category;
  saving: boolean;
  onLogoUpdate: (logo: string) => void;
  onImageUpdate: (image: string) => void;
}) {
  const [logoUrl, setLogoUrl] = useState(category.logo || '');
  const [imageUrl, setImageUrl] = useState(category.image || '');
  const [editingLogo, setEditingLogo] = useState(false);
  const [editingImage, setEditingImage] = useState(false);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 font-medium text-gray-900">{category.name}</td>
      <td className="px-4 py-3">
        {category.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.logo} alt={category.name} className="h-8 w-auto object-contain" />
        ) : (
          <span className="text-gray-400 text-xs">No logo</span>
        )}
      </td>
      <td className="px-4 py-3">
        {editingLogo ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="px-2 py-1 border rounded text-xs w-48"
              placeholder="Logo URL"
            />
            <button
              onClick={() => { onLogoUpdate(logoUrl); setEditingLogo(false); }}
              disabled={saving}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => { setLogoUrl(category.logo || ''); setEditingLogo(false); }}
              className="px-2 py-1 text-gray-500 text-xs hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-500 truncate max-w-[200px] block">
            {category.logo || '-'}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {category.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.image} alt={category.name} className="h-12 w-auto object-contain" />
        ) : (
          <span className="text-gray-400 text-xs">No image</span>
        )}
      </td>
      <td className="px-4 py-3">
        {editingImage ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="px-2 py-1 border rounded text-xs w-48"
              placeholder="Image URL"
            />
            <button
              onClick={() => { onImageUpdate(imageUrl); setEditingImage(false); }}
              disabled={saving}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => { setImageUrl(category.image || ''); setEditingImage(false); }}
              className="px-2 py-1 text-gray-500 text-xs hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-500 truncate max-w-[200px] block">
            {category.image || '-'}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setEditingLogo(true)}
            className="text-blue-600 hover:underline text-xs"
          >
            Edit Logo
          </button>
          <button
            onClick={() => setEditingImage(true)}
            className="text-blue-600 hover:underline text-xs"
          >
            Edit Image
          </button>
        </div>
      </td>
    </tr>
  );
}
