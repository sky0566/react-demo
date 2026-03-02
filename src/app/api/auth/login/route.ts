import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, checkRateLimit, resetRateLimit } from '@/lib/auth';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';
    const ip = forwarded.split(',')[0].trim();
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${Math.ceil((rateCheck.retryAfterSec || 900) / 60)} minutes.` },
        { status: 429 }
      );
    }

    const db = getDb();
    const { username, password } = await request.json();

    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as {
      id: string;
      username: string;
      password_hash: string;
      must_change_password: number;
    } | undefined;

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Successful login — reset rate limit
    resetRateLimit(ip);

    const token = signToken({ id: user.id, username: user.username });

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username },
      mustChangePassword: user.must_change_password === 1,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
