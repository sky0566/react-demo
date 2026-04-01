import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin } from '@/lib/auth';

// GET /api/partners
export async function GET() {
  try {
    const db = getDb();
    const partners = db.prepare(
      'SELECT * FROM partners ORDER BY sort_order ASC'
    ).all();
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST /api/partners (admin only)
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const db = getDb();
    const body = await request.json();
    const id = uuidv4();

    const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM partners').get() as { m: number | null };
    const sortOrder = body.sort_order ?? ((maxOrder?.m ?? 0) + 1);

    db.prepare(
      'INSERT INTO partners (id, name, logo, website, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, body.name, body.logo || '', body.website || '', sortOrder, body.is_active ?? 1);

    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(id);
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}
