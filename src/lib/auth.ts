import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'gallop-lift-parts-secret-key-change-in-production';

export function signToken(payload: { id: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string): { id: string; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string };
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

/** Verify admin auth from request. Returns user payload or a 401 NextResponse. */
export function requireAdmin(request: NextRequest): { id: string; username: string } | NextResponse {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  return user;
}

/* ---------- Login Rate Limiter (in-memory) ---------- */
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }
  if (record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.firstAttempt + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSec: retryAfter };
  }
  record.count++;
  return { allowed: true };
}

export function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}
