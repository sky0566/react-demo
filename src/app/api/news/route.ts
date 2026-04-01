import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin } from '@/lib/auth';

// GET /api/news
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') !== '0';

    const where = activeOnly ? 'WHERE is_active = 1' : '';
    const news = db.prepare(
      `SELECT * FROM news ${where} ORDER BY sort_order ASC, created_at DESC`
    ).all();
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// POST /api/news (admin only)
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const db = getDb();
    const body = await request.json();
    const id = uuidv4();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM news').get() as { m: number | null };
    const sortOrder = body.sort_order ?? ((maxOrder?.m ?? 0) + 1);

    db.prepare(
      'INSERT INTO news (id, title, slug, content, excerpt, image, category, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      id,
      body.title,
      slug,
      body.content || '',
      body.excerpt || '',
      body.image || '',
      body.category || 'News',
      body.is_active ?? 1,
      sortOrder
    );

    const article = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
