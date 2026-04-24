import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (id) {
    const response = await fetch(`${backendUrl}/hotels/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(request.cookies.get('token') && { Authorization: `Bearer ${request.cookies.get('token')?.value}` }),
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }
  
  const response = await fetch(`${backendUrl}/hotels`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(request.cookies.get('token') && { Authorization: `Bearer ${request.cookies.get('token')?.value}` }),
    },
  });
  
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}