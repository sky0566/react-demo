import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { username, password } = await request.json();

    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as {
      id: string;
      username: string;
      password_hash: string;
    } | undefined;

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: user.id, username: user.username });

    return NextResponse.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
