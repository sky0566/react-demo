'use client';

import { useEffect, useState } from 'react';

interface ImportResult {
  success: number;
  skipped?: number;
  errors: string[];
}

export default function AdminBatchPage() {
  const [mode, setMode] = useState<'csv' | 'json' | 'form'>('csv');
  const [csvText, setCsvText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [formRows, setFormRows] = useState<Record<string, string>[]>([
    { sku: '', name: '', category: '', price: '', description: '', images: '' },
  ]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  const handleCsvImport = async () => {
    if (!csvText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/products/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv' },
        body: csvText,
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: 0, errors: ['Network error'] });
    } finally {
      setLoading(false);
    }
  };

  const handleJsonImport = async () => {
    if (!jsonText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const parsed = JSON.parse(jsonText);
      const res = await fetch('/api/products/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ success: 0, errors: [`Invalid JSON: ${e}`] });
    } finally {
      setLoading(false);
    }
  };

  const handleFormImport = async () => {
    const filtered = formRows.filter(r => r.sku && r.name);
    if (filtered.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const items = filtered.map(row => ({
        ...row,
        price: row.price || '0',
        images: row.images ? row.images.split(';').map((s: string) => s.trim()) : [],
        category_id: row.category,
      }));
      const res = await fetch('/api/products/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: 0, errors: ['Network error'] });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (file.name.endsWith('.json')) {
        setMode('json');
        setJsonText(text);
      } else {
        setMode('csv');
        setCsvText(text);
      }
    };
    reader.readAsText(file);
  };

  const addFormRow = () => {
    setFormRows([...formRows, { sku: '', name: '', category: '', price: '', description: '', images: '' }]);
  };

  const updateFormRow = (idx: number, field: string, value: string) => {
    const updated = [...formRows];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormRows(updated);
  };

  const removeFormRow = (idx: number) => {
    setFormRows(formRows.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {/* Mode Tabs */}
      <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-6 max-w-sm">
        {[
          { key: 'csv', label: 'CSV Import' },
          { key: 'json', label: 'JSON Import' },
          { key: 'form', label: 'Form Input' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key as 'csv' | 'json' | 'form'); setResult(null); }}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === tab.key ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
          <div className="text-center">
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600">
              <span className="text-blue-600 font-medium">Click to upload</span> a CSV or JSON file
            </p>
            <p className="text-xs text-gray-400 mt-1">Or paste content below</p>
          </div>
          <input type="file" accept=".csv,.json" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {/* CSV Mode */}
      {mode === 'csv' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-2">CSV Format</h3>
          <p className="text-sm text-gray-500 mb-4">
            Required columns: <code className="bg-gray-100 px-1 rounded">sku</code>, <code className="bg-gray-100 px-1 rounded">name</code>.
            Optional: <code className="bg-gray-100 px-1 rounded">category</code>, <code className="bg-gray-100 px-1 rounded">price</code>,{' '}
            <code className="bg-gray-100 px-1 rounded">description</code>, <code className="bg-gray-100 px-1 rounded">short_description</code>,{' '}
            <code className="bg-gray-100 px-1 rounded">images</code> (semicolon-separated URLs),{' '}
            <code className="bg-gray-100 px-1 rounded">meta_title</code>, <code className="bg-gray-100 px-1 rounded">meta_description</code>,{' '}
            <code className="bg-gray-100 px-1 rounded">meta_keywords</code>
          </p>
          <div className="mb-3">
            <button
              onClick={() => {
                setCsvText(
                  `sku,name,category,price,description,short_description,images,meta_title,meta_description,meta_keywords
ELV-DOOR-001,Elevator Door,elevator,0,High quality elevator door system,"Elevator door for commercial use",https://example.com/door.jpg,Elevator Door - Gallop Lift Parts,Quality elevator door replacement,elevator door parts
ESC-STEP-001,Escalator Step,escalator,0,Aluminum escalator step,"Standard escalator step with anti-slip surface",https://example.com/step.jpg,Escalator Step - Gallop,Escalator step replacement parts,escalator step aluminum`
                );
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Load sample CSV
            </button>
          </div>
          <textarea
            rows={12}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
            placeholder="sku,name,category,price,description&#10;ELV-DOOR-001,Elevator Door,elevator,0,High quality door"
          />
          <button
            onClick={handleCsvImport}
            disabled={loading || !csvText.trim()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Importing...' : 'Import CSV'}
          </button>
        </div>
      )}

      {/* JSON Mode */}
      {mode === 'json' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-2">JSON Format</h3>
          <p className="text-sm text-gray-500 mb-4">
            Array of product objects. Required fields: <code className="bg-gray-100 px-1 rounded">sku</code>, <code className="bg-gray-100 px-1 rounded">name</code>.
          </p>
          <div className="mb-3">
            <button
              onClick={() => {
                setJsonText(JSON.stringify([
                  {
                    sku: "ELV-DOOR-001",
                    name: "Elevator Door",
                    category: "elevator",
                    price: "0",
                    description: "High quality elevator door system",
                    short_description: "Commercial elevator door",
                    images: "https://example.com/door1.jpg;https://example.com/door2.jpg",
                    meta_title: "Elevator Door - Gallop Lift Parts",
                    meta_description: "Quality elevator door replacement parts",
                    meta_keywords: "elevator, door, parts"
                  },
                  {
                    sku: "ESC-STEP-001",
                    name: "Escalator Step",
                    category: "escalator",
                    price: "0",
                    description: "Aluminum escalator step",
                    images: "https://example.com/step.jpg"
                  }
                ], null, 2));
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Load sample JSON
            </button>
          </div>
          <textarea
            rows={14}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
            placeholder='[{"sku": "ELV-001", "name": "Elevator Door", "category": "elevator"}]'
          />
          <button
            onClick={handleJsonImport}
            disabled={loading || !jsonText.trim()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Importing...' : 'Import JSON'}
          </button>
        </div>
      )}

      {/* Form Mode */}
      {mode === 'form' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Batch Add Products</h3>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {formRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg">
                <div className="col-span-2">
                  <input
                    type="text" placeholder="SKU *" value={row.sku}
                    onChange={(e) => updateFormRow(idx, 'sku', e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text" placeholder="Name *" value={row.name}
                    onChange={(e) => updateFormRow(idx, 'name', e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <select
                    value={row.category}
                    onChange={(e) => updateFormRow(idx, 'category', e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  >
                    <option value="">Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <input
                    type="number" placeholder="Price" value={row.price}
                    onChange={(e) => updateFormRow(idx, 'price', e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text" placeholder="Description" value={row.description}
                    onChange={(e) => updateFormRow(idx, 'description', e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removeFormRow(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove row"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={addFormRow}
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600"
            >
              + Add Row
            </button>
            <button
              onClick={() => {
                const newRows = Array(10).fill(null).map(() => ({ sku: '', name: '', category: '', price: '', description: '', images: '' }));
                setFormRows([...formRows, ...newRows]);
              }}
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600"
            >
              + Add 10 Rows
            </button>
            <button
              onClick={handleFormImport}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 ml-auto"
            >
              {loading ? 'Importing...' : `Import ${formRows.filter(r => r.sku && r.name).length} Products`}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className={`mt-6 rounded-xl p-6 ${result.errors.length > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-center space-x-3 mb-3">
            <svg className={`w-6 h-6 ${result.errors.length > 0 ? 'text-yellow-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={result.errors.length > 0 ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'} />
            </svg>
            <h3 className="font-semibold text-gray-900">
              Import Complete: {result.success} products imported successfully
            </h3>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-yellow-800 mb-2">{result.errors.length} errors:</p>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, idx) => (
                  <li key={idx} className="text-sm text-yellow-700">• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Template Download */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-3">CSV Template</h3>
        <p className="text-sm text-gray-500 mb-4">
          Download or copy the template below. The <code className="bg-gray-100 px-1 rounded">category</code> field
          accepts category name or slug (e.g., &quot;elevator&quot;, &quot;escalator&quot;, &quot;selcom&quot;).
          Existing SKUs will be updated instead of duplicated.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <pre>{`sku,name,category,price,description,short_description,images,meta_title,meta_description,meta_keywords,is_active,is_featured
ELV-DOOR-001,Elevator Door,elevator,0,"Complete elevator door system","Commercial elevator door",https://img.com/a.jpg;https://img.com/b.jpg,"Elevator Door | Gallop","Quality elevator door parts","elevator door parts",1,0`}</pre>
        </div>
        <button
          onClick={() => {
            const template = 'sku,name,category,price,description,short_description,images,meta_title,meta_description,meta_keywords,is_active,is_featured\n';
            const blob = new Blob([template], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gallop_products_template.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
        >
          Download CSV Template
        </button>
      </div>
    </div>
  );
}
