import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// GET — mock data stats
export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const db = getDb();
  const mockCount = (db.prepare('SELECT COUNT(*) as c FROM page_views WHERE is_mock = 1').get() as { c: number }).c;
  const realCount = (db.prepare('SELECT COUNT(*) as c FROM page_views WHERE is_mock = 0').get() as { c: number }).c;
  const totalCount = mockCount + realCount;

  return NextResponse.json({ mockCount, realCount, totalCount });
}

// POST — generate or clear mock data
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const db = getDb();
  const { action } = await request.json();

  if (action === 'clear') {
    const result = db.prepare('DELETE FROM page_views WHERE is_mock = 1').run();
    return NextResponse.json({ ok: true, deleted: result.changes });
  }

  if (action === 'generate') {
    // Clear old mock data first
    db.prepare('DELETE FROM page_views WHERE is_mock = 1').run();

    const pages = [
      ['/', 'Home'],
      ['/products', 'Products'],
      ['/products/elevator', 'Elevator Parts'],
      ['/products/escalator', 'Escalator Parts'],
      ['/products/selcom', 'Selcom Parts'],
      ['/products/fermator', 'Fermator Parts'],
      ['/products/kone', 'Kone Parts'],
      ['/about', 'About Us'],
      ['/contact', 'Contact Us'],
      ['/cart', 'Cart'],
    ];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const oses = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const countries = ['United States', 'China', 'Germany', 'United Kingdom', 'India', 'Japan', 'Brazil', 'Australia', 'Canada', 'France'];
    const referrers = ['https://www.google.com', 'https://www.bing.com', 'https://www.baidu.com', '', 'direct', 'https://www.facebook.com'];

    const insertPv = db.prepare(
      'INSERT INTO page_views (page_path, page_title, referrer, ip_hash, country, browser, os, device, is_mock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)'
    );

    let generated = 0;
    const seedPvs = db.transaction(() => {
      const now = new Date();
      for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
        const d = new Date(now);
        d.setDate(d.getDate() - dayOffset);
        const viewsToday = Math.floor(Math.random() * 150) + 50;
        for (let v = 0; v < viewsToday; v++) {
          const page = pages[Math.floor(Math.random() * pages.length)];
          const hour = Math.floor(Math.random() * 24);
          const min = Math.floor(Math.random() * 60);
          d.setHours(hour, min, Math.floor(Math.random() * 60));
          insertPv.run(
            page[0],
            page[1],
            referrers[Math.floor(Math.random() * referrers.length)],
            `hash_${Math.floor(Math.random() * 500)}`,
            countries[Math.floor(Math.random() * countries.length)],
            browsers[Math.floor(Math.random() * browsers.length)],
            oses[Math.floor(Math.random() * oses.length)],
            devices[Math.floor(Math.random() * devices.length)],
            d.toISOString().replace('T', ' ').slice(0, 19)
          );
          generated++;
        }
      }
    });
    seedPvs();

    return NextResponse.json({ ok: true, generated });
  }

  return NextResponse.json({ error: 'Invalid action. Use "clear" or "generate".' }, { status: 400 });
}
