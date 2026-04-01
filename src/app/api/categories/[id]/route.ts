import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// PUT /api/categories/[id]
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
      UPDATE categories SET 
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        image = COALESCE(?, image),
        logo = COALESCE(?, logo),
        sort_order = COALESCE(?, sort_order),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      body.name ?? null,
      body.slug ?? null,
      body.description ?? null,
      body.image ?? null,
      body.logo ?? null,
      body.sort_order ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const db = getDb();
    const { id } = await params;
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
