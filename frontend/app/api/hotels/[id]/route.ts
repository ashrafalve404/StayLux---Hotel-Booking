import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
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