import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { token, user } = body;

  const res = NextResponse.json({ success: true });

  // Set cookies (adjust options as needed)
  res.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  res.cookies.set('user', JSON.stringify(user), {
    httpOnly: false, // Can be accessed from client if needed
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
