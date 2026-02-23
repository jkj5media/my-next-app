import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables.');
}

function getUserFromAuthHeader(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: number;
      email: string;
    };
    return payload;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const payload = getUserFromAuthHeader(req);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    id: payload.sub,
    email: payload.email,
  });
}
