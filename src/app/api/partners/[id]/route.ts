import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// PUT /api/partners/[id] (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();

    db.prepare(`
      UPDATE partners SET
        name = COALESCE(?, name),
        logo = COALESCE(?, logo),
        website = COALESCE(?, website),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      body.name ?? null,
      body.logo ?? null,
      body.website ?? null,
      body.sort_order ?? null,
      body.is_active ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM partners WHERE id = ?').get(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 });
  }
}

// DELETE /api/partners/[id] (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const db = getDb();
    const { id } = await params;
    db.prepare('DELETE FROM partners WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}
