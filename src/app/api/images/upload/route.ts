import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'wp', 'uploads');
const ALLOWED_TYPES = new Set(['image/webp', 'image/png', 'image/jpeg', 'image/gif', 'image/svg+xml']);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const uploaded: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Validate type
      if (!ALLOWED_TYPES.has(file.type)) {
        errors.push(`${file.name}: unsupported type ${file.type}`);
        continue;
      }
      // Validate size
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: exceeds 5MB limit`);
        continue;
      }
      // Sanitize filename: only allow alphanumeric, hyphens, dots, underscores
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();

      // Avoid overwriting: add timestamp prefix if file exists
      let finalName = safeName;
      const destPath = path.join(UPLOAD_DIR, finalName);
      if (fs.existsSync(destPath)) {
        const ext = path.extname(safeName);
        const base = path.basename(safeName, ext);
        finalName = `${base}-${Date.now()}${ext}`;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(UPLOAD_DIR, finalName), buffer);
      uploaded.push(`/images/wp/uploads/${finalName}`);
    }

    return NextResponse.json({ uploaded, errors });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
