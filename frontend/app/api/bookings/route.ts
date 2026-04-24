import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getAuthToken(request: NextRequest, body?: any): string | null {
  let token = request.cookies.get('token')?.value;
  if (!token && body?.token) token = body.token;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  return token;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const hotelId = url.searchParams.get('hotelId');
  
  let endpoint = '/bookings';
  if (userId) endpoint += `?userId=${userId}`;
  if (hotelId) endpoint += `?hotelId=${hotelId}`;
  
  const token = getAuthToken(request);
  const headers = token 
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
  
  const response = await fetch(`${API_URL}${endpoint}`, { headers });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = getAuthToken(request, body);
    const headers = token 
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
    
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}