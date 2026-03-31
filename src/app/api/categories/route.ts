import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '@/lib/utils';

// GET /api/categories
export async function GET() {
  try {
    const db = getDb();
    const categories = db.prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) as product_count 
       FROM categories c ORDER BY c.sort_order ASC`
    ).all();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = uuidv4();
    const slug = body.slug || slugify(body.name);

    db.prepare(
      'INSERT INTO categories (id, name, slug, description, image, parent_id, sort_order, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(id, body.name, slug, body.description || '', body.image || '', body.parent_id || null, body.sort_order || 0, body.logo || '');

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
