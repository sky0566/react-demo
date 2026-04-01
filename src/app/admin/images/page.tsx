'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface ImageFolder {
  folder: string;
  files: string[];
}

export default function AdminImagesPage() {
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewImg, setPreviewImg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchImages = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const url = q ? `/api/images?search=${encodeURIComponent(q)}` : '/api/images';
      const r = await fetch(url, { headers: getAuthHeaders() });
      if (r.ok) {
        const data = await r.json();
        setFolders(data.folders || []);
        if (data.folders?.length && !activeFolder) {
          setActiveFolder(data.folders[0].folder);
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [activeFolder]);

  useEffect(() => { fetchImages(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setSelected(new Set());
    fetchImages(search);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('files', f));
      const r = await fetch('/api/images/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      if (r.ok) {
        const data = await r.json();
        if (data.errors?.length) {
          alert('Some files failed:\n' + data.errors.join('\n'));
        }
        await fetchImages();
        setActiveFolder('uploads');
      }
    } catch { /* ignore */ }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async () => {
    const files = Array.from(selected);
    const nonUploads = files.filter(f => !f.startsWith('/images/wp/uploads/'));
    if (nonUploads.length > 0) {
      alert('Only files in the uploads folder can be deleted.\n\nThese files cannot be deleted:\n' + nonUploads.join('\n'));
      return;
    }
    if (!confirm(`Delete ${files.length} file(s)? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const r = await fetch('/api/images', {
        method: 'DELETE',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });
      if (r.ok) {
        const data = await r.json();
        if (data.errors?.length) {
          alert('Some files failed:\n' + data.errors.join('\n'));
        }
        setSelected(new Set());
        await fetchImages();
      }
    } catch { /* ignore */ }
    setDeleting(false);
  };

  const toggleSelect = (src: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(src)) next.delete(src);
      else next.add(src);
      return next;
    });
  };

  const selectAllInFolder = () => {
    const files = currentFiles;
    setSelected(prev => {
      const next = new Set(prev);
      const allSelected = files.every(f => next.has(f));
      if (allSelected) {
        files.forEach(f => next.delete(f));
      } else {
        files.forEach(f => next.add(f));
      }
      return next;
    });
  };

  const copyPath = (src: string) => {
    navigator.clipboard.writeText(src);
  };

  const currentFiles = folders.find(f => f.folder === activeFolder)?.files || [];
  const totalFiles = folders.reduce((sum, f) => sum + f.files.length, 0);
  const isUploadsFolder = activeFolder === 'uploads';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Image Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalFiles} images in {folders.length} folders
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search filename..."
              className="px-3 py-2 border rounded-l-lg text-sm w-48"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-lg text-sm hover:bg-gray-200"
            >
              Search
            </button>
          </div>
          {/* Upload */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/webp,image/png,image/jpeg,image/gif,image/svg+xml"
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Folder sidebar */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Folders</h3>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {folders.map(f => (
                <button
                  key={f.folder}
                  onClick={() => { setActiveFolder(f.folder); setSelected(new Set()); }}
                  className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-50 transition-colors flex items-center justify-between ${
                    activeFolder === f.folder
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {f.folder}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">{f.files.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-t-xl shadow-sm border border-b-0 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={selectAllInFolder}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {currentFiles.length > 0 && currentFiles.every(f => selected.has(f)) ? 'Deselect all' : 'Select all'}
              </button>
              {selected.size > 0 && (
                <>
                  <span className="text-sm text-gray-500">{selected.size} selected</span>
                  <button
                    onClick={() => {
                      const paths = Array.from(selected).join('\n');
                      navigator.clipboard.writeText(paths);
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Copy paths
                  </button>
                  {isUploadsFolder && (
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : `Delete (${selected.size})`}
                    </button>
                  )}
                </>
              )}
            </div>
            <span className="text-xs text-gray-400">{currentFiles.length} files in {activeFolder || 'root'}</span>
          </div>

          {/* Grid */}
          <div
            className={`bg-white rounded-b-xl shadow-sm border min-h-[400px] p-4 transition-colors ${dragOver ? 'bg-blue-50 ring-2 ring-inset ring-blue-300' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              handleUpload(e.dataTransfer.files);
            }}
          >
            {uploading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                  <span className="text-sm text-gray-500">Uploading...</span>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : currentFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-lg">No images in this folder</p>
                <p className="text-sm">Drag & drop files here or click Upload</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {currentFiles.map(src => {
                  const isSelected = selected.has(src);
                  const filename = src.split('/').pop() || '';
                  return (
                    <div key={src} className="group relative">
                      <button
                        onClick={() => toggleSelect(src)}
                        className={`relative aspect-square w-full rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={filename} className="w-full h-full object-cover" loading="lazy" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                      {/* Filename + actions */}
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-[10px] text-gray-500 truncate flex-1" title={filename}>{filename}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPreviewImg(src)}
                            className="text-gray-400 hover:text-blue-500"
                            title="Preview"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => copyPath(src)}
                            className="text-gray-400 hover:text-green-500"
                            title="Copy path"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-3 px-1">
            <p className="text-xs text-gray-400">
              💡 Uploaded images are saved to <code className="bg-gray-100 px-1 rounded">public/images/wp/uploads/</code>. 
              Only uploaded images can be deleted. Original migrated images are read-only.
              {activeFolder !== 'uploads' && ' Note: On Vercel deployment, uploaded files are ephemeral — use external storage for persistence.'}
            </p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={() => setPreviewImg('')}>
          <div className="relative max-w-4xl max-h-[85vh] p-2" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImg} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-white text-sm truncate">{previewImg}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => copyPath(previewImg)}
                  className="px-3 py-1 bg-white/20 text-white rounded text-sm hover:bg-white/30"
                >
                  Copy path
                </button>
                <button
                  onClick={() => setPreviewImg('')}
                  className="px-3 py-1 bg-white/20 text-white rounded text-sm hover:bg-white/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
