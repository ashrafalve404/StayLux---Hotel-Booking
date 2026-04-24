import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json({ message: data.message || 'Registration failed' }, { status: res.status });
    }
    
    const response = NextResponse.json(data);
    if (data.access_token) {
      response.cookies.set('token', data.access_token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}