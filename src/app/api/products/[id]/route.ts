import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;

    // Try by slug first, then by id
    let product = db.prepare(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.slug = ? AND p.is_active = 1`
    ).get(id);

    if (!product) {
      product = db.prepare(
        `SELECT p.*, c.name as category_name, c.slug as category_slug 
         FROM products p LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.id = ?`
      ).get(id);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get related products from same category
    const related = db.prepare(
      `SELECT id, name, slug, images, price, sku FROM products 
       WHERE category_id = ? AND id != ? AND is_active = 1 
       ORDER BY RANDOM() LIMIT 4`
    ).all((product as Record<string, unknown>).category_id, (product as Record<string, unknown>).id);

    return NextResponse.json({ product, related });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    db.prepare(`
      UPDATE products SET 
        sku = COALESCE(?, sku),
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        short_description = COALESCE(?, short_description),
        category_id = COALESCE(?, category_id),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        images = COALESCE(?, images),
        specifications = COALESCE(?, specifications),
        meta_title = COALESCE(?, meta_title),
        meta_description = COALESCE(?, meta_description),
        meta_keywords = COALESCE(?, meta_keywords),
        is_active = COALESCE(?, is_active),
        is_featured = COALESCE(?, is_featured),
        sort_order = COALESCE(?, sort_order),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      body.sku ?? null,
      body.name ?? null,
      body.slug ?? null,
      body.description ?? null,
      body.short_description ?? null,
      body.category_id ?? null,
      body.price ?? null,
      body.original_price ?? null,
      body.images ? JSON.stringify(body.images) : null,
      body.specifications ? JSON.stringify(body.specifications) : null,
      body.meta_title ?? null,
      body.meta_description ?? null,
      body.meta_keywords ?? null,
      body.is_active ?? null,
      body.is_featured ?? null,
      body.sort_order ?? null,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
