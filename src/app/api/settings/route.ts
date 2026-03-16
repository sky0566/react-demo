import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET /api/settings
export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST /api/settings — update a setting (admin only)
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { key, value } = await request.json();
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

    const db = getDb();
    const existing = db.prepare('SELECT key FROM site_settings WHERE key = ?').get(key);
    if (existing) {
      db.prepare('UPDATE site_settings SET value = ? WHERE key = ?').run(value, key);
    } else {
      db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run(key, value);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
