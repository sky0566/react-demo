'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface ImageFolder {
  folder: string;
  files: string[];
}

interface ImagePickerProps {
  selected: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  buttonLabel?: string;
  compact?: boolean;
}

export default function ImagePicker({ selected, onChange, multiple = true, buttonLabel, compact }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  const fetchImages = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const url = q ? `/api/images?search=${encodeURIComponent(q)}` : '/api/images';
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
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

  useEffect(() => {
    if (open) {
      setTempSelected([...selected]);
      fetchImages();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    fetchImages(search);
  };

  const toggleImage = (src: string) => {
    if (!multiple) {
      setTempSelected([src]);
      return;
    }
    setTempSelected(prev =>
      prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
    );
  };

  const confirm = () => {
    onChange(tempSelected);
    setOpen(false);
  };

  const removeImage = (src: string) => {
    onChange(selected.filter(s => s !== src));
  };

  const currentFiles = folders.find(f => f.folder === activeFolder)?.files || [];

  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('files', f));
      const r = await fetch('/api/images/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (r.ok) {
        const data = await r.json();
        if (data.uploaded?.length) {
          // Refresh file list and switch to uploads folder
          await fetchImages();
          setActiveFolder('uploads');
          // Auto-select uploaded images
          if (multiple) {
            setTempSelected(prev => [...prev, ...data.uploaded]);
          } else {
            setTempSelected(data.uploaded.slice(0, 1));
          }
        }
        if (data.errors?.length) {
          alert('Some files failed:\n' + data.errors.join('\n'));
        }
      }
    } catch { /* ignore */ }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      {!compact && <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>}

      {/* Selected images preview */}
      {!compact && selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map((src, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              <button
                type="button"
                onClick={() => removeImage(src)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              {/* Drag handle hint */}
              <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center opacity-0 group-hover:opacity-100">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className={compact
          ? "px-3 py-2 text-sm bg-gray-100 border rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
          : "px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        }
      >
        {buttonLabel || 'Browse Images'}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-5xl h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Select Images</h3>
              <div className="flex items-center gap-3">
                {/* Upload button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/webp,image/png,image/jpeg,image/gif,image/svg+xml"
                  className="hidden"
                  onChange={e => handleUpload(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <div className="flex">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search filename..."
                    className="px-3 py-1.5 border rounded-l-lg text-sm w-48"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="px-3 py-1.5 bg-gray-100 border border-l-0 rounded-r-lg text-sm hover:bg-gray-200"
                  >
                    Search
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {tempSelected.length} selected
                </span>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Folder sidebar */}
              <div className="w-48 border-r bg-gray-50 overflow-y-auto flex-shrink-0">
                {folders.map(f => (
                  <button
                    type="button"
                    key={f.folder}
                    onClick={() => setActiveFolder(f.folder)}
                    className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 transition-colors ${
                      activeFolder === f.folder
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="truncate">{f.folder}</div>
                    <div className="text-xs text-gray-400">{f.files.length} files</div>
                  </button>
                ))}
              </div>

              {/* Image grid */}
              <div
                className={`flex-1 overflow-y-auto p-4 transition-colors ${dragOver ? 'bg-blue-50 ring-2 ring-inset ring-blue-300' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragOver(false);
                  handleUpload(e.dataTransfer.files);
                }}
              >
                {uploading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                      <span className="text-sm text-gray-500">Uploading...</span>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                ) : currentFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p>No images in this folder</p>
                    <p className="text-xs">Drag & drop files here or click Upload</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
                    {currentFiles.map(src => {
                      const isSelected = tempSelected.includes(src);
                      const filename = src.split('/').pop() || '';
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => toggleImage(src)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                            isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image src={src} alt={filename} fill className="object-cover" sizes="120px" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                            <p className="text-[9px] text-white truncate">{filename}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50">
              <div className="text-sm text-gray-500">
                {tempSelected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTempSelected([])}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm ({tempSelected.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Single Image Picker (for category image, logo, news image, partner logo) ---------- */
interface SingleImagePickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export function SingleImagePicker({ label, value, onChange, placeholder }: SingleImagePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
          placeholder={placeholder || 'Image URL'}
        />
        <ImagePicker
          selected={value ? [value] : []}
          onChange={(imgs) => onChange(imgs[0] || '')}
          multiple={false}
          buttonLabel="Browse"
          compact
        />
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="preview" className="h-9 w-auto object-contain border rounded p-0.5" />
        )}
      </div>
    </div>
  );
}
