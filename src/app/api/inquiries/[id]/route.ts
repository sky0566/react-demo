import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET /api/inquiries/[id] (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    const db = getDb();
    const inquiry = db.prepare(
      `SELECT i.*, p.name as product_name, p.sku as product_sku
       FROM inquiries i
       LEFT JOIN products p ON i.product_id = p.id
       WHERE i.id = ?`
    ).get(id);

    if (!inquiry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/inquiries/[id] — update status or fields (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    const db = getDb();
    const body = await request.json();

    // Check existence
    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Build dynamic update
    const allowed = ['status', 'name', 'email', 'phone', 'company', 'message'];
    const sets: string[] = [];
    const values: string[] = [];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        sets.push(`${key} = ?`);
        values.push(body[key]);
      }
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(id);
    db.prepare(`UPDATE inquiries SET ${sets.join(', ')} WHERE id = ?`).run(...values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/inquiries/[id] (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    const db = getDb();
    const result = db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
