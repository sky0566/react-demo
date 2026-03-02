import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { randomUUID } from 'crypto';

// GET — mock data stats
export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const db = getDb();
  const pvMock = (db.prepare('SELECT COUNT(*) as c FROM page_views WHERE is_mock = 1').get() as { c: number }).c;
  const pvReal = (db.prepare('SELECT COUNT(*) as c FROM page_views WHERE is_mock = 0').get() as { c: number }).c;
  const inqMock = (db.prepare('SELECT COUNT(*) as c FROM inquiries WHERE is_mock = 1').get() as { c: number }).c;
  const inqReal = (db.prepare('SELECT COUNT(*) as c FROM inquiries WHERE is_mock = 0').get() as { c: number }).c;

  return NextResponse.json({
    pageViews: { mock: pvMock, real: pvReal, total: pvMock + pvReal },
    inquiries: { mock: inqMock, real: inqReal, total: inqMock + inqReal },
  });
}

// POST — generate or clear mock data
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const db = getDb();
  const { action } = await request.json();

  if (action === 'clear') {
    const pvDeleted = db.prepare('DELETE FROM page_views WHERE is_mock = 1').run().changes;
    const inqDeleted = db.prepare('DELETE FROM inquiries WHERE is_mock = 1').run().changes;
    return NextResponse.json({ ok: true, deleted: { pageViews: pvDeleted, inquiries: inqDeleted } });
  }

  if (action === 'generate') {
    // Clear old mock data first
    db.prepare('DELETE FROM page_views WHERE is_mock = 1').run();
    db.prepare('DELETE FROM inquiries WHERE is_mock = 1').run();

    // ── Page views ──
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

    let pvGenerated = 0;
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
            page[0], page[1],
            referrers[Math.floor(Math.random() * referrers.length)],
            `hash_${Math.floor(Math.random() * 500)}`,
            countries[Math.floor(Math.random() * countries.length)],
            browsers[Math.floor(Math.random() * browsers.length)],
            oses[Math.floor(Math.random() * oses.length)],
            devices[Math.floor(Math.random() * devices.length)],
            d.toISOString().replace('T', ' ').slice(0, 19)
          );
          pvGenerated++;
        }
      }
    });
    seedPvs();

    // ── Inquiries ──
    const firstNames = ['James', 'Maria', 'Ahmed', 'Yuki', 'Hans', 'Chen', 'Priya', 'Carlos', 'Olga', 'David', 'Fatima', 'Sophie', 'Marco', 'Lisa', 'Raj'];
    const lastNames = ['Smith', 'Garcia', 'Ali', 'Tanaka', 'Mueller', 'Wang', 'Sharma', 'Silva', 'Petrov', 'Johnson', 'Hassan', 'Dubois', 'Rossi', 'Kim', 'Patel'];
    const companies = ['ABC Elevator Co.', 'Metro Lift Services', 'Global Escalator Ltd.', 'City Elevator Maintenance', 'Pacific Lift Solutions', 'Euro Elevator Group', 'Atlas Building Services', 'Prime Vertical Transport', 'United Lift Engineering', 'Star Elevator Inc.', 'Royal Lift Systems', 'Delta Escalator Services', ''];
    const messages = [
      'We need a quote for elevator door operator parts. Please send pricing and lead time.',
      'Looking for Kone elevator PCB boards. Can you provide availability and pricing?',
      'Interested in bulk purchase of escalator step chains. Please send catalog.',
      'Need replacement parts for Mitsubishi elevator. Model: GPS-3. Please advise.',
      'Request for quotation on Fermator door systems for our new building project.',
      'We are looking for Selcom door components. Need 50 sets. What is the delivery time?',
      'Can you supply escalator handrail chains? We need them urgently.',
      'Interested in your elevator guide shoes. Please send specifications and pricing.',
      'Need a complete door operator system for a residential elevator. Please quote.',
      'Looking for elevator encoder parts. Brand: Heidenhain. Please check availability.',
      'We need Canny elevator inverter. How fast can you ship to Saudi Arabia?',
      'Request for elevator traction machine spare parts. Please provide part list.',
      'Interested in partnership for elevator parts distribution in Southeast Asia.',
      'Need quotation for 100 pieces of elevator push buttons with LED indicators.',
      'Looking for escalator comb plates compatible with SJEC brand. Please advise.',
    ];
    const statuses = ['new', 'new', 'new', 'replied', 'replied', 'closed'];
    const phonePrefixes = ['+1', '+86', '+49', '+44', '+91', '+81', '+55', '+61', '+33', '+971'];

    // Get some real product IDs
    const products = db.prepare('SELECT id FROM products ORDER BY RANDOM() LIMIT 20').all() as { id: string }[];

    const insertInq = db.prepare(
      'INSERT INTO inquiries (id, product_id, name, email, phone, company, message, status, is_mock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)'
    );

    let inqGenerated = 0;
    const seedInqs = db.transaction(() => {
      const now = new Date();
      for (let i = 0; i < 35; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        const prefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
        const phone = `${prefix} ${Math.floor(Math.random() * 900000000 + 100000000)}`;
        const company = companies[Math.floor(Math.random() * companies.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const productId = products.length > 0 ? products[Math.floor(Math.random() * products.length)].id : null;

        const d = new Date(now);
        d.setDate(d.getDate() - Math.floor(Math.random() * 60));
        d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

        insertInq.run(
          randomUUID(), productId, name, email, phone, company, message, status,
          d.toISOString().replace('T', ' ').slice(0, 19)
        );
        inqGenerated++;
      }
    });
    seedInqs();

    return NextResponse.json({ ok: true, generated: { pageViews: pvGenerated, inquiries: inqGenerated } });
  }

  return NextResponse.json({ error: 'Invalid action. Use "clear" or "generate".' }, { status: 400 });
}
