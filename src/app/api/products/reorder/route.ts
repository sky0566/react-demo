import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// PUT /api/products/reorder
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { orders } = body as { orders: { id: string; sort_order: number }[] };

    if (!Array.isArray(orders)) {
      return NextResponse.json({ error: 'Invalid orders array' }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE products SET sort_order = ? WHERE id = ?');
    const updateAll = db.transaction((items: { id: string; sort_order: number }[]) => {
      for (const item of items) {
        stmt.run(item.sort_order, item.id);
      }
    });

    updateAll(orders);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering products:', error);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}
