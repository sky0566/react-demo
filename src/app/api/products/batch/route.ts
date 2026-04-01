import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

// POST /api/products/batch - Batch import products from CSV (admin only)
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const db = getDb();
    const contentType = request.headers.get('content-type') || '';

    let items: Record<string, string>[];

    if (contentType.includes('text/csv') || contentType.includes('multipart/form-data')) {
      const text = await request.text();
      const parsed = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_'),
      });
      items = parsed.data;
    } else {
      const body = await request.json();
      items = Array.isArray(body) ? body : [body];
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Get category map for name-based lookups
    const categories = db.prepare('SELECT id, name, slug FROM categories').all() as { id: string; name: string; slug: string }[];
    const categoryMap = new Map<string, string>();
    for (const cat of categories) {
      categoryMap.set(cat.name.toLowerCase(), cat.id);
      categoryMap.set(cat.slug.toLowerCase(), cat.id);
    }

    const results = { success: 0, skipped: 0, errors: [] as string[] };

    const insertStmt = db.prepare(`
      INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, images, specifications, meta_title, meta_description, meta_keywords, is_active, is_featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStmt = db.prepare(`
      UPDATE products SET
        name = ?, description = ?, short_description = ?, category_id = ?,
        price = ?, original_price = ?, images = ?, specifications = ?,
        meta_title = ?, meta_description = ?, meta_keywords = ?,
        is_active = ?, is_featured = ?, updated_at = datetime('now')
      WHERE sku = ?
    `);

    const batchImport = db.transaction((rows: Record<string, string>[]) => {
      for (const row of rows) {
        try {
          const sku = row.sku?.trim();
          if (!sku) {
            results.errors.push(`Row missing SKU: ${JSON.stringify(row).slice(0, 100)}`);
            continue;
          }

          const name = row.name?.trim() || sku;
          const categoryKey = (row.category || row.category_id || '').toLowerCase().trim();
          const categoryId = categoryMap.get(categoryKey) || row.category_id || null;

          const images = row.images
            ? (row.images.startsWith('[') ? row.images : JSON.stringify(row.images.split(';').map((s: string) => s.trim()).filter(Boolean)))
            : '[]';

          const specs = row.specifications
            ? (row.specifications.startsWith('{') ? row.specifications : '{}')
            : '{}';

          // Check if SKU already exists - update instead
          const existing = db.prepare('SELECT id FROM products WHERE sku = ?').get(sku) as { id: string } | undefined;

          if (existing) {
            updateStmt.run(
              name,
              row.description || '',
              row.short_description || '',
              categoryId,
              parseFloat(row.price || '0') || 0,
              parseFloat(row.original_price || '0') || 0,
              images,
              specs,
              row.meta_title || name,
              row.meta_description || row.short_description || '',
              row.meta_keywords || '',
              row.is_active !== undefined ? parseInt(row.is_active) : 1,
              row.is_featured ? parseInt(row.is_featured) : 0,
              sku
            );
            results.success++;
            continue;
          }

          let slug = row.slug || slugify(name);
          let counter = 1;
          while (db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)) {
            slug = `${slugify(name)}-${counter}`;
            counter++;
          }

          insertStmt.run(
            uuidv4(),
            sku,
            name,
            slug,
            row.description || '',
            row.short_description || '',
            categoryId,
            parseFloat(row.price || '0') || 0,
            parseFloat(row.original_price || '0') || 0,
            images,
            specs,
            row.meta_title || name,
            row.meta_description || row.short_description || '',
            row.meta_keywords || '',
            row.is_active !== undefined ? parseInt(row.is_active) : 1,
            row.is_featured ? parseInt(row.is_featured) : 0,
            parseInt(row.sort_order || '0') || 0
          );
          results.success++;
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          results.errors.push(`Error processing "${row.sku}": ${msg}`);
        }
      }
    });

    batchImport(items);

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error('Error batch importing:', error);
    return NextResponse.json({ error: 'Batch import failed' }, { status: 500 });
  }
}
