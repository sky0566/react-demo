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
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/inquiries?page=${page}&limit=20`);
    const data = await res.json();
    setInquiries(data.inquiries || []);
    setTotal(data.pagination?.total || 0);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-500">{total} total inquiries</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Message</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-500">Loading...</td></tr>
            ) : inquiries.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-500">No inquiries yet.</td></tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{inq.name}</div>
                    {inq.company && <div className="text-xs text-gray-500">{inq.company}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${inq.email}`} className="text-blue-600 hover:underline">{inq.email}</a>
                    {inq.phone && <div className="text-xs text-gray-500">{inq.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {inq.product_name || '-'}
                    {inq.product_sku && <div className="text-xs text-gray-400">{inq.product_sku}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{inq.message || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inq.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {inq.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {total > 20 && (
          <div className="flex justify-center py-4 border-t">
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * 20 >= total}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
