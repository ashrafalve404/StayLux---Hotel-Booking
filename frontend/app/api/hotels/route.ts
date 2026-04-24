import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getAuthHeaders(request: NextRequest, body?: any): Record<string, string> {
  let token: string | undefined = request.cookies.get('token')?.value;
  if (!token && body?.token) token = body.token;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  return token 
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const ownerId = url.searchParams.get('ownerId');
  
  let endpoint = '/hotels';
  if (ownerId) endpoint += `?ownerId=${ownerId}`;
  
  const headers = getAuthHeaders(request);
  const response = await fetch(`${API_URL}${endpoint}`, { headers: headers as any });
  
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = getAuthHeaders(request, body);
    
    const res = await fetch(`${API_URL}/hotels`, {
      method: 'POST',
      headers: headers as any,
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}