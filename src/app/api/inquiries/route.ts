import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET /api/inquiries
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const offset = (page - 1) * limit;

    let where = '1=1';
    const params: string[] = [];

    if (status) {
      where += ' AND i.status = ?';
      params.push(status);
    }

    if (search) {
      where += ' AND (i.name LIKE ? OR i.email LIKE ? OR i.company LIKE ? OR i.message LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (dateFrom) {
      where += ' AND date(i.created_at) >= ?';
      params.push(dateFrom);
    }

    if (dateTo) {
      where += ' AND date(i.created_at) <= ?';
      params.push(dateTo);
    }

    const countResult = db.prepare(
      `SELECT COUNT(*) as total FROM inquiries i WHERE ${where}`
    ).get(...params) as { total: number };

    const inquiries = db.prepare(
      `SELECT i.*, p.name as product_name, p.sku as product_sku
       FROM inquiries i 
       LEFT JOIN products p ON i.product_id = p.id 
       WHERE ${where}
       ORDER BY i.created_at DESC 
       LIMIT ? OFFSET ?`
    ).all(...params, limit, offset);

    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

// POST /api/inquiries
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = uuidv4();

    db.prepare(
      'INSERT INTO inquiries (id, product_id, name, email, phone, company, message) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, body.product_id || null, body.name, body.email, body.phone || '', body.company || '', body.message || '');

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}
