import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_path, page_title, referrer, heartbeat } = body;

    if (!page_path) {
      return NextResponse.json({ error: 'page_path required' }, { status: 400 });
    }

    const db = getDb();

    // Check country blocking
    const ua = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';
    const ip = forwarded.split(',')[0].trim();
    const country = request.headers.get('x-vercel-ip-country') || '';

    // Look up country name from code if available
    const countryName = country ? (COUNTRY_NAMES[country.toUpperCase()] || country) : '';

    // Check if this country is blocked
    if (countryName) {
      const blocked = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('blocked_countries') as { value: string } | undefined;
      if (blocked) {
        const blockedList: string[] = JSON.parse(blocked.value);
        if (blockedList.includes(countryName)) {
          return NextResponse.json({ blocked: true }, { status: 403 });
        }
      }
    }

    // Simple hash of IP for privacy
    let ipHash = 'anon';
    if (ip) {
      let hash = 0;
      for (let i = 0; i < ip.length; i++) {
        hash = ((hash << 5) - hash) + ip.charCodeAt(i);
        hash |= 0;
      }
      ipHash = `hash_${Math.abs(hash)}`;
    }

    // Parse user agent for browser/os/device
    const browser = parseBrowser(ua);
    const os = parseOS(ua);
    const device = parseDevice(ua);

    if (heartbeat) {
      // Heartbeat: update the most recent page_view for this visitor instead of inserting a new row
      const updated = db.prepare(`
        UPDATE page_views SET created_at = datetime('now')
        WHERE rowid = (
          SELECT rowid FROM page_views WHERE ip_hash = ? ORDER BY created_at DESC LIMIT 1
        )
      `).run(ipHash);
      if (updated.changes === 0) {
        // No existing row, insert one
        db.prepare(`
          INSERT INTO page_views (page_path, page_title, referrer, user_agent, ip_hash, country, browser, os, device)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(page_path, page_title || '', '', ua, ipHash, countryName, browser, os, device);
      }
    } else {
      db.prepare(`
        INSERT INTO page_views (page_path, page_title, referrer, user_agent, ip_hash, country, browser, os, device)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(page_path, page_title || '', referrer || '', ua, ipHash, countryName, browser, os, device);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function parseBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR|Opera/i.test(ua)) return 'Opera';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Chrome/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua)) return 'Safari';
  if (/MSIE|Trident/i.test(ua)) return 'IE';
  return 'Other';
}

function parseOS(ua: string): string {
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac OS X|macOS/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}

function parseDevice(ua: string): string {
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  if (/Mobile|iPhone|Android.*Mobile/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', CN: 'China', DE: 'Germany', GB: 'United Kingdom',
  IN: 'India', JP: 'Japan', BR: 'Brazil', AU: 'Australia',
  CA: 'Canada', FR: 'France', RU: 'Russia', KR: 'South Korea',
  IT: 'Italy', ES: 'Spain', MX: 'Mexico', NL: 'Netherlands',
  TR: 'Turkey', SA: 'Saudi Arabia', AE: 'UAE', SG: 'Singapore',
  MY: 'Malaysia', ID: 'Indonesia', TH: 'Thailand', VN: 'Vietnam',
  EG: 'Egypt', ZA: 'South Africa', NG: 'Nigeria', IR: 'Iran',
  PK: 'Pakistan', PH: 'Philippines', PL: 'Poland', SE: 'Sweden',
  CH: 'Switzerland', BE: 'Belgium', PT: 'Portugal', AR: 'Argentina',
  CO: 'Colombia', CL: 'Chile', PE: 'Peru', UA: 'Ukraine',
  CZ: 'Czech Republic', RO: 'Romania', AT: 'Austria', DK: 'Denmark',
  NO: 'Norway', FI: 'Finland', IE: 'Ireland', NZ: 'New Zealand',
  IL: 'Israel', HK: 'Hong Kong', TW: 'Taiwan', GR: 'Greece',
};
