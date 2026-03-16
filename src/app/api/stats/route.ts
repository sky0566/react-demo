import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const range = searchParams.get('range') || '30'; // days

    if (type === 'overview') {
      // Traffic summary by time periods
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      const periods = [
        { label: 'Today', days: 0, dateStr: todayStr },
        { label: 'Yesterday', days: -1, dateStr: yesterdayStr },
        { label: 'Last 7 Days', days: 7 },
        { label: 'Last 30 Days', days: 30 },
        { label: 'Last 60 Days', days: 60 },
        { label: 'Last 90 Days', days: 90 },
        { label: 'This Year', days: 365 },
        { label: 'Total', days: -999 },
      ];

      const results = periods.map((p) => {
        let views: number, visitors: number;
        if (p.days === 0) {
          // today
          views = (db.prepare(`SELECT COUNT(*) as c FROM page_views WHERE date(created_at) = ?`).get(todayStr) as { c: number }).c;
          visitors = (db.prepare(`SELECT COUNT(DISTINCT ip_hash) as c FROM page_views WHERE date(created_at) = ?`).get(todayStr) as { c: number }).c;
        } else if (p.days === -1) {
          // yesterday
          views = (db.prepare(`SELECT COUNT(*) as c FROM page_views WHERE date(created_at) = ?`).get(yesterdayStr) as { c: number }).c;
          visitors = (db.prepare(`SELECT COUNT(DISTINCT ip_hash) as c FROM page_views WHERE date(created_at) = ?`).get(yesterdayStr) as { c: number }).c;
        } else if (p.days === -999) {
          // total
          views = (db.prepare(`SELECT COUNT(*) as c FROM page_views`).get() as { c: number }).c;
          visitors = (db.prepare(`SELECT COUNT(DISTINCT ip_hash) as c FROM page_views`).get() as { c: number }).c;
        } else {
          const since = new Date(now);
          since.setDate(since.getDate() - p.days);
          const sinceStr = since.toISOString().replace('T', ' ').slice(0, 19);
          views = (db.prepare(`SELECT COUNT(*) as c FROM page_views WHERE created_at >= ?`).get(sinceStr) as { c: number }).c;
          visitors = (db.prepare(`SELECT COUNT(DISTINCT ip_hash) as c FROM page_views WHERE created_at >= ?`).get(sinceStr) as { c: number }).c;
        }
        return { label: p.label, views, visitors };
      });

      // Product & inquiry stats
      const totalProducts = (db.prepare('SELECT COUNT(*) as c FROM products').get() as { c: number }).c;
      const activeProducts = (db.prepare('SELECT COUNT(*) as c FROM products WHERE is_active = 1').get() as { c: number }).c;
      const totalCategories = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number }).c;
      const totalInquiries = (db.prepare('SELECT COUNT(*) as c FROM inquiries').get() as { c: number }).c;
      const newInquiries = (db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'new'").get() as { c: number }).c;

      return NextResponse.json({
        traffic: results,
        products: { total: totalProducts, active: activeProducts },
        categories: totalCategories,
        inquiries: { total: totalInquiries, new: newInquiries },
      });
    }

    if (type === 'traffic') {
      // Daily traffic trend for chart
      const days = parseInt(range) || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString().replace('T', ' ').slice(0, 19);

      const rows = db.prepare(`
        SELECT date(created_at) as date,
               COUNT(*) as views,
               COUNT(DISTINCT ip_hash) as visitors
        FROM page_views
        WHERE created_at >= ?
        GROUP BY date(created_at)
        ORDER BY date ASC
      `).all(sinceStr) as { date: string; views: number; visitors: number }[];

      return NextResponse.json({ data: rows });
    }

    if (type === 'pages') {
      // Most visited pages
      const days = parseInt(range) || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString().replace('T', ' ').slice(0, 19);

      const rows = db.prepare(`
        SELECT page_path, page_title,
               COUNT(*) as views,
               COUNT(DISTINCT ip_hash) as visitors
        FROM page_views
        WHERE created_at >= ?
        GROUP BY page_path
        ORDER BY views DESC
        LIMIT 10
      `).all(sinceStr) as { page_path: string; page_title: string; views: number; visitors: number }[];

      return NextResponse.json({ data: rows });
    }

    if (type === 'browsers') {
      const days = parseInt(range) || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString().replace('T', ' ').slice(0, 19);

      const browsers = db.prepare(`
        SELECT browser as name, COUNT(*) as value
        FROM page_views WHERE created_at >= ? AND browser != ''
        GROUP BY browser ORDER BY value DESC
      `).all(sinceStr);

      const oses = db.prepare(`
        SELECT os as name, COUNT(*) as value
        FROM page_views WHERE created_at >= ? AND os != ''
        GROUP BY os ORDER BY value DESC
      `).all(sinceStr);

      const devices = db.prepare(`
        SELECT device as name, COUNT(*) as value
        FROM page_views WHERE created_at >= ? AND device != ''
        GROUP BY device ORDER BY value DESC
      `).all(sinceStr);

      return NextResponse.json({ browsers, oses, devices });
    }

    if (type === 'countries') {
      const days = parseInt(range) || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString().replace('T', ' ').slice(0, 19);

      const rows = db.prepare(`
        SELECT country as name, COUNT(*) as views, COUNT(DISTINCT ip_hash) as visitors
        FROM page_views WHERE created_at >= ? AND country != ''
        GROUP BY country ORDER BY views DESC LIMIT 10
      `).all(sinceStr);

      return NextResponse.json({ data: rows });
    }

    if (type === 'referrers') {
      const days = parseInt(range) || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString().replace('T', ' ').slice(0, 19);

      const rows = db.prepare(`
        SELECT referrer as name, COUNT(*) as views
        FROM page_views WHERE created_at >= ? AND referrer != '' AND referrer != 'direct'
        GROUP BY referrer ORDER BY views DESC LIMIT 10
      `).all(sinceStr);

      return NextResponse.json({ data: rows });
    }

    if (type === 'visitors') {
      // Latest visitor breakdown
      const days = parseInt(range) || 7;
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString().replace('T', ' ').slice(0, 19);

      const rows = db.prepare(`
        SELECT ip_hash, browser, os, device, country, referrer,
               COUNT(*) as views,
               MAX(created_at) as last_visit
        FROM page_views
        WHERE created_at >= ?
        GROUP BY ip_hash
        ORDER BY views DESC
        LIMIT 20
      `).all(sinceStr);

      return NextResponse.json({ data: rows });
    }

    if (type === 'online') {
      // Visitors active in the last 5 minutes
      const fiveMinAgo = new Date();
      fiveMinAgo.setMinutes(fiveMinAgo.getMinutes() - 5);
      const sinceStr = fiveMinAgo.toISOString().replace('T', ' ').slice(0, 19);

      const online = db.prepare(`
        SELECT ip_hash, browser, os, device, country, page_path, page_title,
               MAX(created_at) as last_visit
        FROM page_views
        WHERE created_at >= ?
        GROUP BY ip_hash
        ORDER BY last_visit DESC
      `).all(sinceStr) as { ip_hash: string; browser: string; os: string; device: string; country: string; page_path: string; page_title: string; last_visit: string }[];

      return NextResponse.json({ data: online, count: online.length });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
