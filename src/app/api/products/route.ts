import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '@/lib/utils';

// GET /api/products?category=slug&page=1&limit=15&search=keyword
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const all = searchParams.get('all'); // for admin: get all including inactive
    const offset = (page - 1) * limit;

    let where = all ? '1=1' : 'p.is_active = 1';
    const params: (string | number)[] = [];

    if (category) {
      where += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      where += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (featured === '1') {
      where += ' AND p.is_featured = 1';
    }

    const countResult = db.prepare(
      `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE ${where}`
    ).get(...params) as { total: number };

    const products = db.prepare(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE ${where} 
       ORDER BY p.sort_order ASC, p.created_at DESC 
       LIMIT ? OFFSET ?`
    ).all(...params, limit, offset);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    // Support batch insert
    const items = Array.isArray(body) ? body : [body];
    const results: { success: number; errors: string[] } = { success: 0, errors: [] };

    const insertStmt = db.prepare(`
      INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, images, specifications, meta_title, meta_description, meta_keywords, is_active, is_featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((products: typeof items) => {
      for (const item of products) {
        try {
          const id = item.id || uuidv4();
          const slug = item.slug || slugify(item.name);
          
          // Check for duplicate SKU
          const existing = db.prepare('SELECT id FROM products WHERE sku = ?').get(item.sku);
          if (existing) {
            results.errors.push(`SKU "${item.sku}" already exists`);
            continue;
          }

          // Make slug unique
          let finalSlug = slug;
          let counter = 1;
          while (db.prepare('SELECT id FROM products WHERE slug = ?').get(finalSlug)) {
            finalSlug = `${slug}-${counter}`;
            counter++;
          }

          insertStmt.run(
            id,
            item.sku,
            item.name,
            finalSlug,
            item.description || '',
            item.short_description || '',
            item.category_id || null,
            item.price || 0,
            item.original_price || 0,
            JSON.stringify(item.images || []),
            JSON.stringify(item.specifications || {}),
            item.meta_title || item.name,
            item.meta_description || item.short_description || '',
            item.meta_keywords || '',
            item.is_active !== undefined ? item.is_active : 1,
            item.is_featured || 0,
            item.sort_order || 0
          );
          results.success++;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          results.errors.push(`Failed to insert "${item.sku || item.name}": ${message}`);
        }
      }
    });

    insertMany(items);

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
