import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// POST — change password
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { currentPassword, newPassword } = await request.json();

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(auth.id) as {
    id: string;
    password_hash: string;
    must_change_password: number;
  } | undefined;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // If not forced change, verify current password
  if (!user.must_change_password && currentPassword) {
    if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ?, must_change_password = 0 WHERE id = ?').run(newHash, auth.id);

  return NextResponse.json({ ok: true });
}
