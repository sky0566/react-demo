import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_path, page_title, referrer } = body;

    if (!page_path) {
      return NextResponse.json({ error: 'page_path required' }, { status: 400 });
    }

    const db = getDb();
    const ua = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';
    const ip = forwarded.split(',')[0].trim();

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

    db.prepare(`
      INSERT INTO page_views (page_path, page_title, referrer, user_agent, ip_hash, browser, os, device)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(page_path, page_title || '', referrer || '', ua, ipHash, browser, os, device);

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
