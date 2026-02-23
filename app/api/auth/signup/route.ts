import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { users, User } from '@/lib/users';  // adjust path if you’re not using baseUrl/@

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const existing = users.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered.' },
        { status: 409 }
      );
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user: User = {
      id: users.length + 1,
      email,
      passwordHash,
    };

    users.push(user);

    return NextResponse.json({ message: 'User created.' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
