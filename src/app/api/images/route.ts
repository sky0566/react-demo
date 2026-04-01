import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const IMG_ROOT = path.join(process.cwd(), 'public', 'images', 'wp');
const EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg']);

function scanDir(dir: string, prefix: string): { folder: string; files: string[] }[] {
  const results: { folder: string; files: string[] }[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries
    .filter(e => e.isFile() && EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map(e => `/images/wp/${prefix}${e.name}`)
    .sort();

  if (files.length > 0) {
    results.push({ folder: prefix.replace(/\/$/, '') || 'root', files });
  }

  for (const e of entries.filter(e => e.isDirectory())) {
    results.push(...scanDir(path.join(dir, e.name), `${prefix}${e.name}/`));
  }

  return results;
}

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    const folders = scanDir(IMG_ROOT, '');

    if (search) {
      const filtered = folders
        .map(f => ({
          ...f,
          files: f.files.filter(file => path.basename(file).toLowerCase().includes(search)),
        }))
        .filter(f => f.files.length > 0);
      return NextResponse.json({ folders: filtered });
    }

    return NextResponse.json({ folders });
  } catch {
    return NextResponse.json({ error: 'Failed to scan images' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { files } = await request.json();
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files specified' }, { status: 400 });
    }

    const deleted: string[] = [];
    const errors: string[] = [];

    for (const filePath of files) {
      // Security: only allow deleting from uploads folder
      if (typeof filePath !== 'string' || !filePath.startsWith('/images/wp/uploads/')) {
        errors.push(`${filePath}: can only delete from uploads folder`);
        continue;
      }
      // Prevent path traversal
      const normalized = path.normalize(filePath);
      if (normalized.includes('..')) {
        errors.push(`${filePath}: invalid path`);
        continue;
      }
      const fullPath = path.join(process.cwd(), 'public', normalized);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        deleted.push(filePath);
      } else {
        errors.push(`${filePath}: not found`);
      }
    }

    return NextResponse.json({ deleted, errors });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
