import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gallop-lift-parts-secret-key-change-in-production';

export function signToken(payload: { id: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
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
