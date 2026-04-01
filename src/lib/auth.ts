import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'gallop-lift-parts-jwt-secret-2024';

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
  const token = getTokenFromHeader(request.headers.get('authorization'))
    || request.cookies.get('admin_token')?.value
    || null;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  return user;
}

/* ---------- Rate Limiter (in-memory, generic) ---------- */
const rateLimitStores = new Map<string, Map<string, { count: number; firstAttempt: number }>>();

function getRateLimitStore(name: string) {
  if (!rateLimitStores.has(name)) {
    rateLimitStores.set(name, new Map());
  }
  return rateLimitStores.get(name)!;
}

/* ---------- Login Rate Limiter ---------- */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  return checkRateLimitGeneric('login', ip, MAX_ATTEMPTS, WINDOW_MS);
}

export function resetRateLimit(ip: string) {
  getRateLimitStore('login').delete(ip);
}

/** Generic rate limiter for any endpoint */
export function checkRateLimitGeneric(
  store: string,
  key: string,
  maxAttempts: number,
  windowMs: number,
): { allowed: boolean; retryAfterSec?: number } {
  const attempts = getRateLimitStore(store);
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now - record.firstAttempt > windowMs) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return { allowed: true };
  }
  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
    return { allowed: false, retryAfterSec: retryAfter };
  }
  record.count++;
  return { allowed: true };
}

/** Helper: Get client IP from request */
export function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || request.headers.get('x-real-ip')
    || '0.0.0.0';
}
