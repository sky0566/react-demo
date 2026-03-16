'use client';

import { useEffect, useState, useCallback } from 'react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: string;
  product_name?: string;
  product_sku?: string;
  created_at: string;
  is_mock?: number;
}

type ModalMode = null | 'view' | 'edit';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modal/detail state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', company: '', message: '', status: '' });
  const [saving, setSaving] = useState(false);

  // Batch selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Toast
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      ...(search ? { search } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
    });
    const res = await fetch(`/api/inquiries?${params}`);
    const data = await res.json();
    setInquiries(data.inquiries || []);
    setTotal(data.pagination?.total || 0);
    setSelectedIds(new Set());
    setLoading(false);
  }, [page, search, statusFilter, dateFrom, dateTo]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  // Open detail/view modal
  const openView = (inq: Inquiry) => {
    setSelected(inq);
    setModalMode('view');
    // Auto-mark as read if new
    if (inq.status === 'new') {
      fetch(`/api/inquiries/${inq.id}`, { method: 'PATCH', headers, body: JSON.stringify({ status: 'read' }) })
        .then(() => { inq.status = 'read'; setInquiries([...inquiries]); });
    }
  };

  // Open edit modal
  const openEdit = (inq: Inquiry) => {
    setSelected(inq);
    setEditForm({ name: inq.name, email: inq.email, phone: inq.phone || '', company: inq.company || '', message: inq.message || '', status: inq.status });
    setModalMode('edit');
  };

  // Save edit
  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await fetch(`/api/inquiries/${selected.id}`, { method: 'PATCH', headers, body: JSON.stringify(editForm) });
    setSaving(false);
    if (res.ok) {
      showToast('Inquiry updated successfully');
      setModalMode(null);
      fetchInquiries();
    } else {
      showToast('Failed to update');
    }
  };

  // Delete single
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE', headers });
    if (res.ok) {
      showToast('Inquiry deleted');
      fetchInquiries();
      if (modalMode) setModalMode(null);
    }
  };

  // Batch delete
  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected inquiries?`)) return;
    const promises = Array.from(selectedIds).map(id =>
      fetch(`/api/inquiries/${id}`, { method: 'DELETE', headers })
    );
    await Promise.all(promises);
    showToast(`Deleted ${selectedIds.size} inquiries`);
    fetchInquiries();
  };

  // Change status
  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/inquiries/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ status }) });
    fetchInquiries();
  };

  // Toggle select
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };
  const toggleAll = () => {
    if (selectedIds.size === inquiries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(inquiries.map(i => i.id)));
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    read: 'bg-yellow-100 text-yellow-700',
    replied: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchInquiries()}
          className="px-4 py-2 border rounded-lg text-sm w-56"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>From</span>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm" />
          <span>To</span>
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm" />
        </div>
        <button onClick={() => { setPage(1); fetchInquiries(); }} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Search</button>
        {(search || statusFilter || dateFrom || dateTo) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setDateFrom(''); setDateTo(''); setPage(1); }} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Clear</button>
        )}
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{total} total inquiries</p>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{selectedIds.size} selected</span>
            <button onClick={handleBatchDelete} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={inquiries.length > 0 && selectedIds.size === inquiries.length} onChange={toggleAll} className="rounded" />
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email / Phone</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Message</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-500">Loading...</td></tr>
            ) : inquiries.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-500">No inquiries found.</td></tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id} className={`hover:bg-gray-50 ${inq.status === 'new' ? 'bg-blue-50/40' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(inq.id)} onChange={() => toggleSelect(inq.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openView(inq)} className="text-left hover:text-blue-600">
                      <div className="font-medium text-gray-900">{inq.name}</div>
                      {inq.company && <div className="text-xs text-gray-500">{inq.company}</div>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${inq.email}`} className="text-blue-600 hover:underline text-xs">{inq.email}</a>
                    {inq.phone && <div className="text-xs text-gray-500">{inq.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {inq.product_name || '-'}
                    {inq.product_sku && <div className="text-gray-400">{inq.product_sku}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate text-xs">{inq.message || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[inq.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openView(inq)} title="View" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </button>
                      <button onClick={() => openEdit(inq)} title="Edit" className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button onClick={() => handleDelete(inq.id)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {total > 20 && (
          <div className="flex justify-center py-4 border-t">
            <div className="flex space-x-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
              <span className="px-3 py-1 text-sm text-gray-600">Page {page} / {Math.ceil(total / 20)}</span>
              <button onClick={() => setPage(page + 1)} disabled={page * 20 >= total} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ===== View Modal ===== */}
      {modalMode === 'view' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalMode(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Inquiry Details</h3>
              <button onClick={() => setModalMode(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selected.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</label>
                  <p className="mt-1 text-sm text-gray-900">{selected.company || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                  <p className="mt-1"><a href={`mailto:${selected.email}`} className="text-sm text-blue-600 hover:underline">{selected.email}</a></p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selected.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product</label>
                  <p className="mt-1 text-sm text-gray-900">{selected.product_name || '-'}</p>
                  {selected.product_sku && <p className="text-xs text-gray-400">{selected.product_sku}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                  <p className="mt-1"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selected.status] || 'bg-gray-100 text-gray-700'}`}>{selected.status}</span></p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Message</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{selected.message || 'No message'}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-between">
              <button onClick={() => handleDelete(selected.id)} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
              <div className="flex gap-2">
                <button onClick={() => openEdit(selected)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">Edit</button>
                <button onClick={() => setModalMode(null)} className="px-4 py-2 text-sm bg-[#2B6CB0] text-white rounded-lg hover:bg-[#245a94]">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {modalMode === 'edit' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModalMode(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Edit Inquiry</h3>
              <button onClick={() => setModalMode(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                  <input value={editForm.company} onChange={e => setEditForm({ ...editForm, company: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
                <textarea value={editForm.message} onChange={e => setEditForm({ ...editForm, message: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button onClick={() => setModalMode(null)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm bg-[#2B6CB0] text-white rounded-lg hover:bg-[#245a94] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
